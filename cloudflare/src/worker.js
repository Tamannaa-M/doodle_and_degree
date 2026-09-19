const CLASSIC_WORDS = "Cat Dog Rocket Pizza Umbrella Bicycle Castle Rainbow Robot Guitar Penguin Butterfly Volcano Mermaid Lighthouse Snowman Dinosaur Popcorn Camera Octopus Balloon Airplane Turtle Dragon Waterfall Sandwich Sunflower Skateboard Pirate Telescope".split(" ");

const json = (value, status = 200) => new Response(JSON.stringify(value), {
  status,
  headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" }
});

function randomCode() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const bytes = crypto.getRandomValues(new Uint8Array(6));
  return [...bytes].map(x => chars[x % chars.length]).join("");
}

function blankState() {
  return {
    initialized: false, code: "", hostId: "", mode: "study", selectionTime: 20,
    reviewTime: 5, drawTime: 120, totalRounds: 3, currentRound: 1,
    phase: "LOBBY", players: {}, playerOrder: [], drawerIndex: 0, drawerId: null,
    currentWord: "", wordOptions: [], revealed: [], strokes: [], currentSlideIndex: 0,
    usedSlides: [], totalSlides: 0, pdfName: "ML Lecture Slides", deadline: 0,
    hintBroadcasted: false, studyPairs: []
  };
}

function cleanWord(value) { return String(value || "").trim().replace(/\s+/g, " "); }

function levenshtein(a, b) {
  a = a.toLowerCase().trim(); b = b.toLowerCase().trim();
  let prev = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 0; i < a.length; i++) {
    const row = [i + 1];
    for (let j = 0; j < b.length; j++) row.push(Math.min(row[j] + 1, prev[j + 1] + 1, prev[j] + (a[i] === b[j] ? 0 : 1)));
    prev = row;
  }
  return prev[b.length];
}

function isClose(guess, target) {
  const g = guess.toLowerCase().trim(), t = target.toLowerCase().trim();
  if (!g || g === t) return false;
  if (g.length >= 4 && (g.includes(t) || t.includes(g))) return true;
  const d = levenshtein(g, t);
  return t.length <= 4 ? d === 1 : t.length <= 8 ? d <= 2 : d <= 3;
}

function sample(items, count) {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1)); [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy.slice(0, count);
}

export class GameRoom {
  constructor(ctx, env) {
    this.ctx = ctx; this.env = env; this.room = null;
    this.ctx.setWebSocketAutoResponse(new WebSocketRequestResponsePair("ping", "pong"));
  }

  async load() {
    if (!this.room) this.room = (await this.ctx.storage.get("state")) || blankState();
    return this.room;
  }

  async save() { await this.ctx.storage.put("state", this.room); }

  sockets() { return this.ctx.getWebSockets(); }
  socketPlayer(ws) { try { return ws.deserializeAttachment()?.playerId || null; } catch { return null; } }
  connectedIds() { return new Set(this.sockets().map(ws => this.socketPlayer(ws)).filter(Boolean)); }

  playersList() {
    const online = this.connectedIds();
    return Object.values(this.room.players).map(p => ({ ...p, connected: online.has(p.id) }));
  }

  broadcast(message, excludeId = null) {
    const data = JSON.stringify(message);
    for (const ws of this.sockets()) {
      if (excludeId && this.socketPlayer(ws) === excludeId) continue;
      try { ws.send(data); } catch {}
    }
  }

  sendTo(playerId, message) {
    const data = JSON.stringify(message);
    for (const ws of this.sockets()) if (this.socketPlayer(ws) === playerId) { try { ws.send(data); } catch {} }
  }

  async getSlide(index = this.room.currentSlideIndex) { return (await this.ctx.storage.get(`slide:${index}`)) || null; }

  async replaceSlides(slides, name) {
    if (!Array.isArray(slides) || !slides.length) throw new Error("No readable slides were found in this PDF.");
    const existing = await this.ctx.storage.list({ prefix: "slide:" });
    await this.ctx.storage.delete([...existing.keys()]);
    for (let i = 0; i < slides.length; i++) await this.ctx.storage.put(`slide:${i}`, slides[i]);
    this.room.totalSlides = slides.length; this.room.pdfName = name || "Uploaded lecture";
    this.room.currentSlideIndex = 0; this.room.usedSlides = [];
    await this.save();
  }

