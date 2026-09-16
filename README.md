# Doodle & Degree

Draw terribly. Guess brilliantly.

## Open the game
Double-click **start_game.bat**, then open **http://localhost:8001**. Keep the server window open while playing. This copy uses port 8001 so the original project on 8000 can stay running.

Alternatively, install requirements.txt with Python 3.10 or newer and run `python run.py`. Set DOODLE_PORT to change the port.

## Play
- Choose a male or female face style, then customize expression, skin tone, shirt, hair colour, and 12 hairstyles including ponytails, braids, bobs, buns, and long curls.
- Choose Study & scribble or Classic pictionary.
- Study: upload a text-based PDF directly from the lobby. A room is created automatically. Or create a room with the included sample slides.
- Classic: create a room; no upload is needed.
- Share the room code or invite link, then start. One player can practise solo.
- Study drawers have 20 seconds to click a highlighted word on the full-width slide. Skip slide restarts those 20 seconds. Only words from the current slide are accepted.
- Classic drawers choose one of three everyday words in 20 seconds.
- No word selected? The turn passes without assigning a word.
- Draw, guess, earn points, and review. The default drawing time is 120 seconds and can be set from 60 to 180 seconds. After five seconds, the next player takes a turn. Each round gives every connected player a turn.
- Guessers see the slide used for the word, word count, letter count, and dashes from the start. Near spellings such as “baloon” for “balloon” get a private “Very close” message.
- The host can return everyone to the lobby. Every player can leave a room at any point. If the drawer leaves, the turn passes and host control transfers when needed.
- Open How to play for illustrated study concepts. The unnecessary study-guide export has been removed.

## Notes
- Scanned/image-only PDFs need text recognition before upload. Invalid uploads keep the previous working slide deck.
- Rooms and scores are held in memory and clear when the server restarts.
- Localhost invite links work on this computer. For other devices, use this computer's local network address with port 8001 and allow local network access if Windows asks.
- Core layout, avatars, and guide illustrations are included locally. Web fonts and optional confetti use external services; the game works without them.
- Avatars persist locally; player identities are separate between browser tabs.

## Verification
Run `python -m unittest discover -s tests -v` for rooms, WebSockets, word validation, skipping, selection expiry, drawing timeout progression, Classic mode, scores, replay, snapshots, and upload failures.
