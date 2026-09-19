import asyncio
import unittest
from app.rooms import GameRoom
from app.main import app, room_manager
from fastapi.testclient import TestClient

class Socket:
    def __init__(self): self.messages=[]
    async def send_json(self, message): self.messages.append(message)

class TurnTests(unittest.IsolatedAsyncioTestCase):
    async def asyncSetUp(self):
        self.room=GameRoom('TEST12','a')
        self.a,self.b=Socket(),Socket()
        self.room.add_player('a','Artist','cat',self.a)
        self.room.add_player('b','Guesser','bird',self.b)
        self.room.review_time=0.03
        await self.room.start_game('a')

    async def asyncTearDown(self):
        if self.room.timer_task:
            self.room.timer_task.cancel()
            await asyncio.gather(self.room.timer_task, return_exceptions=True)

    async def test_reject_off_slide_word_and_wrong_player(self):
        word=self.room.active_slide().word_boxes[0].word
        await self.room.set_secret_word('b',word)
        self.assertEqual(self.room.state,'WORD_SELECTION')
        await self.room.set_secret_word('a','not-on-this-slide-xyz')
        self.assertEqual(self.room.state,'WORD_SELECTION')
        self.assertEqual(self.a.messages[-1]['type'],'error')
        await self.room.set_secret_word('a',word)
        self.assertEqual(self.room.current_word,word)
        self.assertEqual(self.room.state,'DRAWING')

    async def test_skip_synchronizes_slide_and_resets_clock(self):
        before=self.room.current_slide_index
        await self.room.skip_current_slide('a')
        self.assertNotEqual(before,self.room.current_slide_index)
        self.assertEqual(self.room.time_remaining,20)
        self.assertEqual(self.a.messages[-1]['slide'],self.b.messages[-1]['slide'])
        await self.room.set_secret_word('a',self.room.active_slide().word_boxes[0].word)
        before=self.room.current_slide_index
        await self.room.skip_current_slide('a')
        self.assertEqual(before,self.room.current_slide_index)

    async def test_timeout_advances_and_snapshot_is_saved(self):
        self.room.draw_time=1
        await self.room.set_secret_word('a',self.room.active_slide().word_boxes[0].word)
        await self.room.timer_task
        self.assertEqual(self.room.state,'ROUND_REVIEW')
        await self.room.save_drawing_snapshot('data:image/png;base64,test')
        self.assertEqual(self.room.study_pairs[-1].drawing_snapshot,'data:image/png;base64,test')
        await asyncio.sleep(.06)
        self.assertEqual(self.room.state,'WORD_SELECTION')
        self.assertEqual(self.room.drawer_id,'b')
        self.assertIsNone(self.room.current_drawing_snapshot)

    async def test_selection_expiry_does_not_assign_word(self):
        self.room.time_remaining=1
        await asyncio.sleep(1.08)
        self.assertEqual(self.room.state,'WORD_SELECTION')
        self.assertEqual(self.room.drawer_id,'b')
        self.assertEqual(self.room.current_word,'')
        self.assertEqual(self.room.study_pairs,[])

    async def test_classic_selection_score_finish_and_replay(self):
        self.room.mode='classic'
        await self.room.begin_selection()
        self.assertIsNone(self.a.messages[-1]['slide'])
        self.assertEqual(len(self.a.messages[-1]['simple_terms']),3)
        self.assertNotIn('simple_terms',self.b.messages[-1])
        await self.room.set_secret_word('a',self.room.word_options[0])
        await self.room.handle_guess('b',self.room.current_word)
        self.assertGreater(self.room.players['b'].score,0)
        await asyncio.sleep(.06)
        self.assertEqual(self.room.drawer_id,'b')
        self.room.total_rounds=1
        await self.room.set_secret_word('b',self.room.word_options[0])
        await self.room.handle_guess('a',self.room.current_word)
        await asyncio.sleep(.06)
        self.assertEqual(self.room.state,'GAME_OVER')
        await self.room.start_game('a')
        self.assertEqual(self.room.state,'WORD_SELECTION')
        self.assertEqual(self.room.players['a'].score,0)

    async def test_guesser_gets_blanks_immediately_and_same_slide(self):
        word=self.room.active_slide().word_boxes[0].word
        await self.room.set_secret_word('a',word)
        drawer=self.a.messages[-1]
        guesser=self.b.messages[-1]
        self.assertEqual(guesser['slide'],drawer['slide'])
        self.assertEqual(guesser['word_lengths'],[len(word)])
        self.assertEqual(guesser['masked_word'].count('_'),len(word))
        self.assertNotIn('word',guesser)
        self.assertEqual(self.room.get_room_state_dict('b')['masked_word'],guesser['masked_word'])

    async def test_balloon_typo_private_no_points(self):
        self.room.mode='classic'
        self.room.word_options=['Balloon']
        await self.room.set_secret_word('a','Balloon')
        before=len(self.a.messages)
        await self.room.handle_guess('b','baloon')
        self.assertEqual(self.b.messages[-1]['type'],'close_guess')
        self.assertIn('Very close',self.b.messages[-1]['text'])
        self.assertEqual(len(self.a.messages),before)
        self.assertEqual(self.room.players['b'].score,0)
        await self.room.handle_guess('b','balloon')
        self.assertGreater(self.room.players['b'].score,0)

    async def test_back_to_lobby_keeps_deck_and_allows_restart(self):
        deck=self.room.slide_manager
        await self.room.return_to_lobby('b')
        self.assertEqual(self.room.state,'WORD_SELECTION')
        await self.room.return_to_lobby('a')
        self.assertEqual(self.room.state,'LOBBY')
        self.assertIsNone(self.room.timer_task)
        self.assertIs(self.room.slide_manager,deck)
        self.assertEqual(self.b.messages[-1]['type'],'room_state')
        await self.room.start_game('a')
        self.assertEqual(self.room.state,'WORD_SELECTION')

    async def test_drawer_exit_passes_turn_and_transfers_host(self):
        await self.room.disconnect_player('a')
        self.assertEqual(self.room.host_id,'b')
        await asyncio.sleep(.07)
        self.assertEqual(self.room.drawer_id,'b')
        self.assertEqual(self.room.state,'WORD_SELECTION')

    async def test_hint_rejoins_pdf_lines_and_masks_answer(self):
        slide=self.room.active_slide()
        slide.text_content='Overfitting\nSome outliers penetrate the area of the other group and disturb\nthe boundary. As Machine Learning considers all the data, even\nthe noise, it ends up producing an improper model.'
        hint=self.room.slide_manager.get_contextual_hint(self.room.current_slide_index,'boundary')
        self.assertIn('Some outliers',hint)
        self.assertIn('_____',hint)
        self.assertNotIn('boundary',hint)
        self.assertNotIn('As Machine',hint)

class UploadTests(unittest.TestCase):
    def test_upload_permissions_repeat_and_bad_pdf_keeps_deck(self):
        with TestClient(app) as client:
            code=client.post('/api/rooms',data={'host_id':'owner'}).json()['code']
            url=f'/api/rooms/{code}/upload-pdf'
            with open('sample_slides/ml_lecture_slides.pdf','rb') as file: data=file.read()
            files={'file':('lecture.pdf',data,'application/pdf')}
            self.assertEqual(client.post(url,data={'player_id':'stranger'},files=files).status_code,403)
            for _ in range(2):
                self.assertEqual(client.post(url,data={'player_id':'owner'},files=files).status_code,200)
            old=room_manager.get_room(code).slide_manager
            self.assertEqual(client.post(url,data={'player_id':'owner'},files={'file':('bad.pdf',b'not pdf')}).status_code,400)
            self.assertIs(room_manager.get_room(code).slide_manager,old)

if __name__=='__main__': unittest.main()