  maskedWord() {
    const revealed = new Set(this.room.revealed);
    return [...this.room.currentWord].map((c, i) => " -_/()".includes(c) ? c : revealed.has(i) ? c.toUpperCase() : "_").join(" ");
  }

  wordLengths() { return (this.room.currentWord.match(/[A-Za-z0-9]+/g) || []).map(x => x.length); }
  remaining() { return Math.max(0, Math.ceil((this.room.deadline - Date.now()) / 1000)); }

  async hint() {
    const slide = await this.getSlide(); const word = this.room.currentWord;
    if (!slide || !word) return "Watch the drawing and use the letter count above.";
    const text = String(slide.text_content || "").replace(/\s+/g, " ").trim();
    const escaped = word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const re = new RegExp(`\\b${escaped}\\b`, "i");
    const sentences = text.split(/(?<=[.!?])\s+/).filter(s => re.test(s) && s.split(/\s+/).length >= 5).sort((a,b) => a.length-b.length);
    if (sentences[0]) return `Slide ${slide.page_num} · Fill the gap: ${sentences[0].slice(0,220).replace(re, "_____")}${sentences[0].length > 220 ? "…" : ""}`;
    return `Slide ${slide.page_num} · Look for a ${word.length}-letter word on this slide. Match it to the drawing.`;
  }

  async roomState(playerId) {
    const slide = this.room.mode === "study" ? await this.getSlide() : null;
    return {
      code: this.room.code, mode: this.room.mode,
      word_options: playerId === this.room.drawerId ? this.room.wordOptions : [], state: this.room.phase,
      host_id: this.room.hostId, draw_time: this.room.drawTime, total_rounds: this.room.totalRounds,
      current_round: this.room.currentRound, drawer_id: this.room.drawerId,
      is_drawer: playerId === this.room.drawerId,
      current_word: playerId === this.room.drawerId || ["ROUND_REVIEW","GAME_OVER"].includes(this.room.phase) ? this.room.currentWord : null,
      masked_word: this.maskedWord(), word_lengths: this.wordLengths(),
      hint: this.room.hintBroadcasted && this.room.mode === "study" ? await this.hint() : null,
      time_remaining: this.remaining(), players: this.playersList(), slide, strokes: this.room.strokes,
      total_slides: this.room.totalSlides, pdf_name: this.room.pdfName, study_pairs: this.room.studyPairs
    };
  }

  async fetch(request) {
    await this.load(); const url = new URL(request.url);
    if (url.pathname === "/init" && request.method === "POST") {
      if (!this.room.initialized) {
        const body = await request.json();
        Object.assign(this.room, blankState(), { initialized: true, code: body.code, hostId: body.host_id,
          mode: ["classic","study"].includes(body.mode) ? body.mode : "study",
          drawTime: Math.max(30, Math.min(180, Number(body.draw_time) || 120)),
          totalRounds: Math.max(1, Math.min(10, Number(body.total_rounds) || 3)) });
        await this.replaceSlides(body.slides, "ML Lecture Slides");
      }
      return json({ ok: true });
    }
    if (!this.room.initialized) return json({ detail: "Room not found" }, 404);
    if (url.pathname === "/info") return json({ code: this.room.code, state: this.room.phase,
      player_count: this.connectedIds().size, host_id: this.room.hostId, draw_time: this.room.drawTime,
      total_rounds: this.room.totalRounds, total_slides: this.room.totalSlides, pdf_name: this.room.pdfName });
    if (url.pathname === "/slides" && request.method === "POST") {
      const body = await request.json();
      if (body.player_id !== this.room.hostId) return json({ detail: "Only the host can upload slides" }, 403);
      if (this.room.phase !== "LOBBY") return json({ detail: "Upload slides before starting the game" }, 409);
      try { await this.replaceSlides(body.slides, body.filename); }
      catch (e) { return json({ detail: e.message }, 400); }
      this.broadcast({ type: "slides_updated", total_slides: this.room.totalSlides, pdf_name: this.room.pdfName });
      return json({ success: true, total_slides: this.room.totalSlides, pdf_name: this.room.pdfName });
    }
    if (url.pathname === "/connect" && request.headers.get("Upgrade") === "websocket") {
      const pair = new WebSocketPair(); const [client, server] = Object.values(pair);
      this.ctx.acceptWebSocket(server); server.serializeAttachment({ playerId: url.searchParams.get("player") });
      return new Response(null, { status: 101, webSocket: client });
    }
    return json({ detail: "Not found" }, 404);
  }

