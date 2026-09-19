import { readFileSync } from 'node:fs';
import assert from 'node:assert/strict';

globalThis.WebSocketRequestResponsePair = class { constructor(request, response){ this.request=request; this.response=response; } };
const { GameRoom } = await import('./src/worker.js');

class Storage {
  constructor(){ this.data=new Map(); this.alarm=null; }
  async get(k){ return this.data.get(k); }
  async put(k,v){ this.data.set(k,structuredClone(v)); }
  async delete(keys){ for(const k of Array.isArray(keys)?keys:[keys]) this.data.delete(k); }
  async list({prefix}={}){ return new Map([...this.data].filter(([k])=>!prefix||k.startsWith(prefix))); }
  async setAlarm(v){ this.alarm=v; }
  async deleteAlarm(){ this.alarm=null; }
}
class Socket {
  constructor(id){ this.attachment={playerId:id}; this.messages=[]; }
  serializeAttachment(v){this.attachment=v;} deserializeAttachment(){return this.attachment;}
  send(v){this.messages.push(JSON.parse(v));} close(){}
}
class Context {
  constructor(){this.storage=new Storage();this.sockets=[];}
  setWebSocketAutoResponse(){} getWebSockets(){return this.sockets;} acceptWebSocket(ws){this.sockets.push(ws);}
}

const ctx=new Context(), room=new GameRoom(ctx,{});
const slides=JSON.parse(readFileSync(new URL('./public/default-slides.json', import.meta.url),'utf8'));
let response=await room.fetch(new Request('https://room/init',{method:'POST',body:JSON.stringify({code:'ABC123',host_id:'host',mode:'study',draw_time:120,total_rounds:1,slides})}));
assert.equal(response.status,200);
const host=new Socket('host'), guesser=new Socket('guest'); ctx.sockets.push(host,guesser);
await room.webSocketMessage(host,JSON.stringify({type:'join',name:'Host',avatar:'cat'}));
await room.webSocketMessage(guesser,JSON.stringify({type:'join',name:'Guest',avatar:'flame'}));
await room.webSocketMessage(host,JSON.stringify({type:'start_game'}));
assert.equal(room.room.phase,'WORD_SELECTION');
const active=await room.getSlide(); const chosen=active.word_boxes[0].word;
await room.webSocketMessage(host,JSON.stringify({type:'select_word',word:chosen}));
assert.equal(room.room.phase,'DRAWING');
await room.webSocketMessage(host,JSON.stringify({type:'stroke',stroke:{points:[{x:1,y:2}],color:'#000',width:6,tool:'brush'}}));
assert.equal(room.room.strokes.length,1);
const typo=chosen.length>4 ? chosen.slice(0,-1) : `${chosen}x`;
await room.webSocketMessage(guesser,JSON.stringify({type:'guess',text:typo}));
assert.ok(guesser.messages.some(m=>m.type==='close_guess'));
await room.webSocketMessage(guesser,JSON.stringify({type:'guess',text:chosen}));
assert.ok(guesser.messages.some(m=>m.type==='correct_guess'));
assert.equal(room.room.phase,'ROUND_REVIEW');
await room.returnToLobby();
assert.equal(room.room.phase,'LOBBY');
console.log('Cloudflare room flow passed');
