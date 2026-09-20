const CLASSIC_CATEGORIES = {
  general: [
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
  animals: [
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
  food: [
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
  objects: [
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
  activities: [
    "Surfing", "Skateboarding", "Skiing", "Snowboarding", "Swimming", "Diving", "Fishing", "Camping", "Hiking", "Climbing",
    "Running", "Jogging", "Cycling", "Dancing", "Singing", "Juggling", "Cooking", "Baking", "Painting", "Drawing",
    "Reading", "Writing", "Gardening", "Knitting", "Sewing", "Photography", "Gaming", "Bowling", "Archery", "Fencing",
    "Boxing", "Karate", "Yoga", "Gymnastics", "Ballet", "Magic Show", "Skydiving", "Scuba Diving", "Kayaking", "Canoeing",
    "Rowing", "Sailing", "Ice Skating", "Roller Skating", "Horse Riding", "Dog Walking", "Bird Watching", "Stargazing", "Sunbathing", "Shopping",
    "Flying a Kite", "Building a Sandcastle", "Playing Guitar", "Playing Drums", "Playing Piano", "Playing Chess", "Playing Soccer", "Playing Basketball", "Playing Tennis", "Playing Golf"
  ]
};

const CLASSIC_WORDS = CLASSIC_CATEGORIES.general;

const json = (value, status = 200) => new Response(JSON.stringify(value), {
  status,
  headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" }
});

function randomCode() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const bytes = crypto.getRandomValues(new Uint8Array(6));
  return [...bytes].map(x => chars[x % chars.length]).join("");
}

function getBotDoodleType(word) {
  const w = String(word || "").toLowerCase().trim();
  if (/pizza|burger|taco|sandwich|food|bread|cheese|snack|spaghetti|hot dog|pancake|waffle/i.test(w)) return "pizza";
  if (/rocket|space|alien|satellite|astronaut|meteor|spaceship|starship/i.test(w)) return "rocket";
  if (/house|castle|igloo|building|pyramid|home|tent|cabin/i.test(w)) return "house";
  if (/car|truck|bus|train|vehicle|drive|motorcycle|scooter|tractor|ambulance/i.test(w)) return "car";
  if (/tree|flower|plant|forest|garden|apple|sunflower|leaf|cactus/i.test(w)) return "tree";
  if (/sun|star|rainbow|light|lightning|cloud|sky|diamond/i.test(w)) return "sun";
  if (/fish|shark|dolphin|whale|octopus|ocean|sea|swimming|crab|lobster/i.test(w)) return "fish";
  if (/ice cream|donut|cake|cupcake|cookie|sweet|chocolate|candy|lollipop/i.test(w)) return "icecream";
  if (/balloon|kite|parachute|flying|air/i.test(w)) return "balloon";
  if (/boat|ship|submarine|sailboat|anchor|sail|canoe|kayak/i.test(w)) return "boat";
  if (/clock|watch|timer|hourglass|time/i.test(w)) return "clock";
  if (/dog|puppy|wolf|fox|bear|panda|koala/i.test(w)) return "dog";
  if (/cat|kitten|lion|tiger|leopard|panther|cheetah/i.test(w)) return "cat";
  if (/model|data|graph|neural|network|algorithm|learning|loss|layer|matrix|vector|feature|weight|bias|cluster|regression|classification|tree|ai|computer/i.test(w)) return "chart";

  const types = ["rocket", "pizza", "house", "car", "tree", "sun", "fish", "icecream", "balloon", "boat", "clock", "cat", "dog", "chart"];
  let hash = 0;
  for (let i = 0; i < w.length; i++) hash = (hash * 31 + w.charCodeAt(i)) >>> 0;
  return types[hash % types.length];
}

function getBotDoodleStrokes(word, step) {
  const type = getBotDoodleType(word);
  const strokes = [];

  if (type === "pizza") {
    if (step === 0) {
      strokes.push({ color: "#1E1E24", width: 5, points: [{ x: 260, y: 160 }, { x: 540, y: 160 }, { x: 400, y: 460 }, { x: 260, y: 160 }] });
    } else if (step === 1) {
      strokes.push({ color: "#FFE600", width: 8, points: [{ x: 250, y: 155 }, { x: 400, y: 145 }, { x: 550, y: 155 }] });
    } else if (step === 2) {
      // Pepperonis
      strokes.push({ color: "#FF5964", width: 8, points: [{ x: 360, y: 220 }, { x: 365, y: 225 }, { x: 360, y: 220 }] });
      strokes.push({ color: "#FF5964", width: 8, points: [{ x: 440, y: 230 }, { x: 445, y: 235 }, { x: 440, y: 230 }] });
      strokes.push({ color: "#FF5964", width: 8, points: [{ x: 400, y: 310 }, { x: 405, y: 315 }, { x: 400, y: 310 }] });
      strokes.push({ color: "#FF5964", width: 8, points: [{ x: 385, y: 390 }, { x: 390, y: 395 }, { x: 385, y: 390 }] });
    } else if (step === 3) {
      // Cheese melt drizzle
      strokes.push({ color: "#FFE600", width: 4, points: [{ x: 320, y: 200 }, { x: 350, y: 240 }, { x: 330, y: 280 }, { x: 420, y: 290 }, { x: 410, y: 350 }] });
    } else if (step === 4) {
      // Herbs & crust shading
      strokes.push({ color: "#38B000", width: 4, points: [{ x: 380, y: 250 }, { x: 385, y: 255 }] });
      strokes.push({ color: "#38B000", width: 4, points: [{ x: 430, y: 330 }, { x: 435, y: 335 }] });
      strokes.push({ color: "#1E1E24", width: 3, points: [{ x: 270, y: 175 }, { x: 530, y: 175 }] });
    }
  } else if (type === "rocket") {
    if (step === 0) {
      strokes.push({ color: "#1E1E24", width: 5, points: [{ x: 400, y: 120 }, { x: 340, y: 240 }, { x: 340, y: 370 }, { x: 460, y: 370 }, { x: 460, y: 240 }, { x: 400, y: 120 }] });
    } else if (step === 1) {
      // Fins
      strokes.push({ color: "#FF5964", width: 5, points: [{ x: 340, y: 320 }, { x: 270, y: 400 }, { x: 340, y: 380 }] });
      strokes.push({ color: "#FF5964", width: 5, points: [{ x: 460, y: 320 }, { x: 530, y: 400 }, { x: 460, y: 380 }] });
      // Tip
      strokes.push({ color: "#FF5964", width: 5, points: [{ x: 370, y: 180 }, { x: 400, y: 120 }, { x: 430, y: 180 }, { x: 370, y: 180 }] });
    } else if (step === 2) {
      // Porthole Window
      const windowPts = [];
      for (let i = 0; i <= 20; i++) {
        const a = (i * 18 * Math.PI) / 180;
        windowPts.push({ x: 400 + 35 * Math.cos(a), y: 270 + 35 * Math.sin(a) });
      }
      strokes.push({ color: "#35A7FF", width: 4, points: windowPts });
      strokes.push({ color: "#1E1E24", width: 6, points: [{ x: 400, y: 270 }, { x: 405, y: 270 }] });
    } else if (step === 3) {
      // Fire exhaust
      strokes.push({ color: "#FF5964", width: 5, points: [{ x: 360, y: 370 }, { x: 380, y: 460 }, { x: 400, y: 400 }, { x: 420, y: 470 }, { x: 440, y: 370 }] });
      strokes.push({ color: "#FFE600", width: 4, points: [{ x: 380, y: 370 }, { x: 400, y: 440 }, { x: 420, y: 370 }] });
    } else if (step === 4) {
      // Stars & space sparkles
      strokes.push({ color: "#FFE600", width: 4, points: [{ x: 220, y: 160 }, { x: 240, y: 160 }, { x: 230, y: 145 }, { x: 230, y: 175 }] });
      strokes.push({ color: "#FFE600", width: 4, points: [{ x: 570, y: 220 }, { x: 590, y: 220 }, { x: 580, y: 205 }, { x: 580, y: 235 }] });
      strokes.push({ color: "#35A7FF", width: 4, points: [{ x: 200, y: 320 }, { x: 215, y: 320 }, { x: 207, y: 310 }, { x: 207, y: 330 }] });
    }
  } else if (type === "house") {
    if (step === 0) {
      strokes.push({ color: "#1E1E24", width: 5, points: [{ x: 280, y: 260 }, { x: 520, y: 260 }, { x: 520, y: 460 }, { x: 280, y: 460 }, { x: 280, y: 260 }] });
    } else if (step === 1) {
      // Roof
      strokes.push({ color: "#FF5964", width: 5, points: [{ x: 250, y: 260 }, { x: 400, y: 140 }, { x: 550, y: 260 }, { x: 250, y: 260 }] });
    } else if (step === 2) {
      // Door & Knob
      strokes.push({ color: "#1E1E24", width: 4, points: [{ x: 360, y: 460 }, { x: 360, y: 350 }, { x: 440, y: 350 }, { x: 440, y: 460 }] });
      strokes.push({ color: "#FFE600", width: 6, points: [{ x: 425, y: 405 }, { x: 428, y: 405 }] });
    } else if (step === 3) {
      // Windows
      strokes.push({ color: "#35A7FF", width: 3, points: [{ x: 305, y: 290 }, { x: 345, y: 290 }, { x: 345, y: 330 }, { x: 305, y: 330 }, { x: 305, y: 290 }] });
      strokes.push({ color: "#35A7FF", width: 3, points: [{ x: 455, y: 290 }, { x: 495, y: 290 }, { x: 495, y: 330 }, { x: 455, y: 330 }, { x: 455, y: 290 }] });
      strokes.push({ color: "#1E1E24", width: 2, points: [{ x: 325, y: 290 }, { x: 325, y: 330 }] });
      strokes.push({ color: "#1E1E24", width: 2, points: [{ x: 475, y: 290 }, { x: 475, y: 330 }] });
    } else if (step === 4) {
      // Chimney + Smoke + Sun
      strokes.push({ color: "#1E1E24", width: 4, points: [{ x: 460, y: 190 }, { x: 460, y: 140 }, { x: 490, y: 140 }, { x: 490, y: 220 }] });
      strokes.push({ color: "#35A7FF", width: 3, points: [{ x: 475, y: 125 }, { x: 485, y: 105 }, { x: 475, y: 85 }, { x: 495, y: 65 }] });
      strokes.push({ color: "#FFE600", width: 5, points: [{ x: 180, y: 120 }, { x: 210, y: 120 }, { x: 195, y: 105 }, { x: 195, y: 135 }] });
    }
  } else if (type === "car") {
    if (step === 0) {
      strokes.push({ color: "#1E1E24", width: 5, points: [{ x: 240, y: 380 }, { x: 240, y: 320 }, { x: 330, y: 320 }, { x: 380, y: 230 }, { x: 480, y: 230 }, { x: 530, y: 320 }, { x: 580, y: 320 }, { x: 580, y: 380 }, { x: 240, y: 380 }] });
    } else if (step === 1) {
      // Wheels
      const w1 = [], w2 = [];
      for (let i = 0; i <= 20; i++) {
        const a = (i * 18 * Math.PI) / 180;
        w1.push({ x: 310 + 35 * Math.cos(a), y: 385 + 35 * Math.sin(a) });
        w2.push({ x: 510 + 35 * Math.cos(a), y: 385 + 35 * Math.sin(a) });
      }
      strokes.push({ color: "#1E1E24", width: 6, points: w1 });
      strokes.push({ color: "#1E1E24", width: 6, points: w2 });
      strokes.push({ color: "#FFE600", width: 5, points: [{ x: 310, y: 385 }, { x: 312, y: 385 }] });
      strokes.push({ color: "#FFE600", width: 5, points: [{ x: 510, y: 385 }, { x: 512, y: 385 }] });
    } else if (step === 2) {
      // Windows
      strokes.push({ color: "#35A7FF", width: 4, points: [{ x: 340, y: 315 }, { x: 380, y: 245 }, { x: 425, y: 245 }, { x: 425, y: 315 }, { x: 340, y: 315 }] });
      strokes.push({ color: "#35A7FF", width: 4, points: [{ x: 435, y: 245 }, { x: 475, y: 245 }, { x: 515, y: 315 }, { x: 435, y: 315 }, { x: 435, y: 245 }] });
    } else if (step === 3) {
      // Headlight & Door Handle
      strokes.push({ color: "#FFE600", width: 6, points: [{ x: 580, y: 340 }, { x: 585, y: 340 }] });
      strokes.push({ color: "#FFE600", width: 3, points: [{ x: 585, y: 330 }, { x: 650, y: 320 }] });
      strokes.push({ color: "#FFE600", width: 3, points: [{ x: 585, y: 350 }, { x: 650, y: 360 }] });
      strokes.push({ color: "#1E1E24", width: 4, points: [{ x: 395, y: 335 }, { x: 415, y: 335 }] });
    } else if (step === 4) {
      // Road line and speed lines
      strokes.push({ color: "#1E1E24", width: 4, points: [{ x: 160, y: 425 }, { x: 680, y: 425 }] });
      strokes.push({ color: "#35A7FF", width: 3, points: [{ x: 170, y: 310 }, { x: 210, y: 310 }] });
      strokes.push({ color: "#35A7FF", width: 3, points: [{ x: 190, y: 340 }, { x: 225, y: 340 }] });
    }
  } else if (type === "tree") {
    if (step === 0) {
      strokes.push({ color: "#1E1E24", width: 7, points: [{ x: 370, y: 460 }, { x: 375, y: 300 }, { x: 425, y: 300 }, { x: 430, y: 460 }] });
    } else if (step === 1) {
      // Foliage cloud canopy
      const f = [];
      const cx = 400, cy = 230;
      for (let i = 0; i <= 36; i++) {
        const a = (i * 10 * Math.PI) / 180;
        const r = 110 + 15 * Math.sin(a * 6);
        f.push({ x: cx + r * Math.cos(a), y: cy + r * Math.sin(a) });
      }
      strokes.push({ color: "#38B000", width: 6, points: f });
    } else if (step === 2) {
      // Inner branches
      strokes.push({ color: "#1E1E24", width: 4, points: [{ x: 400, y: 300 }, { x: 350, y: 220 }] });
      strokes.push({ color: "#1E1E24", width: 4, points: [{ x: 400, y: 280 }, { x: 450, y: 210 }] });
    } else if (step === 3) {
      // Apples on tree
      strokes.push({ color: "#FF5964", width: 8, points: [{ x: 340, y: 200 }, { x: 345, y: 200 }] });
      strokes.push({ color: "#FF5964", width: 8, points: [{ x: 440, y: 190 }, { x: 445, y: 190 }] });
      strokes.push({ color: "#FF5964", width: 8, points: [{ x: 390, y: 160 }, { x: 395, y: 160 }] });
      strokes.push({ color: "#FF5964", width: 8, points: [{ x: 410, y: 240 }, { x: 415, y: 240 }] });
    } else if (step === 4) {
      // Grass ground
      strokes.push({ color: "#38B000", width: 5, points: [{ x: 300, y: 460 }, { x: 310, y: 440 }, { x: 320, y: 460 }, { x: 480, y: 460 }, { x: 490, y: 440 }, { x: 500, y: 460 }] });
    }
  } else if (type === "sun") {
    if (step === 0) {
      const sunPts = [];
      for (let i = 0; i <= 36; i++) {
        const a = (i * 10 * Math.PI) / 180;
        sunPts.push({ x: 400 + 80 * Math.cos(a), y: 280 + 80 * Math.sin(a) });
      }
      strokes.push({ color: "#FFE600", width: 6, points: sunPts });
    } else if (step === 1) {
      // Sun rays
      for (let i = 0; i < 8; i++) {
        const a = (i * 45 * Math.PI) / 180;
        strokes.push({
          color: "#FF5964", width: 5,
          points: [{ x: 400 + 95 * Math.cos(a), y: 280 + 95 * Math.sin(a) }, { x: 400 + 135 * Math.cos(a), y: 280 + 135 * Math.sin(a) }]
        });
      }
    } else if (step === 2) {
      // Cool Sunglasses
      strokes.push({ color: "#1E1E24", width: 6, points: [{ x: 345, y: 270 }, { x: 390, y: 270 }, { x: 385, y: 295 }, { x: 350, y: 295 }, { x: 345, y: 270 }] });
      strokes.push({ color: "#1E1E24", width: 6, points: [{ x: 410, y: 270 }, { x: 455, y: 270 }, { x: 450, y: 295 }, { x: 415, y: 295 }, { x: 410, y: 270 }] });
      strokes.push({ color: "#1E1E24", width: 4, points: [{ x: 390, y: 275 }, { x: 410, y: 275 }] });
    } else if (step === 3) {
      // Smiley mouth
      const mouth = [];
      for (let i = 0; i <= 10; i++) {
        const a = Math.PI * 0.2 + (i * Math.PI * 0.6) / 10;
        mouth.push({ x: 400 + 35 * Math.cos(a), y: 280 + 30 * Math.sin(a) });
      }
      strokes.push({ color: "#FF5964", width: 4, points: mouth });
    } else if (step === 4) {
      // Fluffy cloud
      strokes.push({ color: "#35A7FF", width: 4, points: [{ x: 220, y: 380 }, { x: 250, y: 350 }, { x: 300, y: 350 }, { x: 330, y: 380 }, { x: 220, y: 380 }] });
    }
  } else if (type === "fish") {
    if (step === 0) {
      strokes.push({ color: "#1E1E24", width: 5, points: [{ x: 240, y: 300 }, { x: 340, y: 210 }, { x: 480, y: 260 }, { x: 550, y: 200 }, { x: 530, y: 300 }, { x: 550, y: 400 }, { x: 480, y: 340 }, { x: 340, y: 390 }, { x: 240, y: 300 }] });
    } else if (step === 1) {
      // Fins
      strokes.push({ color: "#35A7FF", width: 4, points: [{ x: 370, y: 225 }, { x: 400, y: 165 }, { x: 430, y: 245 }] });
      strokes.push({ color: "#35A7FF", width: 4, points: [{ x: 370, y: 375 }, { x: 400, y: 435 }, { x: 430, y: 355 }] });
    } else if (step === 2) {
      // Eye & Smile
      strokes.push({ color: "#1E1E24", width: 6, points: [{ x: 290, y: 275 }, { x: 295, y: 275 }] });
      strokes.push({ color: "#FF5964", width: 4, points: [{ x: 245, y: 305 }, { x: 265, y: 315 }] });
    } else if (step === 3) {
      // Scales
      strokes.push({ color: "#35A7FF", width: 3, points: [{ x: 360, y: 260 }, { x: 380, y: 280 }, { x: 360, y: 300 }] });
      strokes.push({ color: "#35A7FF", width: 3, points: [{ x: 410, y: 270 }, { x: 430, y: 290 }, { x: 410, y: 310 }] });
      strokes.push({ color: "#35A7FF", width: 3, points: [{ x: 360, y: 310 }, { x: 380, y: 330 }, { x: 360, y: 350 }] });
    } else if (step === 4) {
      // Bubbles
      strokes.push({ color: "#35A7FF", width: 4, points: [{ x: 190, y: 250 }, { x: 195, y: 250 }] });
      strokes.push({ color: "#35A7FF", width: 5, points: [{ x: 170, y: 200 }, { x: 175, y: 200 }] });
      strokes.push({ color: "#35A7FF", width: 6, points: [{ x: 150, y: 140 }, { x: 156, y: 140 }] });
    }
  } else if (type === "icecream") {
    if (step === 0) {
      // Waffle cone
      strokes.push({ color: "#1E1E24", width: 5, points: [{ x: 330, y: 270 }, { x: 470, y: 270 }, { x: 400, y: 470 }, { x: 330, y: 270 }] });
    } else if (step === 1) {
      // Scoop 1
      const s1 = [];
      for (let i = 0; i <= 20; i++) {
        const a = (i * 18 * Math.PI) / 180;
        s1.push({ x: 400 + 75 * Math.cos(a), y: 220 + 65 * Math.sin(a) });
      }
      strokes.push({ color: "#FF5964", width: 5, points: s1 });
    } else if (step === 2) {
      // Scoop 2 (top)
      const s2 = [];
      for (let i = 0; i <= 20; i++) {
        const a = (i * 18 * Math.PI) / 180;
        s2.push({ x: 400 + 55 * Math.cos(a), y: 150 + 50 * Math.sin(a) });
      }
      strokes.push({ color: "#FFE600", width: 5, points: s2 });
    } else if (step === 3) {
      // Cherry with stem
      strokes.push({ color: "#FF5964", width: 8, points: [{ x: 400, y: 95 }, { x: 405, y: 95 }] });
      strokes.push({ color: "#38B000", width: 3, points: [{ x: 402, y: 90 }, { x: 415, y: 65 }] });
    } else if (step === 4) {
      // Sprinkles & Cone crosshatch
      strokes.push({ color: "#35A7FF", width: 4, points: [{ x: 375, y: 140 }, { x: 390, y: 145 }] });
      strokes.push({ color: "#38B000", width: 4, points: [{ x: 415, y: 140 }, { x: 430, y: 145 }] });
      strokes.push({ color: "#1E1E24", width: 2, points: [{ x: 350, y: 300 }, { x: 430, y: 400 }] });
      strokes.push({ color: "#1E1E24", width: 2, points: [{ x: 450, y: 300 }, { x: 370, y: 400 }] });
    }
  } else if (type === "boat") {
    if (step === 0) {
      strokes.push({ color: "#1E1E24", width: 5, points: [{ x: 240, y: 360 }, { x: 560, y: 360 }, { x: 490, y: 440 }, { x: 310, y: 440 }, { x: 240, y: 360 }] });
    } else if (step === 1) {
      // Mast
      strokes.push({ color: "#1E1E24", width: 6, points: [{ x: 400, y: 360 }, { x: 400, y: 140 }] });
    } else if (step === 2) {
      // Mainsail
      strokes.push({ color: "#FF5964", width: 5, points: [{ x: 405, y: 160 }, { x: 405, y: 335 }, { x: 535, y: 335 }, { x: 405, y: 160 }] });
    } else if (step === 3) {
      // Jib sail & Flag
      strokes.push({ color: "#35A7FF", width: 5, points: [{ x: 395, y: 180 }, { x: 395, y: 335 }, { x: 285, y: 335 }, { x: 395, y: 180 }] });
      strokes.push({ color: "#FFE600", width: 4, points: [{ x: 400, y: 140 }, { x: 430, y: 150 }, { x: 400, y: 160 }] });
    } else if (step === 4) {
      // Ocean Waves
      strokes.push({ color: "#35A7FF", width: 4, points: [{ x: 180, y: 455 }, { x: 230, y: 440 }, { x: 280, y: 455 }, { x: 330, y: 440 }, { x: 380, y: 455 }, { x: 430, y: 440 }, { x: 480, y: 455 }, { x: 530, y: 440 }, { x: 580, y: 455 }, { x: 630, y: 440 }] });
    }
  } else if (type === "chart") {
    if (step === 0) {
      // Screen/Chart Frame
      strokes.push({ color: "#1E1E24", width: 5, points: [{ x: 220, y: 140 }, { x: 580, y: 140 }, { x: 580, y: 420 }, { x: 220, y: 420 }, { x: 220, y: 140 }] });
    } else if (step === 1) {
      // Network nodes (layers)
      const nodes = [{ x: 280, y: 220 }, { x: 280, y: 320 }, { x: 400, y: 190 }, { x: 400, y: 280 }, { x: 400, y: 370 }, { x: 520, y: 240 }, { x: 520, y: 340 }];
      for (const pt of nodes) {
        strokes.push({ color: "#35A7FF", width: 8, points: [{ x: pt.x, y: pt.y }, { x: pt.x + 2, y: pt.y }] });
      }
    } else if (step === 2) {
      // Synaptic connections
      strokes.push({ color: "#FFE600", width: 2, points: [{ x: 280, y: 220 }, { x: 400, y: 190 }, { x: 520, y: 240 }] });
      strokes.push({ color: "#FFE600", width: 2, points: [{ x: 280, y: 220 }, { x: 400, y: 280 }, { x: 520, y: 340 }] });
      strokes.push({ color: "#FFE600", width: 2, points: [{ x: 280, y: 320 }, { x: 400, y: 280 }, { x: 520, y: 240 }] });
      strokes.push({ color: "#FFE600", width: 2, points: [{ x: 280, y: 320 }, { x: 400, y: 370 }, { x: 520, y: 340 }] });
    } else if (step === 3) {
      // Performance bar chart
      strokes.push({ color: "#FF5964", width: 6, points: [{ x: 260, y: 400 }, { x: 260, y: 350 }] });
      strokes.push({ color: "#FFE600", width: 6, points: [{ x: 300, y: 400 }, { x: 300, y: 310 }] });
      strokes.push({ color: "#38B000", width: 6, points: [{ x: 340, y: 400 }, { x: 340, y: 260 }] });
    } else if (step === 4) {
      // Lightbulb sparkle
      strokes.push({ color: "#FFE600", width: 5, points: [{ x: 400, y: 100 }, { x: 400, y: 70 }] });
      strokes.push({ color: "#FFE600", width: 5, points: [{ x: 375, y: 90 }, { x: 425, y: 90 }] });
    }
  } else {
    // Cat / Dog fallback
    if (step === 0) {
      const pts = [];
      for (let i = 0; i <= 36; i++) {
        const a = (i * 10 * Math.PI) / 180;
        pts.push({ x: 400 + 110 * Math.cos(a), y: 300 + 110 * Math.sin(a) });
      }
      strokes.push({ color: "#1E1E24", width: 5, points: pts });
    } else if (step === 1) {
      strokes.push({ color: "#1E1E24", width: 6, points: [{ x: 360, y: 265 }, { x: 365, y: 265 }] });
      strokes.push({ color: "#1E1E24", width: 6, points: [{ x: 440, y: 265 }, { x: 445, y: 265 }] });
      strokes.push({ color: "#1E1E24", width: 5, points: [{ x: 310, y: 210 }, { x: 300, y: 130 }, { x: 360, y: 190 }] });
      strokes.push({ color: "#1E1E24", width: 5, points: [{ x: 490, y: 210 }, { x: 500, y: 130 }, { x: 440, y: 190 }] });
    } else if (step === 2) {
      strokes.push({ color: "#FF5964", width: 6, points: [{ x: 395, y: 295 }, { x: 405, y: 295 }, { x: 400, y: 305 }, { x: 395, y: 295 }] });
      strokes.push({ color: "#1E1E24", width: 4, points: [{ x: 400, y: 305 }, { x: 385, y: 325 }, { x: 370, y: 320 }] });
      strokes.push({ color: "#1E1E24", width: 4, points: [{ x: 400, y: 305 }, { x: 415, y: 325 }, { x: 430, y: 320 }] });
    } else if (step === 3) {
      strokes.push({ color: "#1E1E24", width: 3, points: [{ x: 350, y: 300 }, { x: 270, y: 290 }] });
      strokes.push({ color: "#1E1E24", width: 3, points: [{ x: 350, y: 310 }, { x: 270, y: 320 }] });
      strokes.push({ color: "#1E1E24", width: 3, points: [{ x: 450, y: 300 }, { x: 530, y: 290 }] });
      strokes.push({ color: "#1E1E24", width: 3, points: [{ x: 450, y: 310 }, { x: 530, y: 320 }] });
    } else if (step === 4) {
      strokes.push({ color: "#FFE600", width: 4, points: [{ x: 220, y: 140 }, { x: 240, y: 140 }, { x: 230, y: 125 }, { x: 230, y: 155 }] });
      strokes.push({ color: "#35A7FF", width: 4, points: [{ x: 570, y: 140 }, { x: 590, y: 140 }, { x: 580, y: 125 }, { x: 580, y: 155 }] });
    }
  }
  return strokes;
}

function blankState() {
  return {
    initialized: false, code: "", hostId: "", mode: "study", selectionTime: 20,
    reviewTime: 5, drawTime: 120, totalRounds: 3, currentRound: 1,
    phase: "LOBBY", players: {}, playerOrder: [], drawerIndex: 0, drawerId: null,
    currentWord: "", wordOptions: [], revealed: [], strokes: [], currentSlideIndex: 0,
    usedSlides: [], totalSlides: 0, pdfName: "ML Lecture Slides", deadline: 0,
    hintBroadcasted: false, studyPairs: [], classicCategory: "general", usedClassicWords: [],
    hasBot: false, botDoodleStep: 0, botGuessedRound: false
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
  connectedIds() {
    const set = new Set(this.sockets().map(ws => this.socketPlayer(ws)).filter(Boolean));
    if (this.room?.hasBot && this.room?.players?.["bot_ai"]) set.add("bot_ai");
    return set;
  }

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
      code: this.room.code, mode: this.room.mode, classic_category: this.room.classicCategory || "general",
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
          classicCategory: body.classic_category && CLASSIC_CATEGORIES[body.classic_category] ? body.classic_category : "general",
          drawTime: Math.max(30, Math.min(180, Number(body.draw_time) || 120)),
          totalRounds: Math.max(1, Math.min(10, Number(body.total_rounds) || 3)) });
        await this.replaceSlides(body.slides, "ML Lecture Slides");
      }
      return json({ ok: true });
    }
    if (!this.room.initialized) return json({ detail: "Room not found" }, 404);
    if (url.pathname === "/info") return json({ code: this.room.code, state: this.room.phase,
      player_count: this.connectedIds().size, host_id: this.room.hostId, draw_time: this.room.drawTime,
      total_rounds: this.room.totalRounds, total_slides: this.room.totalSlides, pdf_name: this.room.pdfName,
      classic_category: this.room.classicCategory || "general" });
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
    else if (type === "add_bot" && playerId === this.room.hostId && this.room.phase === "LOBBY") {
      this.room.hasBot = true;
      this.room.players["bot_ai"] = {
        id: "bot_ai", name: "🤖 Professor Paws", avatar: "cat", score: 0,
        is_host: false, is_drawing: false, has_guessed: false, connected: true
      };
      if (!this.room.playerOrder.includes("bot_ai")) this.room.playerOrder.push("bot_ai");
      await this.save();
      this.broadcast({ type: "player_joined", player: this.room.players["bot_ai"], players: this.playersList() });
    } else if (type === "remove_bot" && playerId === this.room.hostId && this.room.phase === "LOBBY") {
      this.room.hasBot = false;
      delete this.room.players["bot_ai"];
      this.room.playerOrder = this.room.playerOrder.filter(id => id !== "bot_ai");
      await this.save();
      this.broadcast({ type: "player_left", player_id: "bot_ai", players: this.playersList() });
    } else if (type === "update_settings" && playerId === this.room.hostId && this.room.phase === "LOBBY") {
      this.room.mode = ["classic","study"].includes(data.mode) ? data.mode : "study";
      if (data.classic_category && CLASSIC_CATEGORIES[data.classic_category]) this.room.classicCategory = data.classic_category;
      this.room.drawTime = Math.max(30, Math.min(180, Number(data.draw_time) || 120));
      this.room.totalRounds = Math.max(1, Math.min(10, Number(data.total_rounds) || 3));
      this.broadcast({ type: "settings_updated", mode: this.room.mode, classic_category: this.room.classicCategory, draw_time: this.room.drawTime, total_rounds: this.room.totalRounds });
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
      const online = [...this.connectedIds()].filter(id => id !== playerId && id !== "bot_ai");
      if (online[0]) { this.room.hostId = online[0]; for (const p of Object.values(this.room.players)) p.is_host = p.id === online[0]; }
    }
    this.broadcast({ type: "player_left", player_id: playerId, players: this.playersList() });
    if (playerId === this.room.drawerId && ["WORD_SELECTION","DRAWING"].includes(this.room.phase)) await this.endRound("The drawer left — passing the turn");
    await this.save();
  }

  async returnToLobby() {
    Object.assign(this.room, { phase: "LOBBY", drawerId: null, currentWord: "", deadline: 0, strokes: [], currentRound: 1, botDoodleStep: 0, botGuessedRound: false });
    for (const p of Object.values(this.room.players)) { p.is_drawing = false; p.has_guessed = false; }
    await this.ctx.storage.deleteAlarm(); await this.save();
    for (const id of this.connectedIds()) {
      if (id !== "bot_ai") this.sendTo(id, { type: "room_state", state: await this.roomState(id) });
    }
  }

  async startGame(playerId) {
    if (playerId !== this.room.hostId || !["LOBBY","GAME_OVER"].includes(this.room.phase)) return;
    this.room.currentRound = 1; this.room.drawerIndex = 0; this.room.studyPairs = [];
    this.room.usedClassicWords = [];
    this.room.playerOrder = [...this.connectedIds()];
    for (const p of Object.values(this.room.players)) { p.score = 0; p.has_guessed = false; p.is_drawing = false; }
    await this.nextTurn();
  }

  async nextTurn() {
    const online = [...this.connectedIds()];
    if (!online.length) { this.room.phase = "LOBBY"; await this.save(); return; }
    for (const id of online) {
      if (!this.room.playerOrder.includes(id)) this.room.playerOrder.push(id);
    }
    this.room.playerOrder = this.room.playerOrder.filter(id => online.includes(id));
    if (!this.room.playerOrder.length) this.room.playerOrder = [...online];

    if (this.room.drawerIndex >= this.room.playerOrder.length) {
      this.room.drawerIndex = 0;
      this.room.currentRound++;
    }
    if (this.room.currentRound > this.room.totalRounds) return this.endGame();

    this.room.drawerId = this.room.playerOrder[this.room.drawerIndex++];
    for (const p of Object.values(this.room.players)) { p.has_guessed = false; p.is_drawing = p.id === this.room.drawerId; }
    Object.assign(this.room, { strokes: [], currentWord: "", revealed: [], hintBroadcasted: false, phase: "WORD_SELECTION", botDoodleStep: 0, botGuessedRound: false });
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
    if (this.room.mode === "classic") {
      const cat = this.room.classicCategory || "general";
      const pool = CLASSIC_CATEGORIES[cat] || CLASSIC_CATEGORIES.general;
      if (!Array.isArray(this.room.usedClassicWords)) this.room.usedClassicWords = [];
      let available = pool.filter(w => !this.room.usedClassicWords.includes(w));
      if (available.length < 3) {
        this.room.usedClassicWords = [];
        available = [...pool];
      }
      this.room.wordOptions = sample(available, 3);
    } else {
      this.room.wordOptions = [];
    }
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
    if (this.room.mode === "classic") {
      if (!Array.isArray(this.room.usedClassicWords)) this.room.usedClassicWords = [];
      if (!this.room.usedClassicWords.includes(match)) this.room.usedClassicWords.push(match);
    }
    Object.assign(this.room, { currentWord: match, phase: "DRAWING", deadline: Date.now() + this.room.drawTime*1000, revealed: [], hintBroadcasted: false, botDoodleStep: 0, botGuessedRound: false });
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
      if (this.room.drawerId === "bot_ai" && left <= this.room.selectionTime - 1) {
        const slide = this.room.mode === "study" ? await this.getSlide() : null;
        let word = "Cat";
        if (this.room.mode === "classic" && this.room.wordOptions?.length) {
          word = this.room.wordOptions[Math.floor(Math.random() * this.room.wordOptions.length)];
        } else if (this.room.mode === "study" && slide?.word_boxes?.length) {
          word = slide.word_boxes[Math.floor(Math.random() * slide.word_boxes.length)].word;
        }
        await this.selectWord("bot_ai", word);
        await this.save();
        return;
      }
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

      // --- BOT LOGIC DURING DRAWING ---
      if (this.room.hasBot && this.room.players["bot_ai"]) {
        if (this.room.drawerId === "bot_ai") {
          const elapsed = this.room.drawTime - left;
          if (elapsed > 0 && elapsed % 3 === 0 && (this.room.botDoodleStep || 0) < 5) {
            const step = this.room.botDoodleStep || 0;
            const strokes = getBotDoodleStrokes(this.room.currentWord, step);
            for (const stroke of strokes) {
              this.room.strokes.push(stroke);
              this.broadcast({ type: "stroke_drawn", stroke });
            }
            this.room.botDoodleStep = step + 1;
          }
        } else {
          const botPlayer = this.room.players["bot_ai"];
          if (!botPlayer.has_guessed && !this.room.botGuessedRound) {
            const guessTime = Math.floor(this.room.drawTime * 0.45);
            const nudgeTime = Math.floor(this.room.drawTime * 0.70);
            if (left === nudgeTime) {
              this.broadcast({
                type: "chat_message",
                message: { sender_id: "bot_ai", sender_name: "🤖 Professor Paws", avatar: "cat", text: "Looking at your drawing... let me think! 🐾", is_system: false, is_correct: false }
              });
            } else if (left <= guessTime) {
              this.room.botGuessedRound = true;
              await this.guess("bot_ai", this.room.currentWord);
              await this.save();
              return;
            }
          }
        }
      }

      if (left <= 0) return this.endRound("Time's Up!");
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
        mode: form.get("mode") || "study", classic_category: form.get("classic_category") || "general",
        draw_time:Number(form.get("draw_time"))||120, total_rounds:Number(form.get("total_rounds"))||3, slides };
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
