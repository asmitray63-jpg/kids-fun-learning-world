(() => {
  "use strict";

  const bankCache = new Map();

  const letters = [
    ["A", "Apple", "🍎"], ["B", "Ball", "⚽"], ["C", "Cat", "🐱"], ["D", "Dog", "🐶"],
    ["E", "Elephant", "🐘"], ["F", "Fish", "🐟"], ["G", "Grapes", "🍇"], ["H", "Hat", "🎩"],
    ["I", "Ice cream", "🍦"], ["J", "Juice", "🧃"], ["K", "Kite", "🪁"], ["L", "Lion", "🦁"],
    ["M", "Moon", "🌙"], ["N", "Nest", "🪺"], ["O", "Orange", "🍊"], ["P", "Parrot", "🦜"],
    ["Q", "Queen", "👑"], ["R", "Rainbow", "🌈"], ["S", "Sun", "☀️"], ["T", "Tree", "🌳"],
    ["U", "Umbrella", "☂️"], ["V", "Van", "🚐"], ["W", "Water", "💧"], ["X", "Xylophone", "🎹"],
    ["Y", "Yo-yo", "🪀"], ["Z", "Zebra", "🦓"]
  ];

  const data = {
    Animals: [
      ["Dog", "🐶", "woof"], ["Cat", "🐱", "meow"], ["Cow", "🐮", "moo"], ["Horse", "🐴", "neigh"],
      ["Goat", "🐐", "bleat"], ["Sheep", "🐑", "baa"], ["Pig", "🐷", "oink"], ["Rabbit", "🐰", "soft hop"],
      ["Monkey", "🐵", "chatter"], ["Bear", "🐻", "growl"], ["Deer", "🦌", "gentle call"], ["Panda", "🐼", "munch"]
    ],
    Birds: [
      ["Parrot", "🦜"], ["Duck", "🦆"], ["Owl", "🦉"], ["Peacock", "🦚"], ["Eagle", "🦅"], ["Swan", "🦢"],
      ["Penguin", "🐧"], ["Chicken", "🐔"], ["Rooster", "🐓"], ["Turkey", "🦃"], ["Dove", "🕊️"], ["Flamingo", "🦩"]
    ],
    Fruits: [
      ["Apple", "🍎"], ["Banana", "🍌"], ["Grapes", "🍇"], ["Orange", "🍊"], ["Mango", "🥭"], ["Strawberry", "🍓"],
      ["Watermelon", "🍉"], ["Pineapple", "🍍"], ["Cherry", "🍒"], ["Kiwi", "🥝"], ["Pear", "🍐"], ["Peach", "🍑"]
    ],
    Vegetables: [
      ["Carrot", "🥕"], ["Tomato", "🍅"], ["Potato", "🥔"], ["Corn", "🌽"], ["Broccoli", "🥦"], ["Cucumber", "🥒"],
      ["Onion", "🧅"], ["Garlic", "🧄"], ["Peas", "🫛"], ["Lettuce", "🥬"], ["Mushroom", "🍄"], ["Eggplant", "🍆"]
    ],
    Vehicles: [
      ["Car", "🚗"], ["Bus", "🚌"], ["Train", "🚆"], ["Bicycle", "🚲"], ["Motorcycle", "🏍️"], ["Airplane", "✈️"],
      ["Boat", "⛵"], ["Ship", "🚢"], ["Truck", "🚚"], ["Taxi", "🚕"], ["Tractor", "🚜"], ["Rocket", "🚀"]
    ],
    Colors: [
      ["Red", "🔴"], ["Blue", "🔵"], ["Yellow", "🟡"], ["Green", "🟢"], ["Orange", "🟠"], ["Purple", "🟣"],
      ["Black", "⚫"], ["White", "⚪"], ["Brown", "🟤"], ["Pink", "🌸"], ["Gray", "⬜"], ["Gold", "⭐"]
    ],
    Shapes: [
      ["Circle", "●"], ["Square", "■"], ["Triangle", "▲"], ["Rectangle", "▭"], ["Diamond", "◆"], ["Star", "★"],
      ["Heart", "♥"], ["Oval", "⬭"], ["Pentagon", "⬟"], ["Hexagon", "⬢"], ["Arrow", "→"], ["Crescent", "☾"]
    ],
    "Body Parts": [
      ["Eye", "👁️"], ["Ear", "👂"], ["Nose", "👃"], ["Mouth", "👄"], ["Hand", "✋"], ["Foot", "🦶"],
      ["Arm", "💪"], ["Leg", "🦵"], ["Head", "🙂"], ["Tooth", "🦷"], ["Tongue", "👅"], ["Finger", "☝️"]
    ],
    Professions: [
      ["Doctor", "🧑‍⚕️"], ["Teacher", "🧑‍🏫"], ["Farmer", "🧑‍🌾"], ["Police officer", "👮"], ["Firefighter", "🧑‍🚒"], ["Chef", "🧑‍🍳"],
      ["Artist", "🧑‍🎨"], ["Scientist", "🧑‍🔬"], ["Pilot", "🧑‍✈️"], ["Mechanic", "🧑‍🔧"], ["Astronaut", "🧑‍🚀"], ["Builder", "👷"]
    ],
    Nature: [
      ["Tree", "🌳"], ["Flower", "🌼"], ["River", "🏞️"], ["Mountain", "⛰️"], ["Sun", "☀️"], ["Moon", "🌙"],
      ["Star", "⭐"], ["Cloud", "☁️"], ["Rain", "🌧️"], ["Leaf", "🍃"], ["Rock", "🪨"], ["Fire", "🔥"]
    ],
    "School Objects": [
      ["Book", "📘"], ["Pencil", "✏️"], ["Bag", "🎒"], ["Ruler", "📏"], ["Notebook", "📓"], ["Crayon", "🖍️"],
      ["Eraser", "⬜"], ["Desk", "🪑"], ["Bell", "🔔"], ["Globe", "🌐"], ["Scissors", "✂️"], ["Calculator", "🧮"]
    ],
    "Daily Objects": [
      ["Cup", "☕"], ["Plate", "🍽️"], ["Spoon", "🥄"], ["Chair", "🪑"], ["Bed", "🛏️"], ["Clock", "⏰"],
      ["Phone", "📱"], ["Key", "🔑"], ["Door", "🚪"], ["Lamp", "💡"], ["Soap", "🧼"], ["Brush", "🪥"]
    ],
    "Good Habits": [
      ["Brush teeth", "🪥"], ["Wash hands", "🧼"], ["Eat healthy", "🥗"], ["Say thank you", "🙏"], ["Share toys", "🧸"], ["Read daily", "📚"],
      ["Sleep on time", "🛏️"], ["Drink water", "💧"], ["Help parents", "🤝"], ["Keep clean", "✨"], ["Be kind", "💛"], ["Exercise", "🏃"]
    ],
    Transport: [
      ["Road transport", "🚗"], ["Rail transport", "🚆"], ["Air transport", "✈️"], ["Water transport", "🚢"],
      ["Public bus", "🚌"], ["Emergency vehicle", "🚑"], ["School bus", "🚌"], ["Metro", "🚇"]
    ],
    "Wild Animals": [
      ["Lion", "🦁"], ["Tiger", "🐯"], ["Elephant", "🐘"], ["Zebra", "🦓"], ["Giraffe", "🦒"], ["Kangaroo", "🦘"],
      ["Crocodile", "🐊"], ["Rhinoceros", "🦏"], ["Gorilla", "🦍"], ["Leopard", "🐆"], ["Wolf", "🐺"], ["Fox", "🦊"]
    ],
    "Farm Animals": [
      ["Cow", "🐮"], ["Goat", "🐐"], ["Sheep", "🐑"], ["Horse", "🐴"], ["Pig", "🐷"], ["Chicken", "🐔"],
      ["Duck", "🦆"], ["Donkey", "🐴"], ["Turkey", "🦃"], ["Rabbit", "🐰"], ["Dog", "🐶"], ["Cat", "🐱"]
    ],
    "Sea Animals": [
      ["Fish", "🐟"], ["Dolphin", "🐬"], ["Whale", "🐋"], ["Octopus", "🐙"], ["Crab", "🦀"], ["Turtle", "🐢"],
      ["Shark", "🦈"], ["Seal", "🦭"], ["Lobster", "🦞"], ["Jellyfish", "🪼"], ["Starfish", "⭐"], ["Seahorse", "🐠"]
    ],
    Space: [
      ["Sun", "☀️"], ["Moon", "🌙"], ["Earth", "🌍"], ["Mars", "🔴"], ["Rocket", "🚀"], ["Star", "⭐"],
      ["Planet", "🪐"], ["Astronaut", "🧑‍🚀"], ["Telescope", "🔭"], ["Galaxy", "🌌"], ["Comet", "☄️"], ["Satellite", "🛰️"]
    ],
    Weather: [
      ["Sunny", "☀️"], ["Rainy", "🌧️"], ["Cloudy", "☁️"], ["Windy", "🌬️"], ["Snowy", "❄️"], ["Stormy", "⛈️"],
      ["Rainbow", "🌈"], ["Hot", "🔥"], ["Cold", "🥶"], ["Foggy", "🌫️"], ["Lightning", "⚡"], ["Drizzle", "🌦️"]
    ]
  };

  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  const opposites = [["Hot", "Cold"], ["Big", "Small"], ["Up", "Down"], ["Day", "Night"], ["Fast", "Slow"], ["Happy", "Sad"], ["Open", "Close"], ["In", "Out"], ["Tall", "Short"], ["Full", "Empty"], ["Near", "Far"], ["Wet", "Dry"]];
  const rhymes = [["Cat", "Hat", "Bat", "Mat"], ["Sun", "Fun", "Run", "Bun"], ["Ball", "Tall", "Wall", "Call"], ["Cake", "Lake", "Snake", "Make"], ["Moon", "Spoon", "Tune", "June"], ["Star", "Car", "Jar", "Far"], ["Book", "Look", "Cook", "Hook"], ["Bee", "Tree", "Free", "See"]];
  const vocabulary = [
    ["Home", "🏠"], ["Family", "👪"], ["Friend", "🙂"], ["Water", "💧"], ["Food", "🍲"], ["Toy", "🧸"], ["Smile", "😊"], ["Play", "🎮"],
    ["Sleep", "😴"], ["Read", "📖"], ["Write", "✍️"], ["Dance", "💃"], ["Music", "🎵"], ["Garden", "🌻"], ["Market", "🛒"], ["Room", "🚪"],
    ["Window", "🪟"], ["Bottle", "🍶"], ["Lunch", "🍱"], ["Breakfast", "🥣"], ["Story", "📚"], ["Game", "🎲"], ["Gift", "🎁"], ["Light", "💡"]
  ];

  const aliases = {
    alphabet: "Alphabet",
    letters: "Alphabet",
    numbers: "Numbers",
    math: "Numbers",
    spelling: "Basic English Vocabulary",
    vocabulary: "Basic English Vocabulary",
    words: "Basic English Vocabulary",
    gk: "General Knowledge",
    logic: "Logic",
    brain: "Brain Challenge",
    picture: "Picture Quiz",
    animals: "Animals",
    birds: "Birds",
    fruits: "Fruits",
    vegetables: "Vegetables",
    vehicles: "Vehicles",
    colors: "Colors",
    shapes: "Shapes",
    body: "Body Parts",
    professions: "Professions",
    nature: "Nature",
    school: "School Objects",
    daily: "Daily Objects",
    habits: "Good Habits",
    transport: "Transport",
    wild: "Wild Animals",
    farm: "Farm Animals",
    sea: "Sea Animals",
    space: "Space",
    weather: "Weather",
    months: "Months",
    days: "Days",
    opposites: "Opposites",
    rhyming: "Rhyming Words"
  };

  function shuffle(values) {
    const copy = values.slice();
    for (let index = copy.length - 1; index > 0; index -= 1) {
      const swap = Math.floor(Math.random() * (index + 1));
      [copy[index], copy[swap]] = [copy[swap], copy[index]];
    }
    return copy;
  }

  function unique(values) {
    return Array.from(new Set(values.filter((value) => value !== undefined && value !== null && value !== ""))).map(String);
  }

  function options(answer, pool) {
    const wrong = shuffle(unique(pool).filter((item) => String(item) !== String(answer))).slice(0, 3);
    return shuffle(unique([String(answer), ...wrong]).slice(0, 4));
  }

  function add(bank, category, id, prompt, answer, pool, extra = {}) {
    bank.push({
      id: `${category}:${id}`,
      category,
      prompt,
      promptHi: extra.promptHi || prompt,
      answer: String(answer),
      options: options(answer, pool),
      caption: extra.caption || category,
      speak: extra.speak || prompt,
      hiSpeak: extra.hiSpeak || extra.promptHi || prompt,
      visual: extra.visual || "",
      difficulty: extra.difficulty || 1
    });
  }

  function wordsFrom(text) {
    return text.split(",").map((item) => item.trim()).filter(Boolean);
  }

  const productionWordSets = {
    Animals: wordsFrom("Dog,Cat,Cow,Horse,Goat,Sheep,Pig,Rabbit,Monkey,Bear,Deer,Panda,Lion,Tiger,Elephant,Zebra,Giraffe,Kangaroo,Crocodile,Rhinoceros,Gorilla,Leopard,Wolf,Fox,Hippopotamus,Camel,Donkey,Buffalo,Yak,Moose,Otter,Beaver,Squirrel,Hamster,Guinea pig,Hedgehog,Bat,Koala,Sloth,Antelope,Cheetah,Hyena,Jaguar,Lemur,Meerkat,Porcupine,Raccoon,Skunk,Walrus,Seal,Dolphin,Whale,Shark,Octopus,Crab,Turtle,Lobster,Jellyfish,Seahorse,Starfish,Clownfish,Goldfish,Eel,Squid,Stingray,Sea lion,Polar bear,Arctic fox,Penguin,Flamingo,Parrot,Eagle,Owl,Duck,Chicken,Turkey,Peacock,Swan,Sparrow,Crow,Goose,Woodpecker,Hummingbird,Kingfisher,Ostrich,Emu,Frog,Toad,Lizard,Snake,Tortoise,Chameleon,Gecko,Iguana,Alligator,Salamander,Butterfly,Bee,Ant,Ladybug,Grasshopper,Cricket,Dragonfly,Firefly,Beetle,Spider,Snail,Worm,Centipede,Mosquito,Fly,Moth"),
    Birds: wordsFrom("Parrot,Duck,Owl,Peacock,Eagle,Swan,Penguin,Chicken,Rooster,Turkey,Dove,Flamingo,Sparrow,Crow,Raven,Pigeon,Goose,Woodpecker,Hummingbird,Kingfisher,Ostrich,Emu,Kiwi,Robin,Blue jay,Cardinal,Canary,Finch,Seagull,Albatross,Pelican,Crane,Stork,Heron,Ibis,Swallow,Swift,Magpie,Cuckoo,Hawk,Falcon,Vulture,Kite,Buzzard,Condor,Macaw,Cockatoo,Lovebird,Parakeet,Hornbill,Toucan,Quail,Pheasant,Peafowl,Guinea fowl,Partridge,Nightingale,Lark,Wren,Warbler,Oriole,Starling,Myna,Drongo,Sunbird,Weaver,Bulbul,Thrush,Mockingbird,Flycatcher,Egret,Bittern,Avocet,Puffin,Gannet,Cormorant,Frigatebird,Booby,Skimmer,Sandpiper,Plovers,Coot,Moorhen,Grebe,Loon,Jacana,Spoonbill,Secretary bird,Roadrunner,Cassowary,Bustard,Bee-eater,Roller,Hoopoe,Barbet,Coucal,Tern,Noddy,Petrel,Shearwater,Storm petrel"),
    Fruits: wordsFrom("Apple,Banana,Grapes,Orange,Mango,Strawberry,Watermelon,Pineapple,Cherry,Kiwi,Pear,Peach,Papaya,Guava,Pomegranate,Lemon,Lime,Coconut,Plum,Apricot,Fig,Date,Lychee,Dragon fruit,Passion fruit,Blueberry,Raspberry,Blackberry,Cranberry,Cantaloupe,Honeydew,Jackfruit,Durian,Star fruit,Persimmon,Avocado,Custard apple,Sapodilla,Mulberry,Gooseberry,Tangerine,Clementine,Grapefruit,Pomelo,Nectarine,Quince,Elderberry,Boysenberry,Currant,Soursop,Rambutan,Longan,Mangosteen,Breadfruit,Plantain,Olive,Ugli fruit,Tamarind,Jujube,Bael,Amla,Jamun,Salak,Feijoa,Loquat,Medlar,Miracle fruit,Ackee,Acerola,Physalis,Cloudberry,Huckleberry,Marionberry,Loganberry,Jabuticaba,Buddha hand,Yuzu,Calamansi,Blood orange,Mandarin,Kinnow,Sweet lime,Rose apple,Wax apple,Wood apple,Elephant apple,Santol,Langsat,Nance,Pawpaw,Bilberry,Black sapote,White sapote,Horned melon,Pepino,Cupuacu,Cherimoya,Mamey sapote,Surinam cherry,Sea buckthorn"),
    Vegetables: wordsFrom("Carrot,Tomato,Potato,Corn,Broccoli,Cucumber,Onion,Garlic,Peas,Lettuce,Mushroom,Eggplant,Spinach,Cabbage,Cauliflower,Radish,Beetroot,Turnip,Pumpkin,Squash,Zucchini,Okra,Bell pepper,Chili pepper,Green bean,Asparagus,Celery,Leek,Artichoke,Brussels sprout,Kale,Swiss chard,Arugula,Mustard greens,Collard greens,Bok choy,Watercress,Parsley,Coriander,Mint,Basil,Dill,Fennel,Ginger,Turmeric,Sweet potato,Yam,Taro,Cassava,Lotus root,Bamboo shoot,Bean sprout,Snow pea,Snap pea,Lima bean,Black bean,Kidney bean,Chickpea,Lentil,Edamame,Drumstick,Bitter gourd,Bottle gourd,Ridge gourd,Snake gourd,Ash gourd,Ivy gourd,Pointed gourd,Cluster bean,Spring onion,Shallot,Red cabbage,Napa cabbage,Endive,Escarole,Radicchio,Chicory,Kohlrabi,Rutabaga,Parsnip,Horseradish,Daikon,Water chestnut,Seaweed,Nori,Kelp,Plantain flower,Banana stem,Curry leaf,Fenugreek leaf,Amaranth,Moringa leaf,Malabar spinach,Rhubarb,Chayote,Jicama,Salsify,Samphire,Fiddlehead,Jerusalem artichoke"),
    Vehicles: wordsFrom("Car,Bus,Truck,Bicycle,Motorcycle,Airplane,Boat,Ship,Taxi,Tractor,Rocket,Metro,Scooter,Van,Jeep,Ambulance,Fire truck,Police car,Bulldozer,Crane,Excavator,Dump truck,Garbage truck,Delivery van,Helicopter,Hot air balloon,Submarine,Ferry,Speedboat,Sailboat,Kayak,Canoe,Skateboard,Roller skates,Train,Tram,Monorail,Space shuttle,Segway,Auto rickshaw,Snowmobile,Jet ski,Formula car,Tow truck,Concrete mixer,Forklift,Wheelbarrow,Cart"),
    Professions: wordsFrom("Doctor,Teacher,Farmer,Police officer,Firefighter,Chef,Artist,Scientist,Pilot,Mechanic,Astronaut,Builder,Engineer,Programmer,Dentist,Nurse,Veterinarian,Driver,Carpenter,Electrician,Plumber,Architect,Writer,Musician,Dancer,Actor,Photographer,Journalist,Librarian,Coach,Shopkeeper,Baker,Barber,Tailor,Gardener,Postman,Soldier,Judge,Lawyer,Accountant,Designer,Animator,Researcher,Paramedic,Security guard,Waiter,Receptionist,Translator,Mayor,Principal"),
    "Good Habits": wordsFrom("Brush teeth,Wash hands,Eat healthy,Say thank you,Share toys,Read daily,Sleep on time,Drink water,Help parents,Keep clean,Be kind,Exercise,Save water,Save electricity,Respect parents,Respect teachers,Speak politely,Wait your turn,Use dustbin,Cover mouth,Finish homework,Pack school bag,Listen carefully,Walk safely,Wear seat belt,Wash fruits,Keep books neat,Plant trees,Feed pets gently,Play fairly,Use kind words,Keep promises,Ask permission,Share food,Help friends,Keep room clean,Use quiet voice,Take care of toys,Recycle paper,Turn off tap,Turn off lights")
  };

  const vocabularyGroups = {
    Family: wordsFrom("mother,father,parent,brother,sister,baby,grandmother,grandfather,cousin,aunt,uncle,family,home,love,care,help,smile,hug,share,kind"),
    School: wordsFrom("school,teacher,student,class,desk,chair,book,pencil,eraser,ruler,notebook,bag,crayon,lesson,homework,library,board,bell,globe,scissors"),
    Food: wordsFrom("rice,bread,milk,water,juice,soup,salad,egg,cheese,fruit,vegetable,lunch,dinner,breakfast,snack,plate,cup,spoon,fork,bowl"),
    Nature: wordsFrom("sun,moon,star,sky,cloud,rain,river,mountain,tree,flower,leaf,grass,soil,rock,wind,snow,forest,garden,beach,planet"),
    Clothes: wordsFrom("shirt,pants,dress,skirt,socks,shoes,hat,cap,coat,jacket,gloves,scarf,belt,uniform,pajamas,sweater,shorts,slippers,boots,raincoat"),
    Home: wordsFrom("room,door,window,bed,table,chair,sofa,lamp,fan,clock,mirror,curtain,mat,pillow,blanket,shelf,drawer,basket,wall,roof"),
    Kitchen: wordsFrom("kitchen,stove,oven,pan,pot,knife,spoon,fork,plate,bowl,cup,bottle,glass,fridge,sink,soap,towel,apron,ladle,tray"),
    Bathroom: wordsFrom("bathroom,soap,towel,brush,toothbrush,toothpaste,shampoo,bucket,mug,tap,mirror,comb,water,clean,wash,bath,shower,soapbox,sponge,napkin"),
    Verbs: wordsFrom("run,jump,walk,read,write,draw,sing,dance,play,eat,drink,sleep,wake,listen,look,open,close,carry,catch,throw"),
    Adjectives: wordsFrom("big,small,tall,short,hot,cold,fast,slow,happy,sad,clean,dirty,wet,dry,soft,hard,light,heavy,near,far"),
    Time: wordsFrom("morning,afternoon,evening,night,today,tomorrow,yesterday,hour,minute,second,clock,watch,day,week,month,year,early,late,noon,midnight"),
    Space: wordsFrom("sun,moon,earth,planet,star,rocket,astronaut,galaxy,comet,asteroid,telescope,orbit,space,sky,mars,venus,jupiter,saturn,meteor,satellite")
  };

  const productionIcons = {
    Animals: "🐾",
    Birds: "🪽",
    Fruits: "🍎",
    Vegetables: "🥕",
    Vehicles: "🚗",
    Professions: "🧑",
    "Good Habits": "⭐"
  };

  function addProductionExpansion(bank) {
    const categories = Object.keys(productionWordSets);
    Object.entries(productionWordSets).forEach(([category, words]) => {
      const cleanWords = unique(words);
      const icon = productionIcons[category] || "⭐";
      cleanWords.forEach((word, index) => {
        const firstLetter = word[0].toUpperCase();
        const difficulty = index > 70 ? 3 : index > 30 ? 2 : 1;
        add(bank, category, `prod-name-${index}`, `Which ${category.toLowerCase()} name matches ${icon}?`, word, cleanWords, { caption: `${category} library`, speak: `Find ${word}`, visual: icon, difficulty });
        add(bank, category, `prod-letter-${index}`, `What is the first letter of ${word}?`, firstLetter, letters.map((item) => item[0]), { caption: "Beginning letter", speak: `What is the first letter of ${word}?`, visual: word, difficulty: Math.max(1, difficulty - 1) });
        add(bank, category, `prod-group-${index}`, `${word} belongs to which group?`, category, categories, { caption: "Category sorting", speak: `${word} belongs to which group?`, visual: word, difficulty: 2 });
        add(bank, "General Knowledge", `prod-${category}-${index}`, `What kind of thing is ${word}?`, category, categories, { caption: "General knowledge", speak: `What kind of thing is ${word}?`, visual: word, difficulty: 2 });
      });
    });

    Object.entries(vocabularyGroups).forEach(([group, words]) => {
      const cleanWords = unique(words);
      cleanWords.forEach((word, index) => {
        const firstLetter = word[0].toUpperCase();
        add(bank, "Basic English Vocabulary", `prod-${group}-word-${index}`, `Choose the ${group.toLowerCase()} word`, word, cleanWords, { caption: `${group} vocabulary`, speak: `Choose ${word}`, visual: group, difficulty: index > 12 ? 2 : 1 });
        add(bank, "Basic English Vocabulary", `prod-${group}-group-${index}`, `${word} belongs to which vocabulary group?`, group, Object.keys(vocabularyGroups), { caption: "Vocabulary sorting", speak: `${word} belongs to which group?`, visual: word, difficulty: 2 });
        add(bank, "Basic English Vocabulary", `prod-${group}-letter-${index}`, `What letter starts ${word}?`, firstLetter, letters.map((item) => item[0]), { caption: "Beginning sound", speak: `What letter starts ${word}?`, visual: word, difficulty: 1 });
      });
    });

    for (let a = 1; a <= 30; a += 1) {
      for (let b = 1; b <= 10; b += 1) {
        add(bank, "Numbers", `prod-multiply-${a}-${b}`, `${a} × ${b} = ?`, a * b, [a * b, a * b + a, Math.max(1, a * b - b), a + b], { caption: "Multiplication", difficulty: a > 12 ? 4 : 3 });
        if ((a * b) % b === 0) add(bank, "Numbers", `prod-divide-${a}-${b}`, `${a * b} ÷ ${b} = ?`, a, [a, a + 1, Math.max(1, a - 1), b], { caption: "Division", difficulty: a > 12 ? 4 : 3 });
      }
    }
  }

  function buildBank() {
    if (bankCache.has("all")) return bankCache.get("all");
    const bank = [];

    letters.forEach(([letter, word, icon], index) => {
      add(bank, "Alphabet", `for-${letter}`, `${icon} is for ___`, letter, letters.map((item) => item[0]), { caption: "Alphabet", speak: `${icon} is for ${word}`, visual: icon, difficulty: 1 });
      add(bank, "Alphabet", `word-${letter}`, `Which word starts with ${letter}?`, word, letters.map((item) => item[1]), { caption: "Beginning sound", visual: letter, difficulty: 1 });
      if (index < letters.length - 1) add(bank, "Alphabet", `after-${letter}`, `What comes after ${letter}?`, letters[index + 1][0], letters.map((item) => item[0]), { caption: "Letter order", difficulty: 2 });
      if (index > 0) add(bank, "Alphabet", `before-${letter}`, `What comes before ${letter}?`, letters[index - 1][0], letters.map((item) => item[0]), { caption: "Letter order", difficulty: 2 });
    });

    const numberPool = Array.from({ length: 120 }, (_, index) => String(index + 1));
    for (let n = 1; n <= 100; n += 1) {
      add(bank, "Numbers", `read-${n}`, `Which number is ${n}?`, n, [n, n + 1, Math.max(1, n - 1), n + 10], { caption: "Number recognition", difficulty: n > 30 ? 2 : 1 });
      if (n < 100) add(bank, "Numbers", `after-${n}`, `What comes after ${n}?`, n + 1, [n + 1, n + 2, n, Math.max(1, n - 1)], { caption: "Number order", difficulty: n > 50 ? 3 : 1 });
      if (n > 1) add(bank, "Numbers", `before-${n}`, `What comes before ${n}?`, n - 1, [n - 1, n, n + 1, Math.max(1, n - 2)], { caption: "Number order", difficulty: n > 50 ? 3 : 1 });
    }
    for (let a = 1; a <= 20; a += 1) {
      for (let b = 1; b <= 5; b += 1) {
        add(bank, "Numbers", `add-${a}-${b}`, `${a} + ${b} = ?`, a + b, [a + b, a + b + 1, Math.max(1, a + b - 1), a + b + 2], { caption: "Addition", difficulty: a > 10 ? 3 : 2 });
      }
    }
    for (let a = 6; a <= 30; a += 1) {
      const b = 1 + (a % 5);
      add(bank, "Numbers", `sub-${a}-${b}`, `${a} - ${b} = ?`, a - b, [a - b, a - b + 1, Math.max(1, a - b - 1), a - b + 2], { caption: "Subtraction", difficulty: a > 15 ? 3 : 2 });
    }

    Object.entries(data).forEach(([category, items]) => {
      const names = items.map((item) => item[0]);
      const icons = items.map((item) => item[1]);
      items.forEach(([name, icon, sound], index) => {
        add(bank, category, `name-${index}`, `What is this? ${icon}`, name, names, { caption: category, speak: `What is this ${name}?`, visual: icon, difficulty: 1 });
        add(bank, category, `icon-${index}`, `Which picture shows ${name}?`, icon, icons, { caption: category, speak: `Find ${name}`, visual: name, difficulty: 1 });
        if (sound) add(bank, category, `sound-${index}`, `Which animal says ${sound}?`, name, names, { caption: "Animal sounds", speak: `${sound}. Which animal is it?`, visual: "🔊", difficulty: 2 });
      });
    });

    months.forEach((month, index) => {
      add(bank, "Months", `month-${index}`, `Which month number is ${month}?`, index + 1, numberPool, { caption: "Months", difficulty: 3 });
      add(bank, "Months", `after-${index}`, `Which month comes after ${month}?`, months[(index + 1) % months.length], months, { caption: "Months", difficulty: 3 });
    });

    days.forEach((day, index) => {
      add(bank, "Days", `day-${index}`, `Which day comes after ${day}?`, days[(index + 1) % days.length], days, { caption: "Days", difficulty: 2 });
      add(bank, "Days", `before-${index}`, `Which day comes before ${day}?`, days[(index + days.length - 1) % days.length], days, { caption: "Days", difficulty: 2 });
    });

    opposites.forEach(([first, second], index) => {
      const pool = opposites.flat();
      add(bank, "Opposites", `a-${index}`, `Opposite of ${first}`, second, pool, { caption: "Opposites", difficulty: 2 });
      add(bank, "Opposites", `b-${index}`, `Opposite of ${second}`, first, pool, { caption: "Opposites", difficulty: 2 });
    });

    rhymes.forEach((group, groupIndex) => {
      group.forEach((word, index) => {
        add(bank, "Rhyming Words", `${groupIndex}-${index}`, `Which word rhymes with ${word}?`, group[(index + 1) % group.length], rhymes.flat(), { caption: "Rhyming words", difficulty: 3 });
      });
    });

    vocabulary.forEach(([word, icon], index) => {
      const names = vocabulary.map((item) => item[0]);
      const icons = vocabulary.map((item) => item[1]);
      add(bank, "Basic English Vocabulary", `word-${index}`, `What is this? ${icon}`, word, names, { caption: "Vocabulary", visual: icon, difficulty: 1 });
      add(bank, "Basic English Vocabulary", `picture-${index}`, `Which picture means ${word}?`, icon, icons, { caption: "Vocabulary", visual: word, difficulty: 2 });
    });

    const generalCategories = ["Animals", "Birds", "Fruits", "Vegetables", "Vehicles", "Colors", "Shapes", "Body Parts", "Professions", "Nature", "School Objects", "Daily Objects", "Good Habits", "Transport", "Wild Animals", "Farm Animals", "Sea Animals", "Space", "Weather", "Months", "Days", "Opposites"];
    generalCategories.forEach((category, index) => {
      add(bank, "General Knowledge", `category-${index}`, `Which topic includes ${category}?`, category, generalCategories, { caption: "General knowledge", difficulty: 2 });
    });

    ["Numbers", "Alphabet", "Colors", "Shapes", "Opposites", "Rhyming Words"].forEach((category, index) => {
      add(bank, "Logic", `logic-${index}`, `Choose the learning topic: ${category}`, category, ["Numbers", "Alphabet", "Colors", "Shapes", "Opposites", "Rhyming Words", "Space", "Weather"], { caption: "Logic", difficulty: 2 });
    });

    const sequenceQuestions = [
      ["1, 2, 3, 4, ?", "5", ["4", "5", "6", "7"], 1],
      ["2, 4, 6, 8, ?", "10", ["9", "10", "11", "12"], 2],
      ["5, 10, 15, 20, ?", "25", ["22", "24", "25", "30"], 2],
      ["A, B, C, D, ?", "E", ["D", "E", "F", "G"], 1],
      ["M, N, O, P, ?", "Q", ["P", "Q", "R", "S"], 2],
      ["Red, Blue, Red, Blue, ?", "Red", ["Red", "Blue", "Green", "Yellow"], 1],
      ["Circle, Square, Circle, Square, ?", "Circle", ["Circle", "Square", "Star", "Triangle"], 1],
      ["Small, Big, Small, Big, ?", "Small", ["Small", "Big", "Tall", "Short"], 1]
    ];
    sequenceQuestions.forEach(([prompt, answer, pool, difficulty], index) => {
      add(bank, "Logic", `sequence-${index}`, prompt, answer, pool, { caption: "Pattern logic", difficulty });
    });

    const comparisonQuestions = [
      ["Which is bigger: 8 or 3?", "8", ["8", "3", "1", "5"], 1],
      ["Which is smaller: 2 or 9?", "2", ["2", "9", "7", "5"], 1],
      ["Which is heavier?", "Elephant", ["Elephant", "Pencil", "Leaf", "Feather"], 2],
      ["Which can fly?", "Bird", ["Bird", "Chair", "Shoe", "Book"], 1],
      ["Which belongs in school?", "Pencil", ["Pencil", "Spoon", "Bed", "Plate"], 1],
      ["Which belongs in space?", "Rocket", ["Rocket", "Cup", "Carrot", "Shoe"], 2],
      ["Which is a fruit?", "Mango", ["Mango", "Carrot", "Bus", "Table"], 1],
      ["Which is a vehicle?", "Bus", ["Bus", "Apple", "Tree", "Book"], 1],
      ["Which is a shape?", "Triangle", ["Triangle", "Monday", "Tiger", "Rain"], 1],
      ["Which comes first in a day?", "Morning", ["Morning", "Night", "Lunch", "Sleep"], 2]
    ];
    comparisonQuestions.forEach(([prompt, answer, pool, difficulty], index) => {
      add(bank, "Logic", `compare-${index}`, prompt, answer, pool, { caption: "Think and choose", difficulty });
    });

    const gkQuestions = [
      ["How many days are in a week?", "7", ["5", "6", "7", "8"], 1],
      ["Which planet do we live on?", "Earth", ["Earth", "Mars", "Moon", "Sun"], 2],
      ["Which animal gives us milk?", "Cow", ["Cow", "Lion", "Fish", "Tiger"], 1],
      ["Which object tells time?", "Clock", ["Clock", "Spoon", "Bag", "Ball"], 1],
      ["Which season is very hot?", "Summer", ["Summer", "Winter", "Rainy", "Spring"], 2],
      ["Which light do we see at night?", "Moon", ["Moon", "Book", "Bus", "Cup"], 1],
      ["What do plants need?", "Water", ["Water", "Shoes", "Crayon", "Pillow"], 1],
      ["Which person teaches in school?", "Teacher", ["Teacher", "Chef", "Pilot", "Farmer"], 1],
      ["Which vehicle runs on rails?", "Train", ["Train", "Boat", "Bicycle", "Taxi"], 2],
      ["Which meal is eaten in the morning?", "Breakfast", ["Breakfast", "Dinner", "Snack", "Dessert"], 2]
    ];
    gkQuestions.forEach(([prompt, answer, pool, difficulty], index) => {
      add(bank, "General Knowledge", `fact-${index}`, prompt, answer, pool, { caption: "General knowledge", difficulty });
    });

    addProductionExpansion(bank);

    bank.forEach((question, index) => {
      if (!question.id.endsWith(`:${index}`)) question.sortIndex = index;
    });
    bankCache.set("all", bank);
    return bank;
  }

  function normalizeCategory(category) {
    if (!category) return "General Knowledge";
    const raw = String(category).trim();
    return aliases[raw.toLowerCase()] || raw;
  }

  function getBank(category) {
    const all = buildBank();
    const normalized = normalizeCategory(category);
    if (normalized === "Mega Quiz" || normalized === "All") return all;
    if (normalized === "Picture Quiz") {
      return all.filter((question) => question.visual || question.prompt.includes("? "));
    }
    if (normalized === "Brain Challenge") {
      return all.filter((question) => ["Logic", "Numbers", "Opposites", "Rhyming Words", "General Knowledge"].includes(question.category));
    }
    const filtered = all.filter((question) => question.category === normalized);
    return filtered.length ? filtered : all.filter((question) => question.category === "General Knowledge");
  }

  function next(category, progress = {}, context = {}) {
    const normalized = normalizeCategory(category);
    const bank = getBank(normalized);
    progress.quizEngine = progress.quizEngine || {};
    progress.quizEngine.seen = progress.quizEngine.seen || {};
    progress.quizEngine.cycles = progress.quizEngine.cycles || {};
    const key = normalized.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    const seen = new Set(progress.quizEngine.seen[key] || []);
    let unseen = bank.filter((question) => !seen.has(question.id));
    if (!unseen.length) {
      progress.quizEngine.seen[key] = [];
      progress.quizEngine.cycles[key] = (progress.quizEngine.cycles[key] || 0) + 1;
      unseen = bank.slice();
    }

    const completedRatio = (bank.length - unseen.length) / Math.max(1, bank.length);
    const targetDifficulty = Math.min(4, Math.max(1, Math.ceil(completedRatio * 4)));
    const suitable = unseen.filter((question) => question.difficulty <= targetDifficulty + 1);
    const pool = suitable.length ? suitable : unseen;
    const question = shuffle(pool)[0];
    progress.quizEngine.seen[key] = unique([...(progress.quizEngine.seen[key] || []), question.id]);

    return {
      ...question,
      options: shuffle(question.options),
      bankSize: bank.length,
      remaining: Math.max(0, bank.length - progress.quizEngine.seen[key].length),
      cycle: progress.quizEngine.cycles[key] || 0,
      age: context.age || ""
    };
  }

  function stats(category, progress = {}) {
    const normalized = normalizeCategory(category);
    const key = normalized.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    const bank = getBank(normalized);
    const seen = progress.quizEngine?.seen?.[key]?.length || 0;
    return { category: normalized, bankSize: bank.length, seen, remaining: Math.max(0, bank.length - seen) };
  }

  window.KidsQuizEngine = {
    next,
    stats,
    size: () => buildBank().length,
    categories: () => Array.from(new Set(buildBank().map((question) => question.category))).sort()
  };
})();
