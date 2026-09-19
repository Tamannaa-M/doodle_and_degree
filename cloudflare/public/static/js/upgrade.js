const originalAvatarSvg = getAvatarSvg;
getAvatarSvg = function(key, size=80) {
  if (!/^human-(?:[0-9]|1[01])-[0-3]-[0-5]-[0-4]-[0-4](?:-[01])?$/.test(key)) return originalAvatarSvg(key,size);
  const [,hair,face,skin,color,shirt,gender=0] = key.split('-').map((v,i)=>i ? Number(v) : v);
  const skinTone=['#ffd1b0','#edb16e','#bd7849','#784d3c','#f0b0bd','#94e4bb'][skin];
  const hairColor=['#24212c','#774436','#efbc43','#ff4191','#2359eb'][color];
  const shirtColor=['#2463ff','#ff4191','#ffe339','#55dfb0','#b6a0f5'][shirt];
  const hairstyles=[
    'M24 47 Q16 16 41 18 L49 8 55 20 74 14 69 24 Q90 29 78 52 L70 32 60 42 51 30 39 40 29 34Z',
    'M22 49 Q6 40 19 30 Q12 14 29 16 Q32 2 46 13 Q56 0 65 15 Q84 8 83 28 Q98 38 79 49 L74 33 Q50 44 29 34Z',
    'M26 48 Q14 33 24 24 Q25 8 43 17 Q58 11 75 26 L78 47 68 29 Q49 43 29 29Z M24 28 C1 34 1 4 22 8 C37 9 38 24 24 28 M75 27 C57 14 81 0 91 13 C102 28 85 37 75 27',
    'M23 50 Q12 15 45 16 Q87 7 81 53 L71 29 Q58 57 25 35Z',
    'M23 77 Q7 58 19 30 Q20 12 49 15 Q81 11 85 36 L87 80 71 88 72 34 Q50 46 29 31 L31 88Z',
    'M24 36 Q24 14 51 16 Q78 15 78 36 L72 31 66 34 60 30 53 34 44 30 36 34 29 31Z',
    'M24 45Q16 20 42 18Q81 10 79 48L70 31Q48 39 28 29Z',
    'M23 47Q16 18 48 16Q79 14 79 46L68 30 51 25 33 32Z',
    'M22 66Q10 24 40 17Q75 7 82 38L81 70 72 71 72 34 52 37 32 30 30 71Z',
    'M23 46Q8 35 22 26Q17 10 35 15Q43 5 55 15Q73 7 79 26Q93 33 78 49L71 30Q48 39 29 31Z',
    'M22 48Q12 21 42 16Q76 9 80 45L70 28Q49 46 26 35Z',
    'M24 46Q18 20 46 17Q74 11 79 46L72 32Q49 39 28 30Z M39 18Q27 4 46 2Q69 0 61 20Z'
  ];
  const backHair = {
    6:'M61 21Q92 0 93 39Q84 61 95 77Q73 67 77 40L64 30Z',
    7:'M23 47Q10 49 17 61Q9 69 19 77Q12 88 24 97Q38 91 28 81Q37 72 28 65Q37 55 29 48Z M77 47Q90 49 83 61Q91 69 81 77Q88 88 76 97Q62 91 72 81Q63 72 72 65Q63 55 71 48Z',
    8:'M18 44Q18 11 49 14Q84 11 84 47L86 81Q50 91 15 81Z',
    9:'M21 29Q5 31 13 46Q2 58 12 69Q4 82 18 89Q20 105 39 96L67 98Q86 102 88 86Q99 78 87 66Q98 51 87 40Q91 26 75 21Z',
    10:'M65 36Q84 36 83 53Q93 65 82 73Q90 81 78 90Q78 103 65 99Q53 88 65 78Q57 69 68 59Z',
    11:'M23 31Q8 57 15 93L35 96 37 37 66 38 66 97 86 91Q92 54 76 28Z'
  };
  let eyes=face===1 ? '<path d="M33 48l10 3-10 3" fill="none"/><ellipse cx="63" cy="51" rx="3" ry="5" fill="#222"/>' : face===3 ? '<path d="M32 49q6 6 12 0m12 0q6 6 12 0" fill="none"/>' : '<ellipse cx="38" cy="51" rx="3" ry="5" fill="#222"/><ellipse cx="63" cy="51" rx="3" ry="5" fill="#222"/>';
  if(face===2) eyes+='<g fill="none"><circle cx="37" cy="51" r="10"/><circle cx="64" cy="51" r="10"/><path d="M47 51h7m-27-3-5-3m52 3 5-3"/></g>';
  if(gender===1) eyes+='<path d="m33 47-3-3m34 3 3-3" fill="none" stroke-width="1.8"/>';
  const outline=gender===1?'M25 35Q49 10 76 35v21q-2 20-25 29Q26 79 25 56Z':'M25 35Q49 10 76 35v23q0 25-25 26Q25 82 25 58Z';
  return `<svg width="${Number(size)}" height="${Number(size)}" viewBox="0 0 100 110" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${gender===1?'Female':'Male'} doodle avatar"><g stroke="#22212a" stroke-width="2.6" stroke-linejoin="round" stroke-linecap="round">${backHair[hair]?`<path d="${backHair[hair]}" fill="${hairColor}"/>`:''}<path d="M12 108Q10 82 40 81h19q31 2 29 27" fill="${shirtColor}"/><path d="M42 72v13q8 10 16 0V72" fill="${skinTone}"/>${hair===4?`<path d="${hairstyles[4]}" fill="${hairColor}"/>`:''}<ellipse cx="25" cy="56" rx="7" ry="9" fill="${skinTone}"/><ellipse cx="76" cy="56" rx="7" ry="9" fill="${skinTone}"/><path d="${outline}" fill="${skinTone}"/><path d="${hairstyles[hair]}" fill="${hairColor}"/>${eyes}<path d="M50 53l-3 8h6" fill="none"/><path d="M38 66q12 20 26-1Z" fill="white"/><path d="M43 70h16" fill="none"/><path d="M31 62h5m29 0h5" stroke="#e77983"/><path d="M31 92l12 4 8-10 8 10 11-4" fill="none"/></g></svg>`;
};