  async webSocketMessage(ws, raw) {
    await this.load();
    let data; try { data = JSON.parse(typeof raw === "string" ? raw : new TextDecoder().decode(raw)); } catch { return; }
    const playerId = this.socketPlayer(ws); const type = data.type;
    if (type === "join") {
      const existing = this.room.players[playerId];
      this.room.players[playerId] = { id: playerId, name: cleanWord(data.name).slice(0,30) || "Student",
        avatar: String(data.avatar || "cat").slice(0,80), score: existing?.score || 0,
        is_host: playerId === this.room.hostId, is_drawing: playerId === this.room.drawerId, has_guessed: existing?.has_guessed || false, connected: true };
      if (!this.room.playerOrder.includes(playerId)) this.room.playerOrder.push(playerId);
      await this.save(); this.sendTo(playerId, { type: "room_state", state: await this.roomState(playerId) });
      this.broadcast({ type: "player_joined", player: this.room.players[playerId], players: this.playersList() });
      return;
    }
    if (!this.room.players[playerId]) return;
    if (type === "profile" && this.room.phase === "LOBBY") this.room.players[playerId].avatar = String(data.avatar || "cat").slice(0,80);
    else if (type === "update_settings" && playerId === this.room.hostId && this.room.phase === "LOBBY") {
      this.room.mode = ["classic","study"].includes(data.mode) ? data.mode : "study";
      this.room.drawTime = Math.max(30, Math.min(180, Number(data.draw_time) || 120));
      this.room.totalRounds = Math.max(1, Math.min(10, Number(data.total_rounds) || 3));
      this.broadcast({ type: "settings_updated", mode: this.room.mode, draw_time: this.room.drawTime, total_rounds: this.room.totalRounds });
    } else if (type === "return_to_lobby" && playerId === this.room.hostId) await this.returnToLobby();
    else if (type === "leave_room") ws.close(1000, "Left room");
    else if (type === "start_game") await this.startGame(playerId);
    else if (type === "select_word") await this.selectWord(playerId, data.word);
    else if (type === "skip_slide") await this.skipSlide(playerId);
    else if (type === "stroke" && playerId === this.room.drawerId && this.room.phase === "DRAWING" && data.stroke) {
      this.room.strokes.push(data.stroke); this.broadcast({ type: "stroke_drawn", stroke: data.stroke }, playerId);
    } else if (type === "undo" && playerId === this.room.drawerId && this.room.phase === "DRAWING") {
      if (this.room.strokes.length) this.room.strokes.pop(); this.broadcast({ type: "stroke_undone" });
    } else if (type === "clear" && playerId === this.room.drawerId && this.room.phase === "DRAWING") {
      this.room.strokes = []; this.broadcast({ type: "canvas_cleared" });
    } else if (["guess","chat"].includes(type) && data.text) await this.guess(playerId, data.text);
    else if (type === "ping") this.sendTo(playerId, { type: "pong" });
    await this.save();
  }

  async webSocketClose(ws) { await this.disconnect(this.socketPlayer(ws)); }
  async webSocketError(ws) { await this.disconnect(this.socketPlayer(ws)); }

