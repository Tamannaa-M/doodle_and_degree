import asyncio
import random
import string
import time
import re
from typing import Dict, List, Optional, Set
from fastapi import WebSocket
from app.models import Player, Stroke, ChatMessage, StudyPair
from app.slide_manager import SlideManager

def levenshtein_distance(s1: str, s2: str) -> int:
    s1, s2 = s1.lower().strip(), s2.lower().strip()
    if s1 == s2:
        return 0
    if len(s1) < len(s2):
        return levenshtein_distance(s2, s1)
    if len(s2) == 0:
        return len(s1)

    previous_row = range(len(s2) + 1)
    for i, c1 in enumerate(s1):
        current_row = [i + 1]
        for j, c2 in enumerate(s2):
            insertions = previous_row[j + 1] + 1
            deletions = current_row[j] + 1
            substitutions = previous_row[j] + (c1 != c2)
            current_row.append(min(insertions, deletions, substitutions))
        previous_row = current_row

    return previous_row[-1]

def is_close_guess(guess: str, target: str) -> bool:
    g = guess.lower().strip()
    t = target.lower().strip()
    if g == t:
        return False
    # Substring check for stem matches like boost / boosting
    if len(g) >= 4 and (g in t or t in g):
        return True
    dist = levenshtein_distance(g, t)
    if len(t) <= 4:
        return dist == 1
    elif len(t) <= 8:
        return dist <= 2
    else:
        return dist <= 3