DoodleAndDegreeApp.prototype.status = function(text) {
  const el=document.getElementById('appStatus');
  el.textContent=text; el.classList.remove('hidden');
  clearTimeout(this.statusTimer);
  this.statusTimer=setTimeout(()=>el.classList.add('hidden'),9000);
};
DoodleAndDegreeApp.prototype.refreshMode = function() {
  document.body.dataset.mode=this.mode;
  document.querySelectorAll('[data-mode].mode-card').forEach(btn=>{
    btn.classList.toggle('selected',btn.dataset.mode===this.mode);
    btn.setAttribute('aria-pressed',String(btn.dataset.mode===this.mode));
    btn.disabled=Boolean(this.roomCode && !this.isHost);
  });
  const catRow = document.getElementById('classicCategoryRow');
  if (catRow) catRow.classList.toggle('hidden', this.mode !== 'classic');
  const studyUpload = document.getElementById('studyUpload');
  if (studyUpload) studyUpload.hidden=(this.mode==='classic');
  document.getElementById('btnCopyInvite').disabled=!this.roomCode;
};
DoodleAndDegreeApp.prototype.initNewControls = function() {
  this.refreshMode();
  const fields=['avatarHair','avatarFace','avatarSkin','avatarColor','avatarShirt','avatarGender'].map(id=>document.getElementById(id));
  if(/^human-/.test(this.playerAvatar)) this.playerAvatar.split('-').slice(1).forEach((v,i)=>{fields[i].value=v;});
  const render=()=>{
    this.playerAvatar='human-'+fields.map(el=>el.value).join('-');
    localStorage.setItem('dd_player_avatar',this.playerAvatar);
    document.getElementById('avatarPreview').innerHTML=getAvatarSvg(this.playerAvatar,160);
    if(this.ws?.readyState===WebSocket.OPEN) this.ws.send(JSON.stringify({type:'profile',avatar:this.playerAvatar}));
  };
  fields.forEach(el=>el.addEventListener('change',render));
  document.getElementById('randomAvatar').onclick=()=>{fields.forEach(el=>el.selectedIndex=Math.floor(Math.random()*el.options.length));render();};
  render();
  document.querySelectorAll('.mode-card').forEach(btn=>btn.onclick=()=>{
    if(this.roomCode && !this.isHost) return;
    this.mode=btn.dataset.mode; this.refreshMode();
    const catVal = document.getElementById('selectClassicCategory')?.value || 'general';
    if(this.ws?.readyState===WebSocket.OPEN) this.ws.send(JSON.stringify({type:'update_settings',mode:this.mode,classic_category:catVal,draw_time:Number(this.selectDrawTime.value),total_rounds:Number(this.selectRounds.value)}));
  });
  const catSelect = document.getElementById('selectClassicCategory');
  if (catSelect) {
    catSelect.addEventListener('change', () => {
      if (this.isHost && this.ws?.readyState === WebSocket.OPEN) {
        this.ws.send(JSON.stringify({
          type: 'update_settings',
          mode: this.mode,
          classic_category: catSelect.value,
          draw_time: Number(this.selectDrawTime.value),
          total_rounds: Number(this.selectRounds.value)
        }));
      }
    });
  }
  this.pdfDropzone.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();this.pdfFileInput.click();}});
  this.modalBeginnerGuide.addEventListener('click',e=>{if(e.target===this.modalBeginnerGuide)this.modalBeginnerGuide.classList.add('hidden');});
  document.addEventListener('keydown',e=>{if(e.key==='Escape')this.modalBeginnerGuide.classList.add('hidden');});
  document.getElementById('btnLeaveRoom').onclick=()=>this.leaveRoom();
  document.querySelectorAll('[data-leave-room]').forEach(btn=>btn.onclick=()=>this.leaveRoom());
  document.querySelectorAll('[data-lobby]').forEach(btn=>btn.onclick=()=>{
    if(this.isHost && this.ws?.readyState===WebSocket.OPEN) this.ws.send(JSON.stringify({type:'return_to_lobby'}));
  });
  document.getElementById('btnGuesserPreview').onclick=()=>{
    if(!this.isDrawer || this.gameState!=='DRAWING') return;
    this.guesserPreview=!this.guesserPreview;
    this.canvas.setCanDraw(!this.guesserPreview);
    this.drawerToolbar.classList.toggle('hidden',this.guesserPreview);
    this.guesserPreview ? this.renderMaskedWord(this.lastMaskedWord) : this.renderDrawerSecretWord(this.secretWord);
    this.updateRoleControls();
  };
  const slidePanel=document.getElementById('slideViewport').parentElement;
  slidePanel.id='slidePanel';
  slidePanel.parentElement.classList.add('game-board');
  slidePanel.previousElementSibling.id='canvasPanel';
};

