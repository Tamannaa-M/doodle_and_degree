function escapeHtml(value) { return String(value ?? "").replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;", "'":"&#39;"}[c])); }
// Doodle & Degree - Main Client Application Logic

class DoodleAndDegreeApp {
  constructor() {
    this.playerId = sessionStorage.getItem('dd_player_id') || 'player_' + crypto.randomUUID();
    sessionStorage.setItem('dd_player_id', this.playerId);

    this.roomCode = null;
    this.mode = 'study';
    this.players = [];
    this.playerName = localStorage.getItem('dd_player_name') || 'Scholar ' + Math.floor(Math.random() * 900 + 100);
    this.playerAvatar = localStorage.getItem('dd_player_avatar') || 'cat';
    this.isHost = false;
    this.isDrawer = false;
    this.soundEnabled = true;

    this.ws = null;
    this.gameState = 'LOBBY';
    this.roomData = null;

    this.canvas = null;
    this.slideViewer = null;

    // Web Audio Synthesizer for instant game SFX
    this.audioCtx = null;

    this.initElements();
    this.initAudio();
    this.initCanvasAndSlideViewer();
    this.bindEvents();
    this.initNewControls();
    this.checkUrlForRoom();
  }

  initElements() {
    // Views
    this.viewLobby = document.getElementById('viewLobby');
    this.viewGame = document.getElementById('viewGame');

    // Modals
    this.modalWordPick = document.getElementById('modalWordPick');
    this.modalRoundReview = document.getElementById('modalRoundReview');
    this.modalGameOver = document.getElementById('modalGameOver');
    this.modalBeginnerGuide = document.getElementById('modalBeginnerGuide');

    // Lobby Inputs
    this.inputPlayerName = document.getElementById('inputPlayerName');
    this.inputRoomCode = document.getElementById('inputRoomCode');
    this.btnCreateRoom = document.getElementById('btnCreateRoom');
    this.btnJoinRoom = document.getElementById('btnJoinRoom');
    this.btnStartGame = document.getElementById('btnStartGame');
    this.btnCopyInvite = document.getElementById('btnCopyInvite');

    // Host Settings
    this.selectDrawTime = document.getElementById('selectDrawTime');
    this.selectRounds = document.getElementById('selectRounds');
    this.hostSettingsBox = document.getElementById('hostSettingsBox');
    this.pdfDropzone = document.getElementById('pdfDropzone');
    this.pdfFileInput = document.getElementById('pdfFileInput');
    this.slideDeckInfo = document.getElementById('slideDeckInfo');

    // Game HUD
    this.hudRoomCode = document.getElementById('hudRoomCode');
    this.hudRound = document.getElementById('hudRound');
    this.hudTimer = document.getElementById('hudTimer');
    this.hudTimerBadge = document.getElementById('hudTimerBadge');
    this.hudWordBlanks = document.getElementById('hudWordBlanks');
    this.drawerToolbar = document.getElementById('drawerToolbar');
    this.chatMessages = document.getElementById('chatMessages');
    this.chatInput = document.getElementById('chatInput');
    this.btnSendChat = document.getElementById('btnSendChat');
    this.playerLeaderboard = document.getElementById('playerLeaderboard');
    this.contextualHintBanner = document.getElementById('contextualHintBanner');
    this.hintText = document.getElementById('hintText');

    // Sound toggle
    this.btnToggleSound = document.getElementById('btnToggleSound');
    this.btnShowGuide = document.getElementById('btnShowGuide');

    // Populate initial inputs
    if (this.inputPlayerName) this.inputPlayerName.value = this.playerName;
  }

  initAudio() {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      this.audioCtx = new AudioContext();
    } catch (e) {
      console.warn("Web Audio not supported.");
    }
  }

  playSound(type) {
    if (!this.soundEnabled || !this.audioCtx) return;
    if (this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }

    const t = this.audioCtx.currentTime;
    const osc = this.audioCtx.createOscillator();
    const gain = this.audioCtx.createGain();
    osc.connect(gain);
    gain.connect(this.audioCtx.destination);

    if (type === 'correct') {
      // Cheerful rising chime
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(440, t);
      osc.frequency.exponentialRampToValueAtTime(880, t + 0.15);
      gain.gain.setValueAtTime(0.3, t);
      gain.gain.exponentialRampToValueAtTime(0.01, t + 0.4);
      osc.start(t);
      osc.stop(t + 0.4);
    } else if (type === 'close') {
      // Warm alert tone
      osc.type = 'sine';
      osc.frequency.setValueAtTime(520, t);
      osc.frequency.exponentialRampToValueAtTime(660, t + 0.1);
      gain.gain.setValueAtTime(0.25, t);
      gain.gain.exponentialRampToValueAtTime(0.01, t + 0.25);
      osc.start(t);
      osc.stop(t + 0.25);
    } else if (type === 'pop') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(600, t);
      osc.frequency.exponentialRampToValueAtTime(300, t + 0.08);
      gain.gain.setValueAtTime(0.2, t);
      gain.gain.exponentialRampToValueAtTime(0.01, t + 0.08);
      osc.start(t);
      osc.stop(t + 0.08);
    } else if (type === 'tick') {
      osc.type = 'square';
      osc.frequency.setValueAtTime(800, t);
      gain.gain.setValueAtTime(0.06, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.04);
      osc.start(t);
      osc.stop(t + 0.04);
    } else if (type === 'buzzer') {
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(160, t);
      osc.frequency.linearRampToValueAtTime(120, t + 0.3);
      gain.gain.setValueAtTime(0.3, t);
      gain.gain.exponentialRampToValueAtTime(0.01, t + 0.35);
      osc.start(t);
      osc.stop(t + 0.35);
    }
  }

  initCanvasAndSlideViewer() {
    const canvasEl = document.getElementById('drawingCanvas');
    this.canvas = new DrawingCanvas(canvasEl, (stroke) => {
      if (this.ws && this.ws.readyState === WebSocket.OPEN) {
        this.ws.send(JSON.stringify({
          type: 'stroke',
          stroke: stroke
        }));
      }
    });

    const vpEl = document.getElementById('slideViewport');
    const containerEl = document.getElementById('slideContainer');
    this.slideViewer = new SlideViewer(vpEl, containerEl, (word, difficulty) => {
      // Drawer clicked word on slide during word selection
      this.selectWord(word);
    });
  }

  bindEvents() {
    // Avatar selection in lobby
    document.querySelectorAll('.sticker-avatar-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.sticker-avatar-btn').forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
        this.playerAvatar = btn.dataset.avatar;
        localStorage.setItem('dd_player_avatar', this.playerAvatar);
        this.playSound('pop');
      });
    });

    // Create Room
    this.btnCreateRoom.addEventListener('click', async () => {
      this.playerName = this.inputPlayerName.value.trim() || 'Scholar Cat';
      localStorage.setItem('dd_player_name', this.playerName);
      this.playSound('pop');

      await this.createRoom();
    });

    // Join Room
    this.btnJoinRoom.addEventListener('click', () => {
      this.playerName = this.inputPlayerName.value.trim() || 'Scholar Cat';
      localStorage.setItem('dd_player_name', this.playerName);
      const code = this.inputRoomCode.value.trim().toUpperCase();
      if (!code || code.length !== 6) {
        alert('Please enter a valid 6-character room code!');
        return;
      }
      this.roomCode = code;
      this.playSound('pop');
      this.connectWebSocket();
    });

    // Copy Invite Link
    this.btnCopyInvite.addEventListener('click', () => {
      if (!this.roomCode) return;
      const url = `${window.location.origin}/room/${this.roomCode}`;
      navigator.clipboard.writeText(url).then(() => {
        const origText = this.btnCopyInvite.innerHTML;
        this.btnCopyInvite.innerHTML = `✓ Copied Link!`;
        this.playSound('pop');
        setTimeout(() => {
          this.btnCopyInvite.innerHTML = origText;
        }, 2000);
      });
    });

    // Host Settings updates
    const sendSettingsUpdate = () => {
      if (!this.isHost || !this.ws) return;
      this.ws.send(JSON.stringify({
        type: 'update_settings',
        draw_time: parseInt(this.selectDrawTime.value),
        total_rounds: parseInt(this.selectRounds.value),
        mode: this.mode
      }));
    };
    if (this.selectDrawTime) this.selectDrawTime.addEventListener('change', sendSettingsUpdate);
    if (this.selectRounds) this.selectRounds.addEventListener('change', sendSettingsUpdate);

    // Host PDF Upload
    if (this.pdfDropzone) {
      this.pdfDropzone.addEventListener('click', (e) => { if(e.target !== this.pdfFileInput) this.pdfFileInput.click(); });
      this.pdfFileInput.addEventListener('change', (e) => this.handlePdfUpload(e.target.files[0]));

      this.pdfDropzone.addEventListener('dragover', (e) => {
        e.preventDefault();
        this.pdfDropzone.style.borderColor = 'var(--pink)';
      });
      this.pdfDropzone.addEventListener('dragleave', () => {
        this.pdfDropzone.style.borderColor = 'var(--ink)';
      });
      this.pdfDropzone.addEventListener('drop', (e) => {
        e.preventDefault();
        this.pdfDropzone.style.borderColor = 'var(--ink)';
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
          this.handlePdfUpload(e.dataTransfer.files[0]);
        }
      });
    }

    // Start Game Button
    this.btnStartGame.addEventListener('click', () => {
      if (!this.isHost || !this.ws) return;
      this.playSound('pop');
      this.ws.send(JSON.stringify({ type: 'start_game' }));
    });

    // Drawer Canvas Tools
    document.querySelectorAll('.color-swatch').forEach(swatch => {
      swatch.addEventListener('click', () => {
        document.querySelectorAll('.color-swatch').forEach(s => s.classList.remove('active'));
        swatch.classList.add('active');
        this.canvas.setColor(swatch.dataset.color);
        document.getElementById('btnToolBrush').classList.add('neo-btn-primary');
        document.getElementById('btnToolEraser').classList.remove('neo-btn-primary');
        this.playSound('pop');
      });
    });

    document.getElementById('brushSizeSlider').addEventListener('input', (e) => {
      this.canvas.setWidth(e.target.value);
    });

    document.getElementById('btnToolBrush').addEventListener('click', () => {
      this.canvas.setTool('brush');
      document.getElementById('btnToolBrush').classList.add('neo-btn-primary');
      document.getElementById('btnToolEraser').classList.remove('neo-btn-primary');
      this.playSound('pop');
    });

    document.getElementById('btnToolEraser').addEventListener('click', () => {
      this.canvas.setTool('eraser');
      document.getElementById('btnToolEraser').classList.add('neo-btn-primary');
      document.getElementById('btnToolBrush').classList.remove('neo-btn-primary');
      this.playSound('pop');
    });

    document.getElementById('btnToolUndo').addEventListener('click', () => {
      if (this.ws) this.ws.send(JSON.stringify({ type: 'undo' }));
      this.playSound('pop');
    });

    document.getElementById('btnToolClear').addEventListener('click', () => {
      if (this.ws) this.ws.send(JSON.stringify({ type: 'clear' }));
      this.playSound('pop');
    });

    // Slide Viewer Zoom Controls
    document.getElementById('btnZoomIn').addEventListener('click', () => this.slideViewer.zoomIn());
    document.getElementById('btnZoomOut').addEventListener('click', () => this.slideViewer.zoomOut());
    document.getElementById('btnZoomReset').addEventListener('click', () => this.slideViewer.resetZoom());

    // Skip Slide Button (Drawer only)
    document.getElementById('btnSkipSlide').addEventListener('click', () => {
      if (this.isDrawer && this.ws) {
        this.playSound('pop');
        this.ws.send(JSON.stringify({ type: 'skip_slide' }));
      }
    });

    // Chat / Guess Input
    const sendGuess = () => {
      const text = this.chatInput.value.trim();
      if (!text || !this.ws || this.isDrawer || this.gameState !== "DRAWING") return;
      this.ws.send(JSON.stringify({ type: 'guess', text: text }));
      this.chatInput.value = '';
    };

    this.btnSendChat.addEventListener('click', sendGuess);
    this.chatInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        sendGuess();
      }
    });

    // Sound toggle
    this.btnToggleSound.addEventListener('click', () => {
      this.soundEnabled = !this.soundEnabled;
      this.btnToggleSound.innerHTML = this.soundEnabled ? '🔊 Sound: ON' : '🔇 Sound: OFF';
      this.playSound('pop');
    });

    // Beginner guide modal toggle
    this.btnShowGuide.addEventListener('click', () => {
      this.modalBeginnerGuide.classList.remove('hidden');
      this.playSound('pop');
    });
    document.getElementById('btnCloseGuide').addEventListener('click', () => {
      this.modalBeginnerGuide.classList.add('hidden');
    });

    // Play Again button
    document.getElementById('btnPlayAgain').addEventListener('click', () => {
      this.modalGameOver.classList.add('hidden');
      if (this.isHost && this.ws) {
        this.ws.send(JSON.stringify({ type: 'start_game' }));
      } else {
        this.showLobbyView();
      }
    });
  }

  checkUrlForRoom() {
    const path = window.location.pathname;
    const match = path.match(/\/room\/([A-Za-z0-9]{6})/);
    if (match) {
      this.roomCode = match[1].toUpperCase();
      if (this.inputRoomCode) this.inputRoomCode.value = this.roomCode;
    }
  }

  async createRoom() {
    if (this.creatingRoom) return;
    this.creatingRoom = true;
    this.btnCreateRoom.disabled = true;
    try {
      this.playerName = this.inputPlayerName.value.trim() || 'Doodler';
      localStorage.setItem('dd_player_name', this.playerName);
      const form = new FormData();
      form.append('host_id', this.playerId);
      form.append('mode', this.mode);
      form.append('draw_time', this.selectDrawTime.value);
      form.append('total_rounds', this.selectRounds.value);
      const res = await fetch('/api/rooms', {method:'POST', body:form});
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || 'Room could not be created');
      this.roomCode = data.code;
      this.connectWebSocket();
      return true;
    } catch (e) { this.status(e.message); return false; }
    finally { this.creatingRoom = false; this.btnCreateRoom.disabled = false; }
  }

  async handlePdfUpload(file) {
    if (this.uploading) return;
    if (!file || !file.name.toLowerCase().endsWith('.pdf')) { this.status('Please choose a PDF file.'); return; }
    this.uploading = true;
    this.btnStartGame.disabled = true;
    try {
      if (!this.roomCode) {
        this.mode = 'study';
        if (!await this.createRoom()) return;
      }
      this.status('Opening your PDF and preparing clickable slides…');
      const slides = await this.preparePdfInBrowser(file);
      const res = await fetch(`/api/rooms/${this.roomCode}/upload-pdf`, {
        method:'POST',
        headers:{'content-type':'application/json'},
        body:JSON.stringify({player_id:this.playerId, filename:file.name, slides})
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || 'Upload failed');
      this.slideDeckInfo.textContent = `${file.name} · ${data.total_slides} slides ready`;
      this.status('Slides ready! Invite friends or start a solo practice round.');
      this.playSound('correct');
    } catch(e) { this.status(e.message); }
    finally { this.uploading = false; this.btnStartGame.disabled = !this.isHost; this.pdfFileInput.value = ''; }
  }

  async preparePdfInBrowser(file) {
    if (!window.pdfjsLib) {
      await new Promise((resolve, reject) => {
        const s = document.createElement('script');
        s.src = '/js/pdf.min.js';
        s.onload = resolve;
        s.onerror = () => {
          const s2 = document.createElement('script');
          s2.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';
          s2.onload = resolve;
          s2.onerror = () => reject(new Error('The PDF reader could not load. Check your connection and try again.'));
          document.head.appendChild(s2);
        };
        document.head.appendChild(s);
      });
    }
    if (!window.pdfjsLib) throw new Error('The PDF reader could not load. Check your connection and try again.');
    window.pdfjsLib.GlobalWorkerOptions.workerSrc = '/js/pdf.worker.min.js';
    const documentTask = window.pdfjsLib.getDocument({data: await file.arrayBuffer()});
    const pdf = await documentTask.promise;
    if (pdf.numPages > 120) throw new Error('Please use a presentation with 120 slides or fewer.');
    const stop = new Set('the and for that this with from have are which using where into their will what when more such each then them some other about slide study terms between across while these there those'.split(' '));
    const technical = new Set('perceptron activation gradient descent backpropagation weights overfitting sigmoid softmax decision tree ensemble boosting forest entropy residuals variance convolution kernel pooling filter invariance pixels tensors transformer attention tokenizer embedding tokens encoder decoder policy reward exploration environment state action discount neural network vectors architecture workflow pipeline analysis component structure algorithm function parameter benchmark optimization'.split(' '));
    const slides = [];
    const deckWideWords = new Set();

    for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber++) {
      this.status(`Preparing slide ${pageNumber} of ${pdf.numPages}…`);
      const page = await pdf.getPage(pageNumber);
      const base = page.getViewport({scale:1});
      const renderScale = Math.min(1.2, 750 / base.width);
      const viewport = page.getViewport({scale:renderScale});
      const canvas = document.createElement('canvas');
      canvas.width = Math.round(viewport.width); canvas.height = Math.round(viewport.height);
      await page.render({canvasContext:canvas.getContext('2d',{alpha:false}),viewport}).promise;
      let quality = 0.55;
      let imageUrl = canvas.toDataURL('image/jpeg', quality);
      while(imageUrl.length > 45000 && quality > 0.22){ quality -= 0.08; imageUrl = canvas.toDataURL('image/jpeg', quality); }
      
      const content = await page.getTextContent();
      const wordBoxes = [], candidates = new Set(), textParts = [];
      for (const item of content.items) {
        const line = String(item.str||'').trim(); if(!line) continue; textParts.push(line);
        const tx = window.pdfjsLib.Util.transform(viewport.transform,item.transform);
        const x = tx[4], fontHeight = Math.max(8,Math.hypot(tx[2],tx[3])), y = tx[5]-fontHeight;
        const width = Math.max(1,(Number(item.width)||line.length*fontHeight*.45)*renderScale);
        const matcher = /[A-Za-z]{3,}/g; let match;
        while((match = matcher.exec(line)) && wordBoxes.length < 180){
          const clean = match[0], lower = clean.toLowerCase(); if(stop.has(lower)) continue;
          const x0 = x + width * (match.index / Math.max(1, line.length));
          const x1 = x + width * ((match.index + clean.length) / Math.max(1, line.length));
          wordBoxes.push({
            word: clean,
            norm_box: [Math.max(0, x0/viewport.width), Math.max(0, y/viewport.height), Math.min(1, x1/viewport.width), Math.min(1, (y + fontHeight*1.15)/viewport.height)],
            difficulty: (clean.length >= 8 || technical.has(lower)) ? 'challenging' : 'simple'
          });
          const titleCase = clean[0].toUpperCase() + clean.slice(1);
          candidates.add(titleCase);
          deckWideWords.add(titleCase);
        }
      }

      // If slide is a pure image / diagram / visual PowerPoint slide with no text, generate smart study keywords
      if (!wordBoxes.length) {
        const fallbacks = [...deckWideWords].slice(0, 4);
        if (fallbacks.length < 4) {
          const defaults = ['Diagram', 'Architecture', 'Overview', 'Workflow', 'System', 'Process', 'Component', 'Structure'];
          for (const d of defaults) { if (fallbacks.length < 4 && !fallbacks.includes(d)) fallbacks.push(d); }
        }
        fallbacks.forEach((term, idx) => {
          candidates.add(term);
          wordBoxes.push({
            word: term,
            norm_box: [0.08 + (idx * 0.22), 0.84, 0.26 + (idx * 0.22), 0.95],
            difficulty: idx % 2 === 0 ? 'simple' : 'challenging'
          });
        });
      }

      const all = [...candidates].sort();
      const simple = all.filter(x => x.length < 8 && !technical.has(x.toLowerCase()));
      const challenging = all.filter(x => x.length >= 8 || technical.has(x.toLowerCase()));
      slides.push({
        page_num: pageNumber,
        image_url: imageUrl,
        text_content: textParts.join(' ').slice(0, 12000),
        word_boxes: wordBoxes,
        simple_terms: (simple.length ? simple : all).slice(0, 6),
        challenging_terms: (challenging.length ? challenging : all).slice(0, 6)
      });
    }
    return slides;
  }

  connectWebSocket() {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${protocol}//${window.location.host}/ws/${this.roomCode}/${this.playerId}`;

    if (this.ws) { this.ws.onclose = null; this.ws.close(); }
    this.ws = new WebSocket(wsUrl);

    this.ws.onopen = () => {
      this.ws.send(JSON.stringify({
        type: 'join',
        name: this.playerName,
        avatar: this.playerAvatar
      }));
    };

    this.ws.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      this.handleServerMessage(msg);
    };

    this.ws.onclose = () => {
      this.status("Disconnected. Check the room code, then click Join room to reconnect.");
      this.canvas.setCanDraw(false);
    };

    this.ws.onerror = (err) => {
      console.error("WebSocket error:", err);
    };
  }

  handleServerMessage(msg) {
    const selection = ['word_selection_drawer','word_selection_guesser'].includes(msg.type);
    if (selection) {
      this.gameState = 'WORD_SELECTION';
      this.guesserPreview = false;
      this.secretWord = '';
      this.lastMaskedWord = '';
      this.wordLengths = [];
      this.isDrawer = msg.type === 'word_selection_drawer';
      this.updateRoleControls();
      document.getElementById('hudWordMeta').textContent = 'Word length appears as soon as the drawer chooses';
      document.body.dataset.phase = 'choosing';
      this.mode = msg.mode;
      document.body.dataset.mode = this.mode;
      this.modalRoundReview.classList.add('hidden');
      this.modalGameOver.classList.add('hidden');
      this.contextualHintBanner.classList.add('hidden');
      this.drawerToolbar.classList.add('hidden');
      this.canvas.clearCanvas();
      this.hudTimer.innerText = msg.time_limit;
      this.hudRound.innerText = `Round ${msg.round} of ${msg.total_rounds}`;
      this.hudWordBlanks.textContent = msg.type === 'word_selection_drawer' ? (this.mode === 'study' ? 'Click your word on the slide →' : 'Choose your word below') : `${escapeHtml(msg.drawer_name)} is choosing…`;
      if(msg.players) this.updatePlayerList(msg.players);
      document.getElementById('btnSkipSlide').disabled = msg.type !== 'word_selection_drawer';
    }
    if (msg.type.startsWith('drawing_started')) {
      this.gameState = 'DRAWING';
      this.isDrawer = msg.type === 'drawing_started_drawer';
      this.guesserPreview = false;
      this.wordLengths = msg.word_lengths || [msg.word_length || msg.word?.length || 0];
      this.lastMaskedWord = msg.masked_word;
      this.secretWord = msg.word || '';
      this.updateRoleControls();
      document.body.dataset.phase = 'drawing';
      setTimeout(() => this.slideViewer.fitToViewport(), 50);
      this.slideViewer.loadSlide(msg.slide);
      document.getElementById('btnSkipSlide').disabled = true;
    }
    switch (msg.type) {
      case 'error': this.status(msg.message); break;
      case 'selection_tick':
        this.hudTimer.innerText = msg.time_remaining;
        document.getElementById('selectionSeconds').textContent = msg.time_remaining;
        break;
      case 'room_state':
        this.handleRoomState(msg.state);
        break;

      case 'player_joined':
        this.updatePlayerList(msg.players);
        this.addSystemChatMessage(`🎓 <b>${escapeHtml(msg.player.name)}</b> joined the study room!`);
        this.playSound('pop');
        break;

      case 'player_left':
        this.updatePlayerList(msg.players);
        this.playSound('pop');
        break;

      case 'settings_updated':
        this.mode = msg.mode;
        this.refreshMode();
        if (this.selectDrawTime) this.selectDrawTime.value = msg.draw_time;
        if (this.selectRounds) this.selectRounds.value = msg.total_rounds;
        this.addSystemChatMessage(`⚙️ Host updated settings: ${msg.draw_time}s draw time, ${msg.total_rounds} rounds.`);
        break;

      case 'slides_updated':
        if (this.slideDeckInfo) {
          this.slideDeckInfo.textContent = `${escapeHtml(msg.pdf_name)} · ${msg.total_slides} slides ready`;
        }
        this.addSystemChatMessage(`📚 New lecture slides loaded: "${escapeHtml(msg.pdf_name)}" (${msg.total_slides} slides)`);
        break;

      case 'word_selection_drawer':
        this.isDrawer = true;
        this.canvas.setCanDraw(false);
        this.modalRoundReview.classList.add('hidden');
        this.showGameView();
        this.slideViewer.loadSlide(msg.slide);
        this.slideViewer.setClickToPickEnabled(true);
        this.showWordSelectionModal(msg.simple_terms, msg.challenging_terms, msg.slide);
        this.playSound('pop');
        break;

      case 'word_selection_guesser':
        this.isDrawer = false;
        this.canvas.setCanDraw(false);
        this.modalRoundReview.classList.add('hidden');
        this.showGameView();
        this.slideViewer.loadSlide(msg.slide);
        this.slideViewer.setClickToPickEnabled(false);
        this.modalWordPick.classList.add('hidden');
        this.addSystemChatMessage(`🤔 <b>${escapeHtml(msg.drawer_name)}</b> is selecting a concept from the slide...`);
        break;

      case 'slide_skipped':
        // Drawer skipped slide, reload new slide and update options
        this.slideViewer.loadSlide(msg.slide);
        this.populateWordModalTerms(msg.simple_terms, msg.challenging_terms);
        this.addSystemChatMessage(`⏭️ Drawer skipped to a new lecture slide!`);
        break;

      case 'drawing_started_drawer':
        this.isDrawer = true;
        this.canvas.setCanDraw(true);
        this.modalWordPick.classList.add('hidden');
        this.modalRoundReview.classList.add('hidden');
        this.showInitialHint();
        this.drawerToolbar.classList.remove('hidden');
        this.slideViewer.setClickToPickEnabled(false);

        this.hudRound.innerText = `Round ${msg.round} of ${msg.total_rounds}`;
        this.hudTimer.innerText = msg.draw_time;
        this.renderDrawerSecretWord(msg.word);
        this.playSound('pop');
        break;

      case 'drawing_started_guesser':
        this.isDrawer = false;
        this.canvas.setCanDraw(false);
        this.modalWordPick.classList.add('hidden');
        this.modalRoundReview.classList.add('hidden');
        this.showInitialHint();
        this.drawerToolbar.classList.add('hidden');
        this.slideViewer.setClickToPickEnabled(false);

        this.hudRound.innerText = `Round ${msg.round} of ${msg.total_rounds}`;
        this.hudTimer.innerText = msg.draw_time;
        this.renderMaskedWord(msg.masked_word);
        this.addSystemChatMessage(`✏️ <b>${escapeHtml(msg.drawer_name)}</b> started drawing! Guess the slide concept!`);
        this.playSound('pop');
        break;

      case 'timer_tick':
        this.hudTimer.innerText = msg.time_remaining;
        if (msg.time_remaining <= 15) {
          this.hudTimerBadge.classList.add('timer-pulse-warning');
          this.playSound('tick');
        } else {
          this.hudTimerBadge.classList.remove('timer-pulse-warning');
        }
        break;

      case 'letter_reveal':
        this.lastMaskedWord = msg.masked_word;
        if (!this.isDrawer || this.guesserPreview) {
          this.renderMaskedWord(msg.masked_word);
          this.playSound('pop');
        }
        break;

      case 'contextual_hint':
        this.hintText.innerText = msg.hint;
        this.contextualHintBanner.classList.remove('hidden');
        this.playSound('pop');
        break;

      case 'stroke_drawn':
        this.canvas.addRemoteStroke(msg.stroke);
        break;

      case 'stroke_undone':
        this.canvas.undoStroke();
          break;

      case 'canvas_cleared':
        this.canvas.clearCanvas();
          break;

      case 'close_guess':
        // Private close guess comic badge for this guesser!
        this.showCloseGuessNotification(msg.text);
        this.playSound('close');
        break;

      case 'chat_message':
        this.addChatMessage(msg.message);
        break;

      case 'correct_guess':
        this.addCorrectGuessMessage(msg.player_name, msg.points);
        this.updateScores(msg.scores);
        this.playSound('correct');
        window.confetti?.({
          particleCount: 40,
          spread: 60,
          origin: { y: 0.8 }
        });
        break;

      case 'round_review':
        this.gameState = 'ROUND_REVIEW';
        this.updateRoleControls();
        this.canvas.setCanDraw(false);
        this.modalWordPick.classList.add('hidden');
        this.updateScores(msg.scores);
        this.showRoundReviewModal(msg.word, msg.reason, msg.drawer_name, msg.scores, msg.next_in);
        this.playSound('pop');
        break;

      case 'game_over':
        this.gameState = 'GAME_OVER';
        this.updateRoleControls();
        this.modalRoundReview.classList.add('hidden');
        this.modalWordPick.classList.add('hidden');
        this.showGameOverModal(msg.podium, msg.study_guide);
        this.playSound('correct');
        window.confetti?.({
          particleCount: 150,
          spread: 90,
          origin: { y: 0.5 }
        });
        break;
    }
  }

  handleRoomState(state) {
    this.roomData = state;
    this.gameState = state.state;
    this.isDrawer = state.is_drawer;
    this.guesserPreview = false;
    this.wordLengths = state.word_lengths || [];
    this.lastMaskedWord = state.masked_word || "";
    this.secretWord = state.current_word || "";
    this.hudTimer.textContent = state.time_remaining;
    document.body.dataset.phase = state.state === "WORD_SELECTION" ? "choosing" : "drawing";
    this.updateRoleControls();
    this.mode = state.mode;
    this.selectDrawTime.value = state.draw_time;
    this.selectRounds.value = state.total_rounds;
    this.isHost = (this.playerId === state.host_id);
    this.refreshMode();
    this.btnStartGame.disabled = !this.isHost || this.uploading;
    document.getElementById("roomStatus").textContent = `ROOM ${state.code} · ${this.isHost ? "You are the host" : "Waiting for the host"}`;
    this.hudRoomCode.innerText = state.code;
    this.hudRound.innerText = `Round ${state.current_round} of ${state.total_rounds}`;

    // Update host controls visibility
    if (this.hostSettingsBox) {
      this.hostSettingsBox.style.display = this.isHost ? 'block' : 'none';
      this.btnStartGame.style.display = this.isHost ? 'block' : 'none';
    }

    if (this.slideDeckInfo) {
      this.slideDeckInfo.textContent = `${state.pdf_name} · ${state.total_slides} slides ready`;
    }

    this.updatePlayerList(state.players);
    if (state.state === "DRAWING") {
      this.showInitialHint();
      if (state.hint) this.hintText.textContent = state.hint;
    }

    if (state.state === 'WORD_SELECTION') {
      this.handleServerMessage({type: state.is_drawer ? 'word_selection_drawer' : 'word_selection_guesser',
        mode:state.mode, slide:state.slide, simple_terms:state.word_options || [], challenging_terms:[],
        time_limit:state.time_remaining, round:state.current_round, total_rounds:state.total_rounds,
        players:state.players, drawer_name:state.players.find(p=>p.id===state.drawer_id)?.name || 'A player'});
      document.getElementById('selectionSeconds').textContent=state.time_remaining;
      return;
    }

    if (state.state === 'LOBBY') {
      this.showLobbyView();
    } else {
      this.showGameView();
      if (state.slide) {
        this.slideViewer.loadSlide(state.slide);
      }
      if (state.strokes) {
        this.canvas.setStrokes(state.strokes);
      }
      if (state.is_drawer) {
        this.isDrawer = true;
        this.canvas.setCanDraw(state.state === "DRAWING");
        this.drawerToolbar.classList.remove('hidden');
        if (state.current_word) this.renderDrawerSecretWord(state.current_word);
      } else {
        this.isDrawer = false;
        this.canvas.setCanDraw(false);
        this.drawerToolbar.classList.add('hidden');
        if (state.masked_word) this.renderMaskedWord(state.masked_word);
      }
    }
  }

  showLobbyView() {
    this.viewLobby.classList.remove('hidden');
    this.viewGame.classList.add('hidden');
    this.modalWordPick.classList.add('hidden');
    this.modalRoundReview.classList.add('hidden');
    this.modalGameOver.classList.add('hidden');
    this.contextualHintBanner.classList.add('hidden');
    this.modalBeginnerGuide.classList.add('hidden');
    this.guesserPreview = false;
    this.canvas.setCanDraw(false);
    this.updateRoleControls();
  }

  showGameView() {
    this.viewLobby.classList.add('hidden');
    this.viewGame.classList.remove('hidden');
    // Resize canvas to fit properly in split screen
    setTimeout(() => {
      this.canvas.initCanvasSize();
      this.canvas.redrawAll();
      this.slideViewer.fitToViewport();
    }, 100);
  }

  updatePlayerList(players) {
    this.players = players;
    this.isHost = players.some(p => p.id === this.playerId && p.is_host);
    this.updateRoleControls();
    if (this.roomCode && this.gameState === 'LOBBY') {
      this.hostSettingsBox.style.display = this.isHost ? 'block' : 'none';
      this.btnStartGame.style.display = this.isHost ? 'block' : 'none';
      this.btnStartGame.disabled = !this.isHost || this.uploading;
      this.refreshMode();
    }
    const container = document.getElementById('lobbyPlayerList');
    if (container) {
      container.innerHTML = players.map(p => `
        <div class="neo-box-sm p-3 flex items-center justify-between ${p.id === this.playerId ? 'bg-yellow-100 border-yellow-500' : 'bg-white'}">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 flex-shrink-0">${getAvatarSvg(p.avatar, 40)}</div>
            <div>
              <div class="font-extrabold text-sm flex items-center gap-1.5">
                ${escapeHtml(p.name)}
                ${p.is_host ? '<span class="bg-pink-500 text-white text-[10px] px-1.5 py-0.5 rounded font-black border border-black">HOST</span>' : ''}
                ${p.id === this.playerId ? '<span class="text-xs text-gray-500 font-normal">(You)</span>' : ''}
              </div>
              <div class="text-xs text-gray-600 font-semibold">${p.connected ? '🟢 Connected' : '⚪ Offline'}</div>
            </div>
          </div>
          <div class="font-black text-sm text-blue-600">${p.score} pts</div>
        </div>
      `).join('');
    }

    if (this.playerLeaderboard) {
      this.playerLeaderboard.innerHTML = players.map(p => `
        <div class="neo-box-sm p-2 flex items-center justify-between mb-2 ${p.is_drawing ? 'bg-pink-100 border-pink-500' : (p.has_guessed ? 'bg-green-100 border-green-500' : 'bg-white')}">
          <div class="flex items-center gap-2">
            <div class="w-8 h-8 flex-shrink-0">${getAvatarSvg(p.avatar, 32)}</div>
            <div class="text-xs font-bold truncate max-w-[90px]">
              ${escapeHtml(p.name)}
              ${p.is_drawing ? ' ✏️' : ''}
              ${p.has_guessed ? ' ✅' : ''}
            </div>
          </div>
          <div class="text-xs font-black text-blue-600">${p.score}</div>
        </div>
      `).join('');
    }
  }

  updateScores(scores) {
    if (!scores) return;
    this.players.forEach(p => { if (scores[p.id] !== undefined) p.score = scores[p.id]; });
    this.updatePlayerList(this.players);
  }

  renderDrawerSecretWord(word) {
    this.secretWord = word;
    this.renderMaskedWord(this.lastMaskedWord || [...word].map(c => /[A-Za-z0-9]/.test(c) ? '_' : c).join(' '));
    if (!this.guesserPreview) {
      const label = document.createElement('div');
      label.className = 'drawer-answer';
      label.textContent = `Your word: ${word}`;
      this.hudWordBlanks.prepend(label);
    }
  }

  renderMaskedWord(masked) {
    if (!masked) return;
    const lengths = this.wordLengths || [];
    document.getElementById('hudWordMeta').textContent = `${lengths.length} ${lengths.length === 1 ? 'word' : 'words'} · ${lengths.join(' + ')} letters`;
    this.hudWordBlanks.innerHTML = masked.split(' ').map(token => {
      if (!token) return '<span class="word-gap"></span>';
      if (token === '_') return '<span class="word-blank-char">_</span>';
      return `<span class="word-blank-char word-blank-revealed">${escapeHtml(token)}</span>`;
    }).join('');
  }

  showWordSelectionModal(simpleTerms, challengingTerms, slide) {
    document.getElementById('selectionSeconds').textContent = 20;
    document.getElementById('pickHeading').textContent = this.mode === 'study' ? 'Your slide. Your choice.' : 'What will you draw?';
    document.getElementById('pickDescription').textContent = this.mode === 'study' ? 'Click any highlighted word on the slide. You have 20 seconds. Nothing is picked for you.' : 'Pick one of these everyday words in 20 seconds.';
    this.populateWordModalTerms(simpleTerms, challengingTerms);
    this.modalWordPick.classList.remove('hidden');
  }

  populateWordModalTerms(simpleTerms, challengingTerms) {
    const simpleContainer = document.getElementById('simpleTermsContainer');
    const challengeContainer = document.getElementById('challengingTermsContainer');

    simpleContainer.innerHTML = (simpleTerms || []).map(term => `
      <button class="neo-btn neo-btn-mint px-3 py-2 text-xs w-full mb-2 word-pick-btn" data-word="${escapeHtml(term)}">
        🌱 ${escapeHtml(term)}
      </button>
    `).join('');

    challengeContainer.innerHTML = (challengingTerms || []).map(term => `
      <button class="neo-btn neo-btn-primary px-3 py-2 text-xs w-full mb-2 word-pick-btn" data-word="${escapeHtml(term)}">
        ⚡ ${escapeHtml(term)}
      </button>
    `).join('');

    document.querySelectorAll('.word-pick-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        this.selectWord(btn.dataset.word);
      });
    });
  }

  selectWord(word) {
    if (!this.isDrawer || !this.ws) return;
    this.playSound('pop');
    this.ws.send(JSON.stringify({
      type: 'select_word',
      word: word
    }));
  }

  showCloseGuessNotification(text) {
    const badge = document.createElement('div');
    badge.className = 'close-guess-badge my-1.5';
    badge.textContent = text;
    this.chatMessages.appendChild(badge);
    this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
  }

  addChatMessage(msg) {
    const item = document.createElement('div');
    item.className = 'flex items-start gap-2 mb-2 text-xs';
    item.innerHTML = `
      <div class="w-6 h-6 flex-shrink-0">${getAvatarSvg(msg.avatar, 24)}</div>
      <div class="speech-bubble max-w-[85%]">
        <span class="font-extrabold text-blue-700">${escapeHtml(msg.sender_name)}:</span>
        <span class="font-medium text-black break-words ml-1">${escapeHtml(msg.text)}</span>
      </div>
    `;
    this.chatMessages.appendChild(item);
    this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
  }

  addCorrectGuessMessage(playerName, points) {
    const item = document.createElement('div');
    item.className = 'neo-box-sm bg-green-200 border-green-600 p-2 my-1 text-xs font-black text-green-900 flex items-center justify-between';
    item.innerHTML = `
      <span>🎉 <b>${escapeHtml(playerName)}</b> correctly guessed the concept!</span>
      <span class="bg-green-600 text-white px-1.5 py-0.5 rounded font-black">+${points}</span>
    `;
    this.chatMessages.appendChild(item);
    this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
  }

  addSystemChatMessage(text) {
    const item = document.createElement('div');
    item.className = 'text-center my-1 text-xs font-bold text-gray-600 italic';
    item.innerHTML = text;
    this.chatMessages.appendChild(item);
    this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
  }

  showRoundReviewModal(word, reason, drawerName, scores, nextIn) {
    const modal = this.modalRoundReview;
    document.getElementById('reviewReason').innerText = reason;
    document.getElementById('reviewSecretWord').innerText = word || 'No word chosen';
    document.getElementById('reviewDrawerName').innerText = drawerName;

    let countdown = nextIn || 5;
    const cdEl = document.getElementById('reviewCountdown');
    cdEl.innerText = countdown;

    clearInterval(this.reviewTimer);
    this.reviewTimer = setInterval(() => {
      countdown--;
      if (countdown >= 0) {
        cdEl.innerText = countdown;
      }
      if (countdown <= 0) {
        clearInterval(this.reviewTimer);
      }
    }, 1000);

    modal.classList.remove('hidden');
  }

  showGameOverModal(podium) {
    document.getElementById('btnPlayAgain').disabled = !this.isHost;
    document.getElementById('btnPlayAgain').textContent = this.isHost ? 'Play again' : 'Waiting for host to play again';
    this.modalGameOver.classList.remove('hidden');
    const container = document.getElementById('podiumContainer');

    // 1st, 2nd, 3rd podium order: [2nd, 1st, 3rd]
    const p1 = podium[0] || null;
    const p2 = podium[1] || null;
    const p3 = podium[2] || null;

    container.innerHTML = `
      <!-- 2nd Place -->
      <div class="flex flex-col items-center justify-end w-28">
        ${p2 ? `
          <div class="w-14 h-14 mb-2">${getAvatarSvg(p2.avatar, 56)}</div>
          <div class="font-black text-xs text-center truncate max-w-full">${escapeHtml(p2.name)}</div>
          <div class="text-[11px] font-bold text-gray-600">${p2.score} pts</div>
          <div class="podium-pillar bg-blue-300 w-full h-24 mt-2">
            <span class="text-2xl font-black">2</span>
          </div>
        ` : '<div class="w-full h-12"></div>'}
      </div>

      <!-- 1st Place (Winner) -->
      <div class="flex flex-col items-center justify-end w-32 -mt-4">
        ${p1 ? `
          <div class="text-2xl mb-1">👑</div>
          <div class="w-18 h-18 mb-2">${getAvatarSvg(p1.avatar, 72)}</div>
          <div class="font-black text-sm text-center truncate max-w-full text-pink-600">${escapeHtml(p1.name)}</div>
          <div class="text-xs font-black text-blue-600">${p1.score} pts</div>
          <div class="podium-pillar bg-yellow-400 w-full h-36 mt-2 border-pink-500">
            <span class="text-4xl font-black">1</span>
          </div>
        ` : ''}
      </div>

      <!-- 3rd Place -->
      <div class="flex flex-col items-center justify-end w-28">
        ${p3 ? `
          <div class="w-12 h-12 mb-2">${getAvatarSvg(p3.avatar, 48)}</div>
          <div class="font-black text-xs text-center truncate max-w-full">${escapeHtml(p3.name)}</div>
          <div class="text-[11px] font-bold text-gray-600">${p3.score} pts</div>
          <div class="podium-pillar bg-green-300 w-full h-16 mt-2">
            <span class="text-2xl font-black">3</span>
          </div>
        ` : '<div class="w-full h-12"></div>'}
      </div>
    `;

  }
}

// Instantiate on load
window.addEventListener('DOMContentLoaded', () => {
  window.app = new DoodleAndDegreeApp();
});
