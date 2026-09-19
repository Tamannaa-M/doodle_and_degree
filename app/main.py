import os
import shutil
import uuid
from typing import Optional
from fastapi import FastAPI, WebSocket, WebSocketDisconnect, UploadFile, File, Form, HTTPException, status
from fastapi.responses import FileResponse, JSONResponse
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from app.rooms import RoomManager

app = FastAPI(title="Doodle & Degree", description="Real-time Multiplayer Slide Study Pictionary Game")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

room_manager = RoomManager()

# Ensure required directories exist
os.makedirs("uploads", exist_ok=True)
os.makedirs("static", exist_ok=True)
os.makedirs("static/cache_slides", exist_ok=True)
os.makedirs("sample_slides", exist_ok=True)

# Mount static files
app.mount("/static", StaticFiles(directory="static"), name="static")

@app.get("/")
async def serve_home():
    return FileResponse("static/index.html")

@app.get("/room/{code}")
async def serve_room(code: str):
    return FileResponse("static/index.html")

@app.post("/api/rooms")
async def create_room(host_id: Optional[str] = Form(None), mode: str = Form("study"), draw_time: int = Form(120), total_rounds: int = Form(3)):
    if not host_id:
        host_id = "host_" + uuid.uuid4().hex[:8]
    room = room_manager.create_room(host_id=host_id, default_pdf="sample_slides/ml_lecture_slides.pdf")
    room.mode = mode if mode in ("classic", "study") else "study"
    room.draw_time = max(30, min(180, draw_time))
    room.total_rounds = max(1, min(10, total_rounds))
    return {
        "code": room.code,
        "host_id": host_id,
        "total_slides": len(room.slide_manager.slides),
        "pdf_name": room.slide_manager.pdf_name or "ML Lecture Slides"
    }

@app.get("/api/rooms/{code}")
async def get_room(code: str):
    room = room_manager.get_room(code)
    if not room:
        raise HTTPException(status_code=404, detail="Room not found")
    return {
        "code": room.code,
        "state": room.state,
        "player_count": len([p for p in room.players.values() if p.connected]),
        "host_id": room.host_id,
        "draw_time": room.draw_time,
        "total_rounds": room.total_rounds,
        "total_slides": len(room.slide_manager.slides),
        "pdf_name": room.slide_manager.pdf_name or "ML Lecture Slides"
    }

@app.post("/api/rooms/{code}/upload-pdf")
async def upload_pdf(code: str, file: UploadFile = File(...), player_id: str = Form(...)):
    room = room_manager.get_room(code)
    if not room:
        raise HTTPException(status_code=404, detail="Room not found")
    if player_id != room.host_id:
        raise HTTPException(403, "Only the host can upload slides")
    if room.state != "LOBBY":
        raise HTTPException(409, "Upload slides before starting the game")
    if not file.filename.lower().endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are supported")

    save_path = os.path.join("uploads", f"{code.upper()}_{uuid.uuid4().hex[:8]}_{os.path.basename(file.filename)}")
    with open(save_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    try:
        await room.update_pdf(save_path)
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Failed to process PDF: {str(e)}")

    return {
        "success": True,
        "total_slides": len(room.slide_manager.slides),
        "pdf_name": room.slide_manager.pdf_name
    }

@app.websocket("/ws/{code}/{player_id}")
async def websocket_endpoint(websocket: WebSocket, code: str, player_id: str):
    room = room_manager.get_room(code)
    if not room:
        await websocket.close(code=status.WS_1008_POLICY_VIOLATION)
        return

    await websocket.accept()

    try:
        while True:
            data = await websocket.receive_json()
            msg_type = data.get("type")

            if msg_type == "join":
                name = data.get("name", "Student").strip() or "Student"
                avatar = data.get("avatar", "cat")
                room.add_player(player_id, name, avatar, websocket)
                
                # Send full room state to the newly joined player
                await websocket.send_json({
                    "type": "room_state",
                    "state": room.get_room_state_dict(player_id)
                })

                # Broadcast player joined to everyone
                await room.broadcast({
                    "type": "player_joined",
                    "player": room.players[player_id].model_dump(),
                    "players": [p.model_dump() for p in room.players.values()]
                })

            elif msg_type == "profile" and player_id in room.players and room.state == "LOBBY":
                room.players[player_id].avatar = str(data.get("avatar", "cat"))[:80]
                await room.broadcast({"type": "player_left", "players": [p.model_dump() for p in room.players.values()]})

            elif msg_type == "update_settings":
                draw_time = data.get("draw_time", 120)
                total_rounds = data.get("total_rounds", 3)
                await room.update_settings(player_id, draw_time, total_rounds, data.get("mode", room.mode))

            elif msg_type == "return_to_lobby":
                await room.return_to_lobby(player_id)

            elif msg_type == "leave_room":
                await websocket.close()
                break

            elif msg_type == "start_game":
                await room.start_game(player_id)

            elif msg_type == "select_word":
                word = data.get("word", "")
                if word:
                    await room.set_secret_word(player_id, word)

            elif msg_type == "skip_slide":
                await room.skip_current_slide(player_id)

            elif msg_type == "stroke":
                stroke_data = data.get("stroke")
                if stroke_data:
                    await room.add_stroke(player_id, stroke_data)

            elif msg_type == "undo":
                await room.undo_stroke(player_id)

            elif msg_type == "clear":
                await room.clear_canvas(player_id)

            elif msg_type == "snapshot":
                snapshot_url = data.get("snapshot", "")
                if player_id == room.drawer_id and room.state == "ROUND_REVIEW":
                    await room.save_drawing_snapshot(snapshot_url)

            elif msg_type in ["guess", "chat"]:
                text = data.get("text", "")
                if text:
                    await room.handle_guess(player_id, text)

            elif msg_type == "ping":
                await websocket.send_json({"type": "pong"})

    except WebSocketDisconnect:
        pass
    except Exception:
        pass
    finally:
        # An old socket closing must not disconnect a freshly rejoined player.
        if room.connections.get(player_id) is websocket:
            await room.disconnect_player(player_id)