CLASSIC_CATEGORIES = {
    "general": [
        "Cat", "Dog", "Rocket", "Pizza", "Umbrella", "Bicycle", "Castle", "Rainbow", "Robot", "Guitar",
        "Penguin", "Butterfly", "Volcano", "Mermaid", "Lighthouse", "Snowman", "Dinosaur", "Popcorn", "Camera", "Octopus",
        "Balloon", "Airplane", "Turtle", "Dragon", "Waterfall", "Sandwich", "Sunflower", "Skateboard", "Pirate", "Telescope",
        "Helicopter", "Submarine", "Spaceship", "Satellite", "Campfire", "Diamond", "Treasure", "Crown", "Anchor", "Compass",
        "Microscope", "Binoculars", "Flamingo", "Chameleon", "Kangaroo", "Dolphin", "Cheetah", "Peacock", "Gorilla", "Koala",
        "Burger", "Sushi", "Taco", "Pancake", "Waffle", "Donut", "Ice Cream", "Cupcake", "Cookie", "Avocado",
        "Watermelon", "Pineapple", "Strawberry", "Cherry", "Banana", "Apple", "Coffee", "Boba Tea", "Milkshake", "Chocolate",
        "Surfing", "Skiing", "Dancing", "Juggling", "Camping", "Fishing", "Bowling", "Karate", "Archery", "Painting",
        "Knight", "Astronaut", "Wizard", "Superhero", "Detective", "Ninja", "Chef", "Doctor", "Firefighter", "Pilot",
        "Ghost", "Alien", "Monster", "Unicorn", "Phoenix", "Mummy", "Vampire", "Tornado", "Lightning", "Earthquake",
        "Island", "Pyramid", "Bridge", "Windmill", "Igloo", "Statue", "Ferris Wheel", "Rollercoaster", "Hot Air Balloon", "Parachute"
    ],
    "animals": [
        "Cat", "Dog", "Elephant", "Giraffe", "Penguin", "Dolphin", "Lion", "Tiger", "Kangaroo", "Chameleon",
        "Octopus", "Owl", "Rabbit", "Hamster", "Cheetah", "Panda", "Koala", "Monkey", "Gorilla", "Zebra",
        "Hippo", "Rhino", "Camel", "Llama", "Flamingo", "Peacock", "Parrot", "Toucan", "Eagle", "Hawk",
        "Bat", "Squirrel", "Beaver", "Hedgehog", "Fox", "Wolf", "Bear", "Polar Bear", "Seal", "Walrus",
        "Whale", "Shark", "Jellyfish", "Seahorse", "Starfish", "Crab", "Lobster", "Turtle", "Frog", "Snake",
        "Crocodile", "Lizard", "Dinosaur", "Dragon", "Butterfly", "Bee", "Ant", "Spider", "Scorpion", "Snail",
        "Ladybug", "Dragonfly", "Grasshopper", "Caterpillar", "Duck", "Swan", "Goose", "Chicken", "Rooster", "Turkey",
        "Ostrich", "Sheep", "Goat", "Cow", "Bull", "Horse", "Donkey", "Pig", "Deer", "Moose",
        "Sloth", "Otter", "Badger", "Raccoon", "Skunk", "Platypus", "Pelican", "Woodpecker", "Seagull", "Pigeon",
        "Goldfish", "Swordfish", "Stingray", "Eel", "Squid", "Clam", "Shrimp", "Meerkat", "Lemur", "Hyena",
        "Wombat", "Armadillo", "Porcupine", "Jaguar", "Leopard", "Panther", "Gazelle", "Piranha", "Manta Ray", "Crow"
    ],
    "food": [
        "Pizza", "Burger", "Taco", "Burrito", "Sushi", "Hot Dog", "Sandwich", "Pancake", "Waffle", "Donut",
        "Ice Cream", "Cupcake", "Cookie", "Popcorn", "French Fries", "Spaghetti", "Noodles", "Ramen", "Dumpling", "Croissant",
        "Baguette", "Pretzel", "Bagel", "Toast", "Cheese", "Egg", "Bacon", "Sausage", "Steak", "Chicken Wing",
        "Salad", "Soup", "Avocado", "Tomato", "Potato", "Carrot", "Broccoli", "Corn", "Mushroom", "Onion",
        "Garlic", "Pepper", "Cucumber", "Pumpkin", "Apple", "Banana", "Orange", "Strawberry", "Watermelon", "Pineapple",
        "Grapes", "Mango", "Peach", "Cherry", "Lemon", "Lime", "Blueberry", "Kiwi", "Coconut", "Papaya",
        "Cake", "Pie", "Brownie", "Muffin", "Chocolate", "Candy", "Lollipop", "Marshmallow", "Milkshake", "Smoothie",
        "Coffee", "Tea", "Juice", "Soda", "Boba Tea", "Nachos", "Quesadilla", "Lasagna", "Meatball", "Kebab",
        "Curry", "Rice Bowl", "Churro", "Cotton Candy", "Fondue", "Popsicle", "Pudding", "Sundae", "Tart", "Crepe"
    ],
    "objects": [
        "Rocket", "Telescope", "Bicycle", "Umbrella", "Castle", "Robot", "Guitar", "Camera", "Balloon", "Airplane",
        "Skateboard", "Lighthouse", "Snowman", "Helicopter", "Submarine", "Sailboat", "Train", "Truck", "Car", "Motorcycle",
        "Scooter", "Bus", "Tractor", "Ambulance", "Fire Truck", "Police Car", "Spaceship", "Satellite", "Compass", "Map",
        "Backpack", "Suitcase", "Clock", "Hourglass", "Watch", "Flashlight", "Lantern", "Candle", "Lamp", "Lightbulb",
        "Mirror", "Key", "Lock", "Padlock", "Scissors", "Hammer", "Wrench", "Screwdriver", "Axe", "Shovel",
        "Broom", "Bucket", "Ladder", "Anchor", "Wheelbarrow", "Microscope", "Binoculars", "Magnifying Glass", "Globe", "Book",
        "Notebook", "Envelope", "Paintbrush", "Palette", "Easel", "Piano", "Drums", "Violin", "Trumpet", "Saxophone",
        "Microphone", "Headphones", "Radio", "Television", "Computer", "Laptop", "Smartphone", "Game Controller", "Crown", "Ring",
        "Necklace", "Glasses", "Sunglasses", "Hat", "Helmet", "Boots", "Trophy", "Medal", "Flag", "Treasure Chest",
        "Sword", "Shield", "Bow and Arrow", "Boomerang", "Kite", "Yo-yo", "Teddy Bear", "Tent", "Campfire", "Igloo"
    ],
    "activities": [
        "Surfing", "Skateboarding", "Skiing", "Snowboarding", "Swimming", "Diving", "Fishing", "Camping", "Hiking", "Climbing",
        "Running", "Jogging", "Cycling", "Dancing", "Singing", "Juggling", "Cooking", "Baking", "Painting", "Drawing",
        "Reading", "Writing", "Gardening", "Knitting", "Sewing", "Photography", "Gaming", "Bowling", "Archery", "Fencing",
        "Boxing", "Karate", "Yoga", "Gymnastics", "Ballet", "Magic Show", "Skydiving", "Scuba Diving", "Kayaking", "Canoeing",
        "Rowing", "Sailing", "Ice Skating", "Roller Skating", "Horse Riding", "Dog Walking", "Bird Watching", "Stargazing", "Sunbathing", "Shopping",
        "Flying a Kite", "Building a Sandcastle", "Playing Guitar", "Playing Drums", "Playing Piano", "Playing Chess", "Playing Soccer", "Playing Basketball", "Playing Tennis", "Playing Golf"
    ]
}