  async disconnect(playerId) {
    await this.load(); if (!playerId || !this.room.players[playerId]) return;
    if (playerId === this.room.hostId) {
      const online = [...this.connectedIds()].filter(id => id !== playerId);
      if (online[0]) { this.room.hostId = online[0]; for (const p of Object.values(this.room.players)) p.is_host = p.id === online[0]; }
    }
    this.broadcast({ type: "player_left", player_id: playerId, players: this.playersList() });
    if (playerId === this.room.drawerId && ["WORD_SELECTION","DRAWING"].includes(this.room.phase)) await this.endRound("The drawer left — passing the turn");
    await this.save();
  }

  async returnToLobby() {
    Object.assign(this.room, { phase: "LOBBY", drawerId: null, currentWord: "", deadline: 0, strokes: [], currentRound: 1 });
    for (const p of Object.values(this.room.players)) { p.is_drawing = false; p.has_guessed = false; }
    await this.ctx.storage.deleteAlarm(); await this.save();
    for (const id of this.connectedIds()) this.sendTo(id, { type: "room_state", state: await this.roomState(id) });
  }

  async startGame(playerId) {
    if (playerId !== this.room.hostId || !["LOBBY","GAME_OVER"].includes(this.room.phase)) return;
    this.room.currentRound = 1; this.room.drawerIndex = 0; this.room.studyPairs = [];
    this.room.playerOrder = [...this.connectedIds()];
    for (const p of Object.values(this.room.players)) { p.score = 0; p.has_guessed = false; p.is_drawing = false; }
    await this.nextTurn();
  }

  async nextTurn() {
    const online = this.connectedIds();
    if (!online.size) { this.room.phase = "LOBBY"; return; }
    while (this.room.drawerIndex >= this.room.playerOrder.length) { this.room.drawerIndex = 0; this.room.currentRound++; }
    if (this.room.currentRound > this.room.totalRounds) return this.endGame();
    let attempts = 0;
    while (!online.has(this.room.playerOrder[this.room.drawerIndex]) && attempts++ <= this.room.playerOrder.length) {
      this.room.drawerIndex++; if (this.room.drawerIndex >= this.room.playerOrder.length) { this.room.drawerIndex = 0; this.room.currentRound++; }
      if (this.room.currentRound > this.room.totalRounds) return this.endGame();
    }
    this.room.drawerId = this.room.playerOrder[this.room.drawerIndex++];
    for (const p of Object.values(this.room.players)) { p.has_guessed = false; p.is_drawing = p.id === this.room.drawerId; }
    Object.assign(this.room, { strokes: [], currentWord: "", revealed: [], hintBroadcasted: false, phase: "WORD_SELECTION" });
    await this.beginSelection();
  }

  nextSlideIndex() {
    const eligible = Array.from({length:this.room.totalSlides},(_,i)=>i);
    let available = eligible.filter(i => !this.room.usedSlides.includes(i));
    if (!available.length) { this.room.usedSlides = []; available = eligible.filter(i => i !== this.room.currentSlideIndex); if (!available.length) available = eligible; }
    const chosen = available[Math.floor(Math.random()*available.length)] || 0; this.room.usedSlides.push(chosen); return chosen;
  }

  async beginSelection() {
    this.room.currentSlideIndex = this.nextSlideIndex();
    this.room.wordOptions = this.room.mode === "classic" ? sample(CLASSIC_WORDS, 3) : [];
    this.room.deadline = Date.now() + this.room.selectionTime * 1000;
    const slide = this.room.mode === "study" ? await this.getSlide() : null;
    const common = { slide, mode: this.room.mode, time_limit: this.room.selectionTime, round: this.room.currentRound,
      total_rounds: this.room.totalRounds, players: this.playersList() };
    this.sendTo(this.room.drawerId, { ...common, type: "word_selection_drawer", simple_terms: this.room.wordOptions, challenging_terms: [] });
    this.broadcast({ ...common, type: "word_selection_guesser", drawer_name: this.room.players[this.room.drawerId]?.name || "A player" }, this.room.drawerId);
    await this.save(); await this.ctx.storage.setAlarm(Date.now() + 1000);
  }

