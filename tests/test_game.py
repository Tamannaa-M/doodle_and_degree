import asyncio
import os
import sys
import unittest
from fastapi.testclient import TestClient
from app.main import app, room_manager

class TestDoodleAndDegree(unittest.TestCase):
    def setUp(self):
        self.client = TestClient(app)

    def test_home_page(self):
        response = self.client.get("/")
        self.assertEqual(response.status_code, 200)
        self.assertIn("DOODLE", response.text)
        self.assertIn("DEGREE", response.text)

    def test_room_creation(self):
        response = self.client.post("/api/rooms", data={"host_id": "test_host_1"})
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertIn("code", data)
        self.assertEqual(len(data["code"]), 6)
        self.assertGreater(data["total_slides"], 0)

        # Check room details
        room_resp = self.client.get(f"/api/rooms/{data['code']}")
        self.assertEqual(room_resp.status_code, 200)
        room_data = room_resp.json()
        self.assertEqual(room_data["code"], data["code"])
        self.assertEqual(room_data["state"], "LOBBY")

    def test_websocket_flow(self):
        # Create room
        res = self.client.post("/api/rooms", data={"host_id": "ws_host"})
        code = res.json()["code"]

        # Connect Host via WebSocket
        with self.client.websocket_connect(f"/ws/{code}/ws_host") as ws_host:
            # Send Join
            ws_host.send_json({"type": "join", "name": "Host Scholar", "avatar": "cat"})
            msg = ws_host.receive_json()
            self.assertEqual(msg["type"], "room_state")
            self.assertEqual(msg["state"]["code"], code)

            # ws_host gets its own player_joined broadcast
            msg_host_joined = ws_host.receive_json()
            self.assertEqual(msg_host_joined["type"], "player_joined")

            # Connect Guesser via WebSocket
            with self.client.websocket_connect(f"/ws/{code}/ws_guesser") as ws_guesser:
                ws_guesser.send_json({"type": "join", "name": "Guesser Dino", "avatar": "dino"})
                guesser_state = ws_guesser.receive_json()
                self.assertEqual(guesser_state["type"], "room_state")

                # Both host and guesser receive player_joined for the guesser
                guesser_joined_on_host = ws_host.receive_json()
                self.assertEqual(guesser_joined_on_host["type"], "player_joined")
                self.assertEqual(guesser_joined_on_host["player"]["id"], "ws_guesser")

                guesser_joined_on_guesser = ws_guesser.receive_json()
                self.assertEqual(guesser_joined_on_guesser["type"], "player_joined")

                # Host starts game
                ws_host.send_json({"type": "start_game"})

                # Host receives word selection options
                drawer_word_prompt = ws_host.receive_json()
                self.assertEqual(drawer_word_prompt["type"], "word_selection_drawer")
                self.assertIn("simple_terms", drawer_word_prompt)

                # Guesser receives waiting screen
                guesser_wait = ws_guesser.receive_json()
                self.assertEqual(guesser_wait["type"], "word_selection_guesser")

                # Drawer selects a word
                test_word = drawer_word_prompt['slide']['word_boxes'][0]['word']
                ws_host.send_json({"type": "select_word", "word": test_word})

                # Drawer gets drawing started
                drawer_start = ws_host.receive_json()
                self.assertEqual(drawer_start["type"], "drawing_started_drawer")
                self.assertEqual(drawer_start["word"], test_word)

                # Guesser gets drawing started with masked word
                guesser_start = ws_guesser.receive_json()
                self.assertEqual(guesser_start["type"], "drawing_started_guesser")
                self.assertEqual(guesser_start["word_length"], len(test_word))

                # Drawer sends stroke
                test_stroke = {
                    "points": [{"x": 10, "y": 20}, {"x": 15, "y": 25}],
                    "color": "#1E1E24",
                    "width": 6,
                    "tool": "brush"
                }
                ws_host.send_json({"type": "stroke", "stroke": test_stroke})

                # Guesser receives stroke
                guesser_stroke = ws_guesser.receive_json()
                self.assertEqual(guesser_stroke["type"], "stroke_drawn")
                self.assertEqual(guesser_stroke["stroke"]["color"], "#1E1E24")

                # Guesser sends close guess
                ws_guesser.send_json({"type": "guess", "text": test_word[:-1]})
                # Guesser receives close guess badge
                close_badge = ws_guesser.receive_json()
                self.assertEqual(close_badge["type"], "close_guess")
                self.assertIn("Very close", close_badge["text"])

                # Now Guesser sends exact correct guess
                ws_guesser.send_json({"type": "guess", "text": test_word})
                correct_event = ws_guesser.receive_json()
                self.assertEqual(correct_event["type"], "correct_guess")
                self.assertGreater(correct_event["points"], 0)

if __name__ == "__main__":
    unittest.main()