CLASSIC_WORDS = CLASSIC_CATEGORIES["general"]

class GameRoom:
    def __init__(self, code: str, host_id: str, default_pdf: str = "sample_slides/ml_lecture_slides.pdf"):
        self.code = code.upper()
        self.host_id = host_id
        self.players: Dict[str, Player] = {}
        self.connections: Dict[str, WebSocket] = {}
        
        # Room Configuration
        self.mode: str = "study" # "study" | "classic"
        self.classic_category: str = "general"
        self.used_classic_words: List[str] = []
        self.selection_time = 20
        self.review_time = 5
        self.word_options = []
        self.draw_time: int = 120
        self.total_rounds: int = 3
        self.current_round: int = 1
        
        # State: "LOBBY" | "WORD_SELECTION" | "DRAWING" | "ROUND_REVIEW" | "GAME_OVER"
        self.state: str = "LOBBY"
        
        # Slides
        self.slide_manager = SlideManager()
        self.current_pdf_path = default_pdf
        self.slide_manager.load_pdf(default_pdf)
        self.used_slide_indices: Set[int] = set()
        self.current_slide_index: int = 0
        
        # Drawing & Turn
        self.drawer_id: Optional[str] = None
        self.current_word: str = ""
        self.revealed_indices: Set[int] = set()
        self.strokes: List[Stroke] = []
        self.time_remaining: int = 0
        self.timer_task: Optional[asyncio.Task] = None
        self.hint_broadcasted: bool = False
        
        # Study Pairs (For Post-game Study Guide)
        self.study_pairs: List[StudyPair] = []
        self.current_drawing_snapshot: Optional[str] = None
        
        # Player rotation order
        self.player_order: List[str] = []
        self.drawer_index: int = 0

    def add_player(self, player_id: str, name: str, avatar: str, ws: WebSocket) -> Player:
        is_host = (len(self.players) == 0) or (player_id == self.host_id)
        if is_host:
            self.host_id = player_id

        existing = self.players.get(player_id)
        if existing:
            existing.connected = True
            existing.is_host = is_host
            self.connections[player_id] = ws
            return existing

        player = Player(
            id=player_id,
            name=name,
            avatar=avatar,
            score=0,
            is_host=is_host,
            connected=True
        )
        self.players[player_id] = player
        self.connections[player_id] = ws
        if player_id not in self.player_order:
            self.player_order.append(player_id)
        return player

    def remove_connection(self, player_id: str):
        if player_id in self.connections:
            del self.connections[player_id]
        if player_id in self.players:
            self.players[player_id].connected = False

        if player_id in self.players:
            self.players[player_id].is_host = False
        # If host left, elect new host
        if player_id == self.host_id:
            connected_players = [pid for pid, p in self.players.items() if p.connected]
            if connected_players:
                self.host_id = connected_players[0]
                self.players[self.host_id].is_host = True

    async def broadcast(self, message: dict, exclude_id: Optional[str] = None):
        dead_conns = []
        for pid, ws in list(self.connections.items()):
            if exclude_id and pid == exclude_id:
                continue
            try:
                await ws.send_json(message)
            except Exception:
                dead_conns.append(pid)
        for pid in dead_conns:
            self.remove_connection(pid)

    async def send_to(self, player_id: str, message: dict):
        if player_id in self.connections:
            try:
                await self.connections[player_id].send_json(message)
            except Exception:
                self.remove_connection(player_id)

    async def update_settings(self, player_id: str, draw_time: int, total_rounds: int, mode: str = "study", classic_category: str = "general"):
        if player_id != self.host_id or self.state != "LOBBY":
            return
        self.mode = mode if mode in ("study", "classic") else "study"
        if classic_category in CLASSIC_CATEGORIES:
            self.classic_category = classic_category
        self.draw_time = max(30, min(180, int(draw_time)))
        self.total_rounds = max(1, min(10, int(total_rounds)))
        await self.broadcast({
            "type": "settings_updated",
            "mode": self.mode,
            "classic_category": self.classic_category,
            "draw_time": self.draw_time,
            "total_rounds": self.total_rounds
        })

    async def update_pdf(self, pdf_path: str):
        manager = SlideManager()
        manager.load_pdf(pdf_path)
        if not manager.slides:
            raise ValueError("No slides could be read from this file.")
        self.current_pdf_path = pdf_path
        self.slide_manager = manager
        self.used_slide_indices.clear()
        self.current_slide_index = 0
        await self.broadcast({
            "type": "slides_updated",
            "total_slides": len(self.slide_manager.slides),
            "pdf_name": self.slide_manager.pdf_name
        })

    def word_lengths(self):
        return [len(part) for part in re.findall(r"[A-Za-z0-9]+", self.current_word)]

    async def return_to_lobby(self, player_id: str):
        if player_id != self.host_id:
            return
        if self.timer_task and self.timer_task is not asyncio.current_task():
            self.timer_task.cancel()
        self.timer_task = None
        self.state = "LOBBY"
        self.drawer_id = None
        self.current_word = ""
        self.time_remaining = 0
        self.strokes = []
        self.current_round = 1
        for player in self.players.values():
            player.is_drawing = False
            player.has_guessed = False
        for pid in list(self.connections):
            await self.send_to(pid, {"type": "room_state", "state": self.get_room_state_dict(pid)})

    async def disconnect_player(self, player_id: str):
        self.remove_connection(player_id)
        await self.broadcast({"type": "player_left", "player_id": player_id,
                              "players": [p.model_dump() for p in self.players.values()]})
        if not self.connections:
            if self.timer_task and self.timer_task is not asyncio.current_task():
                self.timer_task.cancel()
            self.state = "LOBBY"
            return
        if player_id == self.drawer_id and self.state in ("WORD_SELECTION", "DRAWING"):
            await self.end_round("The drawer left — passing the turn")
        elif self.state == "DRAWING":
            guessers = [p for pid, p in self.players.items() if p.connected and pid != self.drawer_id]
            if guessers and all(p.has_guessed for p in guessers):
                await self.end_round("Everyone remaining guessed correctly!")

    def get_masked_word(self) -> str:
        if not self.current_word:
            return ""
        result = []
        for idx, char in enumerate(self.current_word):
            if char in " -_/()":
                result.append(char)
            elif idx in self.revealed_indices:
                result.append(char.upper())
            else:
                result.append("_")
        return " ".join(result)

    def get_next_slide_index(self) -> int:
        total_slides = len(self.slide_manager.slides)
        if total_slides == 0:
            return 0
        eligible = [i for i, slide in enumerate(self.slide_manager.slides) if slide.word_boxes]
        available = [i for i in eligible if i not in self.used_slide_indices]
        if not available:
            # If all used, reset cycle
            self.used_slide_indices.clear()
            available = [i for i in eligible if i != self.current_slide_index] or eligible
        if not available:
            return 0
        chosen = random.choice(available)
        self.used_slide_indices.add(chosen)
        return chosen

    async def start_game(self, host_id: str):
        if host_id != self.host_id or self.state not in ["LOBBY", "GAME_OVER"]:
            return

        self.state = "WORD_SELECTION"
        self.current_round = 1
        self.drawer_index = 0
        self.study_pairs = []
        for p in self.players.values():
            p.score = 0
            p.has_guessed = False
            p.is_drawing = False

        # Filter active players
        self.player_order = [pid for pid, p in self.players.items() if p.connected]
        if not self.player_order:
            self.player_order = list(self.players.keys())

        await self.next_turn()

    async def next_turn(self):
        if self.timer_task and self.timer_task is not asyncio.current_task() and not self.timer_task.done():
            self.timer_task.cancel()

        # Check if round completed
        if self.drawer_index >= len(self.player_order):
            self.drawer_index = 0
            self.current_round += 1

        if self.current_round > self.total_rounds:
            await self.end_game()
            return

        # Skip disconnected players without stranding the round timer.
        if not any(p.connected for p in self.players.values()):
            await self.end_game()
            return
        if not self.players[self.player_order[self.drawer_index]].connected:
            self.drawer_index += 1
            await self.next_turn()
            return

        # Next drawer
        self.drawer_id = self.player_order[self.drawer_index]
        self.drawer_index += 1
        for pid, p in self.players.items():
            p.has_guessed = False
            p.is_drawing = (pid == self.drawer_id)

        self.strokes = []
        self.current_word = ""
        self.current_drawing_snapshot = None
        self.revealed_indices = set()
        self.hint_broadcasted = False
        self.state = "WORD_SELECTION"

        await self.begin_selection()

    def active_slide(self):
        return self.slide_manager.get_slide(self.current_slide_index) if self.mode == "study" else None

    async def begin_selection(self):
        if self.timer_task and self.timer_task is not asyncio.current_task() and not self.timer_task.done():
            self.timer_task.cancel()
        self.current_slide_index = self.get_next_slide_index()
        slide = self.active_slide()
        if self.mode == "classic":
            pool = CLASSIC_CATEGORIES.get(self.classic_category, CLASSIC_CATEGORIES["general"])
            available = [w for w in pool if w not in self.used_classic_words]
            if len(available) < 3:
                self.used_classic_words = []
                available = list(pool)
            self.word_options = random.sample(available, 3)
        else:
            self.word_options = []
        self.time_remaining = self.selection_time
        common = {"slide": slide.model_dump() if slide else None, "mode": self.mode,
                  "time_limit": self.selection_time, "round": self.current_round,
                  "total_rounds": self.total_rounds, "players": [p.model_dump() for p in self.players.values()]}
        await self.send_to(self.drawer_id, {**common, "type": "word_selection_drawer",
            "simple_terms": self.word_options, "challenging_terms": []})
        await self.broadcast({**common, "type": "word_selection_guesser",
            "drawer_name": self.players[self.drawer_id].name}, exclude_id=self.drawer_id)
        self.timer_task = asyncio.create_task(self.word_selection_timer())

    async def word_selection_timer(self):
        try:
            while self.time_remaining > 0 and self.state == "WORD_SELECTION":
                await asyncio.sleep(1)
                self.time_remaining -= 1
                await self.broadcast({"type": "selection_tick", "time_remaining": self.time_remaining})
            if self.state == "WORD_SELECTION":
                await self.end_round(reason="No word selected — turn passed")
        except asyncio.CancelledError:
            pass

    async def set_secret_word(self, player_id: str, word: str):
        if player_id != self.drawer_id or self.state != "WORD_SELECTION":
            return

        word = " ".join(word.strip().split())
        slide = self.active_slide()
        allowed = self.word_options if self.mode == "classic" else [box.word for box in slide.word_boxes] if slide else []
        match = next((w for w in allowed if w.casefold() == word.casefold()), None)
        if not match:
            await self.send_to(player_id, {"type": "error", "message": "Choose a highlighted word on the current slide." if self.mode == "study" else "Choose one of the three words."})
            return
        word = match
        if self.mode == "classic" and word not in self.used_classic_words:
            self.used_classic_words.append(word)
        if self.timer_task and self.timer_task is not asyncio.current_task() and not self.timer_task.done():
            self.timer_task.cancel()

        self.current_word = word.strip()
        self.state = "DRAWING"
        self.time_remaining = self.draw_time
        self.revealed_indices = set()
        self.hint_broadcasted = False

        slide = self.active_slide()

        # Broadcast turn start
        masked = self.get_masked_word()

        # Drawer sees actual word
        await self.send_to(self.drawer_id, {
            "type": "drawing_started_drawer",
            "word": self.current_word,
            "masked_word": masked,
            "word_lengths": self.word_lengths(),
            "slide": slide.model_dump() if slide else None,
            "draw_time": self.draw_time,
            "round": self.current_round,
            "total_rounds": self.total_rounds
        })

        # Guessers see masked word and slide
        await self.broadcast({
            "type": "drawing_started_guesser",
            "drawer_name": self.players[self.drawer_id].name,
            "masked_word": masked,
            "word_length": len(self.current_word),
            "word_lengths": self.word_lengths(),
            "slide": slide.model_dump() if slide else None,
            "draw_time": self.draw_time,
            "round": self.current_round,
            "total_rounds": self.total_rounds
        }, exclude_id=self.drawer_id)

        self.timer_task = asyncio.create_task(self.drawing_countdown())

    async def skip_current_slide(self, player_id: str):
        if player_id != self.drawer_id or self.state != "WORD_SELECTION":
            return
        await self.begin_selection()

    async def drawing_countdown(self):
        try:
            halfway_time = self.draw_time // 2
            quarter_time = self.draw_time // 4

            while self.time_remaining > 0 and self.state == "DRAWING":
                await asyncio.sleep(1)
                self.time_remaining -= 1

                # Broadcast time tick
                await self.broadcast({
                    "type": "timer_tick",
                    "time_remaining": self.time_remaining
                })

                # Letter reveal 1: at 50% time
                if self.time_remaining == halfway_time and len(self.current_word) > 3 and not self.revealed_indices:
                    self.revealed_indices.add(0)
                    masked = self.get_masked_word()
                    await self.broadcast({
                        "type": "letter_reveal",
                        "masked_word": masked,
                        "revealed_count": len(self.revealed_indices)
                    })

                # Letter reveal 2: at 25% time
                if self.time_remaining == quarter_time and len(self.current_word) > 5 and len(self.revealed_indices) < 2:
                    valid_indices = [i for i in range(len(self.current_word)) if i not in self.revealed_indices and self.current_word[i].isalpha()]
                    if valid_indices:
                        self.revealed_indices.add(random.choice(valid_indices))
                        masked = self.get_masked_word()
                        await self.broadcast({
                            "type": "letter_reveal",
                            "masked_word": masked,
                            "revealed_count": len(self.revealed_indices)
                        })

                # Contextual slide clue
                if self.mode == "study" and self.time_remaining <= int(self.draw_time * .7) and not self.hint_broadcasted:
                    self.hint_broadcasted = True
                    hint_text = self.slide_manager.get_contextual_hint(self.current_slide_index, self.current_word)
                    await self.broadcast({
                        "type": "contextual_hint",
                        "hint": hint_text
                    })

            if self.state == "DRAWING":
                await self.end_round(reason="Time's Up!")
        except asyncio.CancelledError:
            pass

            if self.state == "DRAWING":
                await self.end_round(reason="Time's Up!")
        except asyncio.CancelledError:
            pass

    async def add_stroke(self, player_id: str, stroke_data: dict):
        if player_id != self.drawer_id or self.state != "DRAWING":
            return
        stroke = Stroke(**stroke_data)
        self.strokes.append(stroke)
        # Broadcast stroke to all other players
        await self.broadcast({
            "type": "stroke_drawn",
            "stroke": stroke_data
        }, exclude_id=self.drawer_id)

    async def undo_stroke(self, player_id: str):
        if player_id != self.drawer_id or self.state != "DRAWING":
            return
        if self.strokes:
            self.strokes.pop()
            await self.broadcast({"type": "stroke_undone"})

    async def clear_canvas(self, player_id: str):
        if player_id != self.drawer_id or self.state != "DRAWING":
            return
        self.strokes = []
        await self.broadcast({"type": "canvas_cleared"})

    async def save_drawing_snapshot(self, snapshot_data_url: str):
        self.current_drawing_snapshot = snapshot_data_url
        if self.state == "ROUND_REVIEW" and self.study_pairs:
            self.study_pairs[-1].drawing_snapshot = snapshot_data_url

    async def handle_guess(self, player_id: str, text: str):
        if player_id not in self.players or self.state != "DRAWING":
            return

        player = self.players[player_id]
        guess_clean = text.strip()

        # If already guessed or is drawer, treat as regular chat or ignore
        if player.has_guessed or player_id == self.drawer_id:
            await self.broadcast({
                "type": "chat_message",
                "message": {
                    "sender_id": player.id,
                    "sender_name": player.name,
                    "avatar": player.avatar,
                    "text": guess_clean,
                    "is_system": False,
                    "is_correct": False
                }
            })
            return

        # Check Exact Match
        if guess_clean.lower() == self.current_word.lower():
            player.has_guessed = True
            # Calculate score: base 200 + time_remaining * 3 (max 500)
            points = 200 + (self.time_remaining * 3)
            player.score += points

            # Drawer gets 60 bonus points per correct guess
            drawer = self.players.get(self.drawer_id)
            if drawer:
                drawer.score += 60

            # Broadcast correct guess event
            await self.broadcast({
                "type": "correct_guess",
                "player_id": player.id,
                "player_name": player.name,
                "avatar": player.avatar,
                "points": points,
                "scores": {pid: p.score for pid, p in self.players.items()}
            })

            # Check if all guessers guessed
            connected_guessers = [
                p for pid, p in self.players.items()
                if p.connected and pid != self.drawer_id
            ]
            if all(p.has_guessed for p in connected_guessers):
                if self.timer_task and self.timer_task is not asyncio.current_task() and not self.timer_task.done():
                    self.timer_task.cancel()
                await self.end_round(reason="All players guessed the word!")
            return

        # Check Close Guess (Levenshtein / Fuzzy)
        if is_close_guess(guess_clean, self.current_word):
            # Send private close guess badge to the player only!
            await self.send_to(player_id, {
                "type": "close_guess",
                "text": f"Very close! '{guess_clean}' is almost right — check your spelling."
            })
            return

        # Normal incorrect chat message
        await self.broadcast({
            "type": "chat_message",
            "message": {
                "sender_id": player.id,
                "sender_name": player.name,
                "avatar": player.avatar,
                "text": guess_clean,
                "is_system": False,
                "is_correct": False
            }
        })

    async def end_round(self, reason: str = "Round Complete"):
        if self.state not in ("DRAWING", "WORD_SELECTION"):
            return
        self.state = "ROUND_REVIEW"
        if self.timer_task and self.timer_task is not asyncio.current_task() and not self.timer_task.done():
            self.timer_task.cancel()

        slide = self.active_slide()
        drawer = self.players.get(self.drawer_id)
        drawer_name = drawer.name if drawer else "Anonymous"

        # Record study pair
        pair = StudyPair(
            slide_index=self.current_slide_index,
            slide_image_url=slide.image_url if slide else "",
            word=self.current_word,
            drawer_name=drawer_name,
            drawing_strokes=list(self.strokes),
            drawing_snapshot=self.current_drawing_snapshot
        )
        if self.current_word:
            self.study_pairs.append(pair)

        # Broadcast review
        await self.broadcast({
            "type": "round_review",
            "word": self.current_word,
            "reason": reason,
            "drawer_name": drawer_name,
            "scores": {pid: p.score for pid, p in self.players.items()},
            "next_in": self.review_time
        })

        self.timer_task = asyncio.create_task(self.review_countdown())

    async def review_countdown(self):
        await asyncio.sleep(self.review_time)
        if self.state == "ROUND_REVIEW":
            await self.next_turn()

    async def end_game(self):
        self.state = "GAME_OVER"
        if self.timer_task and self.timer_task is not asyncio.current_task() and not self.timer_task.done():
            self.timer_task.cancel()

        # Sort podium
        ranked = sorted(self.players.values(), key=lambda p: p.score, reverse=True)
        podium = [
            {"rank": i + 1, "id": p.id, "name": p.name, "avatar": p.avatar, "score": p.score}
            for i, p in enumerate(ranked)
        ]

        study_guide = [
            {
                "slide_index": pair.slide_index + 1,
                "slide_image_url": pair.slide_image_url,
                "word": pair.word,
                "drawer_name": pair.drawer_name,
                "drawing_snapshot": pair.drawing_snapshot
            }
            for pair in self.study_pairs
        ]

        await self.broadcast({
            "type": "game_over",
            "podium": podium,
            "study_guide": study_guide
        })

    def get_room_state_dict(self, for_player_id: str) -> dict:
        slide = self.active_slide()
        return {
            "code": self.code,
            "mode": self.mode,
            "classic_category": self.classic_category,
            "word_options": self.word_options if for_player_id == self.drawer_id else [],
            "state": self.state,
            "host_id": self.host_id,
            "draw_time": self.draw_time,
            "total_rounds": self.total_rounds,
            "current_round": self.current_round,
            "drawer_id": self.drawer_id,
            "is_drawer": (for_player_id == self.drawer_id),
            "current_word": self.current_word if (for_player_id == self.drawer_id or self.state in ["ROUND_REVIEW", "GAME_OVER"]) else None,
            "masked_word": self.get_masked_word(),
            "word_lengths": self.word_lengths(),
            "hint": self.slide_manager.get_contextual_hint(self.current_slide_index, self.current_word) if self.hint_broadcasted and self.mode == "study" else None,
            "time_remaining": self.time_remaining,
            "players": [p.model_dump() for p in self.players.values()],
            "slide": slide.model_dump() if slide else None,
            "strokes": [s.model_dump() for s in self.strokes],
            "total_slides": len(self.slide_manager.slides),
            "pdf_name": self.slide_manager.pdf_name or "ML Lecture Slides",
            "study_pairs": [
                {
                    "slide_index": pair.slide_index + 1,
                    "slide_image_url": pair.slide_image_url,
                    "word": pair.word,
                    "drawer_name": pair.drawer_name,
                    "drawing_snapshot": pair.drawing_snapshot
                }
                for pair in self.study_pairs
            ]
        }

class RoomManager:
    def __init__(self):
        self.rooms: Dict[str, GameRoom] = {}

    def generate_code(self) -> str:
        for _ in range(100):
            code = "".join(random.choices(string.ascii_uppercase + string.digits, k=6))
            if code not in self.rooms:
                return code
        return "STUDY9"

    def create_room(self, host_id: str, default_pdf: str = "sample_slides/ml_lecture_slides.pdf") -> GameRoom:
        code = self.generate_code()
        room = GameRoom(code=code, host_id=host_id, default_pdf=default_pdf)
        self.rooms[code] = room
        return room

    def get_room(self, code: str) -> Optional[GameRoom]:
        return self.rooms.get(code.upper())