  async selectWord(playerId, value) {
    if (playerId !== this.room.drawerId || this.room.phase !== "WORD_SELECTION") return;
    const word = cleanWord(value), slide = this.room.mode === "study" ? await this.getSlide() : null;
    const allowed = this.room.mode === "classic" ? this.room.wordOptions : (slide?.word_boxes || []).map(x => x.word);
    const match = allowed.find(x => x.toLowerCase() === word.toLowerCase());
    if (!match) return this.sendTo(playerId, { type: "error", message: this.room.mode === "study" ? "Choose a highlighted word on the current slide." : "Choose one of the three words." });
    Object.assign(this.room, { currentWord: match, phase: "DRAWING", deadline: Date.now() + this.room.drawTime*1000, revealed: [], hintBroadcasted: false });
    const masked = this.maskedWord(), lengths = this.wordLengths();
    this.sendTo(this.room.drawerId, { type: "drawing_started_drawer", word: match, masked_word: masked, word_lengths: lengths,
      slide, draw_time: this.room.drawTime, round: this.room.currentRound, total_rounds: this.room.totalRounds });
    this.broadcast({ type: "drawing_started_guesser", drawer_name: this.room.players[this.room.drawerId].name,
      masked_word: masked, word_length: match.length, word_lengths: lengths, slide, draw_time: this.room.drawTime,
      round: this.room.currentRound, total_rounds: this.room.totalRounds }, this.room.drawerId);
    await this.save(); await this.ctx.storage.setAlarm(Date.now()+1000);
  }

  async skipSlide(playerId) { if (playerId === this.room.drawerId && this.room.phase === "WORD_SELECTION") await this.beginSelection(); }

  async guess(playerId, value) {
    if (!this.room.players[playerId] || this.room.phase !== "DRAWING") return;
    const p = this.room.players[playerId], text = cleanWord(value);
    const chat = () => this.broadcast({ type: "chat_message", message: { sender_id:p.id, sender_name:p.name, avatar:p.avatar, text, is_system:false, is_correct:false } });
    if (p.has_guessed || playerId === this.room.drawerId) return chat();
    if (text.toLowerCase() === this.room.currentWord.toLowerCase()) {
      p.has_guessed = true; const points = 200 + this.remaining()*3; p.score += points;
      if (this.room.players[this.room.drawerId]) this.room.players[this.room.drawerId].score += 60;
      this.broadcast({ type:"correct_guess", player_id:p.id, player_name:p.name, avatar:p.avatar, points,
        scores:Object.fromEntries(Object.values(this.room.players).map(x=>[x.id,x.score])) });
      const online = this.connectedIds(); const guessers = Object.values(this.room.players).filter(x=>online.has(x.id)&&x.id!==this.room.drawerId);
      if (guessers.length && guessers.every(x=>x.has_guessed)) await this.endRound("All players guessed the word!");
    } else if (isClose(text, this.room.currentWord)) this.sendTo(playerId, { type:"close_guess", text:`Very close! '${text}' is almost right — check your spelling.` });
    else chat();
  }

  async endRound(reason = "Round Complete") {
    if (!["DRAWING","WORD_SELECTION"].includes(this.room.phase)) return;
    this.room.phase = "ROUND_REVIEW"; this.room.deadline = Date.now()+this.room.reviewTime*1000;
    const slide = this.room.mode === "study" ? await this.getSlide() : null;
    const drawerName = this.room.players[this.room.drawerId]?.name || "Anonymous";
    if (this.room.currentWord) this.room.studyPairs.push({ slide_index:this.room.currentSlideIndex+1, slide_image_url:slide?.image_url||"", word:this.room.currentWord, drawer_name:drawerName, drawing_snapshot:null });
    this.broadcast({ type:"round_review", word:this.room.currentWord, reason, drawer_name:drawerName,
      scores:Object.fromEntries(Object.values(this.room.players).map(x=>[x.id,x.score])), next_in:this.room.reviewTime });
    await this.save(); await this.ctx.storage.setAlarm(Date.now()+1000);
  }