DoodleAndDegreeApp.prototype.updateRoleControls = function() {
  document.getElementById('btnLeaveRoom').classList.toggle('hidden',!this.roomCode);
  document.querySelectorAll('[data-lobby]').forEach(btn=>{btn.hidden=!this.isHost;btn.title='End the current game and return everyone to this room’s lobby';});
  const preview=document.getElementById('btnGuesserPreview');
  preview.classList.toggle('hidden',!this.isDrawer || this.gameState!=='DRAWING');
  preview.textContent=this.guesserPreview?'← Back to drawing':'Guesser view';
  document.getElementById('roleLabel').textContent=this.guesserPreview?'Guesser preview · your word is hidden; invite a friend to guess':this.isDrawer?'You are drawing · friends guess your word':'You are guessing · watch the drawing and type below';
  this.chatInput.disabled=this.isDrawer || this.gameState!=='DRAWING';
  this.btnSendChat.disabled=this.chatInput.disabled;
  this.chatInput.placeholder=this.isDrawer?'You are the drawer — your friends guess here':'Type your guess here…';
  document.getElementById('btnCreateRoom').hidden=Boolean(this.roomCode);
};

DoodleAndDegreeApp.prototype.showInitialHint = function() {
  const page=this.slideViewer.slideData?.page_num;
  this.hintText.textContent=this.mode==='study'?`Slide ${page} · The answer is on this exact slide. Match the drawing to a word with the letter count above.`:'Watch the drawing. Each dash is one letter; close spellings get a private “Very close!” nudge.';
  this.contextualHintBanner.classList.remove('hidden');
};

DoodleAndDegreeApp.prototype.leaveRoom = function() {
  const socket=this.ws;
  if(socket) {
    socket.onclose=null; socket.onmessage=null;
    if(socket.readyState===WebSocket.OPEN) socket.send(JSON.stringify({type:'leave_room'}));
    socket.close();
  }
  clearInterval(this.reviewTimer);
  this.ws=null; this.roomCode=null; this.roomData=null; this.isHost=false; this.isDrawer=false;
  this.gameState='LOBBY'; this.guesserPreview=false; this.secretWord=''; this.lastMaskedWord='';
  this.canvas.clearCanvas();this.slideViewer.loadSlide(null);
  this.chatMessages.replaceChildren();
  this.inputRoomCode.value='';
  this.hostSettingsBox.style.display='block';
  this.btnStartGame.style.display='block';this.btnStartGame.disabled=true;
  document.getElementById('roomStatus').textContent='YOUR NEXT GREAT DOODLE STARTS HERE';
  this.slideDeckInfo.textContent='Try the included sample, or upload your own PDF.';
  this.updatePlayerList([]);this.refreshMode();this.showLobbyView();
  history.replaceState(null,'','/');window.scrollTo(0,0);
  this.status('You left the room. Create a new one or join with a code.');
};