  async endGame() {
    this.room.phase = "GAME_OVER"; this.room.deadline = 0;
    const podium = Object.values(this.room.players).sort((a,b)=>b.score-a.score).map((p,i)=>({rank:i+1,id:p.id,name:p.name,avatar:p.avatar,score:p.score}));
    this.broadcast({ type:"game_over", podium, study_guide:this.room.studyPairs });
    await this.ctx.storage.deleteAlarm(); await this.save();
  }

  async alarm() {
    await this.load(); const left = this.remaining();
    if (this.room.phase === "WORD_SELECTION") {
      this.broadcast({ type:"selection_tick", time_remaining:left });
      if (left <= 0) return this.endRound("No word selected — turn passed");
    } else if (this.room.phase === "DRAWING") {
      this.broadcast({ type:"timer_tick", time_remaining:left });
      const half = Math.floor(this.room.drawTime/2), quarter = Math.floor(this.room.drawTime/4);
      if (left === half && this.room.currentWord.length > 3 && !this.room.revealed.length) {
        this.room.revealed.push(0); this.broadcast({type:"letter_reveal",masked_word:this.maskedWord(),revealed_count:1});
      }
      if (left === quarter && this.room.currentWord.length > 5 && this.room.revealed.length < 2) {
        const choices=[...this.room.currentWord].map((c,i)=>/[A-Za-z]/.test(c)&&!this.room.revealed.includes(i)?i:null).filter(i=>i!==null);
        if(choices.length){this.room.revealed.push(choices[Math.floor(Math.random()*choices.length)]);this.broadcast({type:"letter_reveal",masked_word:this.maskedWord(),revealed_count:this.room.revealed.length});}
      }
      if (this.room.mode === "study" && left <= Math.floor(this.room.drawTime*.7) && !this.room.hintBroadcasted) {
        this.room.hintBroadcasted=true; this.broadcast({type:"contextual_hint",hint:await this.hint()});
      }
    } else if (this.room.phase === "ROUND_REVIEW") {
      if (left <= 0) return this.nextTurn();
    } else {
      return;
    }
    await this.save();
    await this.ctx.storage.setAlarm(Date.now() + 1000);
  }
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url); const parts = url.pathname.split("/").filter(Boolean);
    if (url.pathname === "/api/rooms" && request.method === "POST") {
      const form = await request.formData(), code = randomCode();
      const slidesResponse = await env.ASSETS.fetch(new Request(new URL("/default-slides.json", url)));
      const slides = await slidesResponse.json(); const id = env.ROOMS.idFromName(code), stub = env.ROOMS.get(id);
      const payload = { code, host_id: form.get("host_id") || `host_${crypto.randomUUID().slice(0,8)}`,
        mode: form.get("mode") || "study", draw_time:Number(form.get("draw_time"))||120,
        total_rounds:Number(form.get("total_rounds"))||3, slides };
      await stub.fetch("https://room/init", { method:"POST", body:JSON.stringify(payload) });
      return json({ code, host_id:payload.host_id, total_slides:slides.length, pdf_name:"ML Lecture Slides" });
    }
    if (parts[0] === "api" && parts[1] === "rooms" && parts[2]) {
      const stub = env.ROOMS.get(env.ROOMS.idFromName(parts[2].toUpperCase()));
      if (parts.length === 3 && request.method === "GET") return stub.fetch("https://room/info");
      if (parts[3] === "upload-pdf" && request.method === "POST") return stub.fetch("https://room/slides", {method:"POST",headers:{"content-type":"application/json"},body:request.body});
    }
    if (parts[0] === "ws" && parts[1] && parts[2] && request.headers.get("Upgrade") === "websocket") {
      const stub = env.ROOMS.get(env.ROOMS.idFromName(parts[1].toUpperCase()));
      return stub.fetch(`https://room/connect?player=${encodeURIComponent(parts[2])}`, request);
    }
    if (url.pathname.startsWith("/static/")) {
      const assetUrl = new URL(url.pathname.replace(/^\/static/, ""), url.origin);
      return env.ASSETS.fetch(new Request(assetUrl, request));
    }
    return env.ASSETS.fetch(request);
  }
};
