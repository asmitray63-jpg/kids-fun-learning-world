(() => {
  "use strict";

  const STORAGE_KEY = "kids_fun_learning_world_progress_v1";
  const app = document.getElementById("app");
  const todayKey = () => new Date().toISOString().slice(0, 10);
  const hasNative = () => typeof window.AndroidBridge !== "undefined";

  const defaultProgress = {
    stars: 0,
    coins: 0,
    score: 0,
    level: 1,
    learningTaps: 0,
    completed: {},
    badges: {},
    achievements: {},
    drawings: [],
    daily: {
      lastReward: "",
      lastChallenge: "",
      streak: 0
    },
    stats: {
      sessions: 0,
      gamesPlayed: 0,
      quizzesAnswered: 0,
      correctAnswers: 0,
      timeSpentSeconds: 0,
      strongAreas: {},
      weakAreas: {},
      lastSessionAt: ""
    },
    quizEngine: {
      seen: {},
      cycles: {}
    },
    settings: {
      age: "4-6",
      lang: "en",
      muted: false,
      music: false
    }
  };

  const i18n = {
    en: {
      brand: "Kids Fun Learning World",
      subtitle: "Learn, play, smile",
      homeIntro: "Pick a colorful world made for tiny taps, curious minds, and happy practice.",
      stars: "Stars",
      coins: "Coins",
      score: "Score",
      level: "Level",
      achievements: "Achievements",
      gamesPlayed: "Games played",
      quizAccuracy: "Quiz accuracy",
      strongAreas: "Strong areas",
      weakAreas: "Needs practice",
      timeSpent: "Time spent",
      learn: "Learn",
      play: "Play",
      quiz: "Quiz",
      rewards: "Rewards",
      parent: "Parent",
      settings: "Settings",
      daily: "Daily",
      dailyChallenge: "Daily Challenge",
      chooseAge: "Choose age",
      listen: "Listen",
      start: "Start",
      back: "Back",
      great: "Great job!",
      winText: "You collected new stars.",
      parentCheck: "Parent Check",
      parentLocked: "Answer this quick grown-up question.",
      progressSaved: "Progress saved",
      cloudReady: "Cloud ready",
      offlineReady: "Offline ready",
      mute: "Mute sounds",
      music: "Music",
      language: "Language",
      reset: "Reset progress",
      export: "Progress export",
      rewardReady: "Daily reward ready",
      rewardClaimed: "Daily reward claimed",
      claim: "Claim",
      challengeDone: "Daily challenge done",
      drawDone: "Done",
      brush: "Brush",
      clear: "Clear",
      saveDrawing: "Save drawing",
      cloudSync: "Sync cloud",
      yes: "Yes",
      no: "No"
    },
    hi: {
      brand: "किड्स फन लर्निंग वर्ल्ड",
      subtitle: "सीखो, खेलो, मुस्कुराओ",
      homeIntro: "छोटे हाथों, नई जिज्ञासा और खुश सीखने के लिए रंगीन दुनिया।",
      stars: "सितारे",
      coins: "कॉइन्स",
      score: "स्कोर",
      level: "लेवल",
      achievements: "उपलब्धियाँ",
      gamesPlayed: "खेले गए गेम",
      quizAccuracy: "क्विज़ सटीकता",
      strongAreas: "मजबूत क्षेत्र",
      weakAreas: "अभ्यास चाहिए",
      timeSpent: "सीखने का समय",
      learn: "सीखें",
      play: "खेलें",
      quiz: "क्विज",
      rewards: "इनाम",
      parent: "पेरेंट",
      settings: "सेटिंग",
      daily: "डेली",
      dailyChallenge: "डेली चैलेंज",
      chooseAge: "उम्र चुनें",
      listen: "सुनें",
      start: "शुरू",
      back: "वापस",
      great: "बहुत बढ़िया!",
      winText: "आपने नए सितारे जीते।",
      parentCheck: "पेरेंट चेक",
      parentLocked: "यह छोटा सा बड़ा सवाल हल करें।",
      progressSaved: "प्रगति सेव हुई",
      cloudReady: "क्लाउड तैयार",
      offlineReady: "ऑफलाइन तैयार",
      mute: "आवाज़ बंद",
      music: "संगीत",
      language: "भाषा",
      reset: "प्रगति रीसेट",
      export: "प्रगति एक्सपोर्ट",
      rewardReady: "डेली इनाम तैयार",
      rewardClaimed: "डेली इनाम मिल गया",
      claim: "लें",
      challengeDone: "डेली चैलेंज पूरा",
      drawDone: "पूरा",
      brush: "ब्रश",
      clear: "साफ",
      saveDrawing: "ड्राइंग सेव",
      cloudSync: "क्लाउड सिंक",
      yes: "हाँ",
      no: "नहीं"
    }
  };

  const ages = [
    { id: "1-3", label: "1-3", detail: { en: "Tiny learners", hi: "नन्हे बच्चे" } },
    { id: "4-6", label: "4-6", detail: { en: "Early explorers", hi: "छोटे खोजी" } },
    { id: "7-8", label: "7-8", detail: { en: "Bright thinkers", hi: "तेज़ दिमाग" } }
  ];

  const navItems = [
    { id: "home", icon: "🏠", key: "brand" },
    { id: "learn", icon: "📚", key: "learn" },
    { id: "play", icon: "🎮", key: "play" },
    { id: "quiz", icon: "🧠", key: "quiz" },
    { id: "rewards", icon: "⭐", key: "rewards" },
    { id: "parent", icon: "🔒", key: "parent" },
    { id: "settings", icon: "⚙️", key: "settings" }
  ];

  const featureTiles = [
    { screen: "learn", icon: "🔤", key: "learn", desc: { en: "ABC, numbers, animals", hi: "ABC, गिनती, जानवर" }, tone: "sky" },
    { screen: "play", icon: "🎈", key: "play", desc: { en: "Balloons, memory, drawing", hi: "गुब्बारे, मेमोरी, ड्रॉइंग" }, tone: "berry" },
    { screen: "quiz", icon: "🧩", key: "quiz", desc: { en: "Math, spelling, logic", hi: "मैथ, स्पेलिंग, लॉजिक" }, tone: "leaf" },
    { screen: "rewards", icon: "🏆", key: "rewards", desc: { en: "Stars and badges", hi: "सितारे और बैज" }, tone: "sun" },
    { screen: "daily", icon: "🌞", key: "dailyChallenge", desc: { en: "Fresh reward every day", hi: "हर दिन नया इनाम" }, tone: "orange" },
    { screen: "parent", icon: "🛡️", key: "parent", desc: { en: "Progress and controls", hi: "प्रगति और कंट्रोल" }, tone: "grape" },
    { screen: "settings", icon: "🔊", key: "settings", desc: { en: "Language and sound", hi: "भाषा और आवाज़" }, tone: "sky" }
  ];

  const alphabet = [
    ["A", "Apple", "सेब", "🍎"], ["B", "Ball", "गेंद", "⚽"], ["C", "Cat", "बिल्ली", "🐱"],
    ["D", "Dog", "कुत्ता", "🐶"], ["E", "Elephant", "हाथी", "🐘"], ["F", "Fish", "मछली", "🐟"],
    ["G", "Grapes", "अंगूर", "🍇"], ["H", "Hat", "टोपी", "🎩"], ["I", "Ice cream", "आइसक्रीम", "🍦"],
    ["J", "Juice", "जूस", "🧃"], ["K", "Kite", "पतंग", "🪁"], ["L", "Lion", "शेर", "🦁"],
    ["M", "Moon", "चाँद", "🌙"], ["N", "Nest", "घोंसला", "🪺"], ["O", "Orange", "संतरा", "🍊"],
    ["P", "Parrot", "तोता", "🦜"], ["Q", "Queen", "रानी", "👑"], ["R", "Rainbow", "इंद्रधनुष", "🌈"],
    ["S", "Sun", "सूरज", "☀️"], ["T", "Tree", "पेड़", "🌳"], ["U", "Umbrella", "छाता", "☂️"],
    ["V", "Van", "वैन", "🚐"], ["W", "Water", "पानी", "💧"], ["X", "Xylophone", "ज़ाइलोफोन", "🎹"],
    ["Y", "Yo-yo", "यो-यो", "🪀"], ["Z", "Zebra", "ज़ेबरा", "🦓"]
  ];

  const learnCategories = [
    {
      id: "letters",
      ages: ["1-3", "4-6"],
      icon: "🔤",
      title: { en: "ABCD Learning", hi: "ABCD सीखें" },
      items: alphabet.map(([symbol, word, hi, icon]) => ({ symbol, word, hi, icon, speak: `${symbol} for ${word}`, hiSpeak: `${symbol}, ${hi}` }))
    },
    {
      id: "numbers",
      ages: ["1-3", "4-6"],
      icon: "🔢",
      title: { en: "Number Learning", hi: "गिनती" },
      items: Array.from({ length: 20 }, (_, index) => {
        const number = index + 1;
        const hindi = ["एक", "दो", "तीन", "चार", "पाँच", "छह", "सात", "आठ", "नौ", "दस", "ग्यारह", "बारह", "तेरह", "चौदह", "पंद्रह", "सोलह", "सत्रह", "अठारह", "उन्नीस", "बीस"][index];
        return { symbol: String(number), word: `${number}`, hi: hindi, icon: "⭐", speak: String(number), hiSpeak: hindi };
      })
    },
    {
      id: "animals",
      ages: ["1-3", "4-6"],
      icon: "🐾",
      title: { en: "Animal Sounds", hi: "जानवरों की आवाज़" },
      items: [
        { symbol: "🐶", word: "Dog", hi: "कुत्ता", speak: "Dog says woof woof", hiSpeak: "कुत्ता भौं भौं करता है", sound: "dog" },
        { symbol: "🐱", word: "Cat", hi: "बिल्ली", speak: "Cat says meow", hiSpeak: "बिल्ली म्याऊँ करती है", sound: "cat" },
        { symbol: "🐮", word: "Cow", hi: "गाय", speak: "Cow says moo", hiSpeak: "गाय अम्बा करती है", sound: "cow" },
        { symbol: "🦁", word: "Lion", hi: "शेर", speak: "Lion roars", hiSpeak: "शेर दहाड़ता है", sound: "lion" },
        { symbol: "🐘", word: "Elephant", hi: "हाथी", speak: "Elephant trumpets", hiSpeak: "हाथी चिंघाड़ता है", sound: "elephant" },
        { symbol: "🐵", word: "Monkey", hi: "बंदर", speak: "Monkey chatters", hiSpeak: "बंदर उछलता है", sound: "monkey" }
      ]
    },
    {
      id: "fruits",
      ages: ["1-3", "4-6"],
      icon: "🍓",
      title: { en: "Fruit Identification", hi: "फल पहचानें" },
      items: [
        { symbol: "🍎", word: "Apple", hi: "सेब" }, { symbol: "🍌", word: "Banana", hi: "केला" },
        { symbol: "🍇", word: "Grapes", hi: "अंगूर" }, { symbol: "🍊", word: "Orange", hi: "संतरा" },
        { symbol: "🍓", word: "Strawberry", hi: "स्ट्रॉबेरी" }, { symbol: "🥭", word: "Mango", hi: "आम" }
      ]
    },
    {
      id: "colors",
      ages: ["1-3", "4-6"],
      icon: "🎨",
      title: { en: "Color Learning", hi: "रंग सीखें" },
      items: [
        { symbol: "●", word: "Red", hi: "लाल", bg: "#ff6b6b" },
        { symbol: "●", word: "Blue", hi: "नीला", bg: "#67d7ff" },
        { symbol: "●", word: "Yellow", hi: "पीला", bg: "#ffd166" },
        { symbol: "●", word: "Green", hi: "हरा", bg: "#64d66e" },
        { symbol: "●", word: "Purple", hi: "बैंगनी", bg: "#b197fc" },
        { symbol: "●", word: "Orange", hi: "नारंगी", bg: "#ff9f1c" }
      ]
    },
    {
      id: "shapes",
      ages: ["1-3", "4-6"],
      icon: "🔷",
      title: { en: "Shape Learning", hi: "आकार सीखें" },
      items: [
        { symbol: "●", word: "Circle", hi: "वृत्त" }, { symbol: "■", word: "Square", hi: "वर्ग" },
        { symbol: "▲", word: "Triangle", hi: "त्रिभुज" }, { symbol: "◆", word: "Diamond", hi: "हीरा" },
        { symbol: "★", word: "Star", hi: "सितारा" }, { symbol: "♥", word: "Heart", hi: "दिल" }
      ]
    },
    {
      id: "words",
      ages: ["4-6", "7-8"],
      icon: "🗣️",
      title: { en: "Basic English Words", hi: "सरल अंग्रेज़ी शब्द" },
      items: [
        { symbol: "🏠", word: "Home", hi: "घर" }, { symbol: "📘", word: "Book", hi: "किताब" },
        { symbol: "🌧️", word: "Rain", hi: "बारिश" }, { symbol: "🚗", word: "Car", hi: "गाड़ी" },
        { symbol: "🧸", word: "Toy", hi: "खिलौना" }, { symbol: "👪", word: "Family", hi: "परिवार" }
      ]
    }
  ];

  const activities = [
    { id: "balloon", group: "play", ages: ["4-6"], icon: "🎈", stars: 5, title: { en: "Balloon Pop", hi: "गुब्बारा पॉप" }, desc: { en: "Tap floating balloons", hi: "उड़ते गुब्बारे टैप करें" } },
    { id: "shapeMatch", group: "play", ages: ["4-6"], icon: "🔷", stars: 4, title: { en: "Shape Matching", hi: "आकार मिलाएँ" }, desc: { en: "Find the same shape", hi: "सही आकार ढूँढें" } },
    { id: "counting", group: "play", ages: ["4-6"], icon: "🍎", stars: 4, title: { en: "Number Counting", hi: "गिनती खेल" }, desc: { en: "Count cute objects", hi: "प्यारी चीज़ें गिनें" } },
    { id: "drawing", group: "play", ages: ["4-6", "7-8"], icon: "🖍️", stars: 3, title: { en: "Drawing Game", hi: "ड्रॉइंग खेल" }, desc: { en: "Draw and save art", hi: "चित्र बनाएँ और सेव करें" } },
    { id: "memory", group: "play", ages: ["4-6", "7-8"], icon: "🃏", stars: 5, title: { en: "Memory Game", hi: "मेमोरी खेल" }, desc: { en: "Match hidden pairs", hi: "छिपे जोड़े मिलाएँ" } },
    { id: "memoryMatch", group: "play", ages: ["4-6", "7-8"], icon: "🧠", stars: 5, title: { en: "Memory Match", hi: "मेमोरी मैच" }, desc: { en: "Flip and match pairs", hi: "कार्ड पलटें और जोड़े मिलाएँ" } },
    { id: "alphabetPuzzle", group: "play", ages: ["4-6"], icon: "🔤", stars: 5, title: { en: "Alphabet Puzzle", hi: "अल्फाबेट पज़ल" }, desc: { en: "Put letters in order", hi: "अक्षरों को क्रम में लगाएँ" } },
    { id: "numberPuzzle", group: "play", ages: ["4-6", "7-8"], icon: "🔢", stars: 5, title: { en: "Number Puzzle", hi: "नंबर पज़ल" }, desc: { en: "Order the numbers", hi: "नंबर सही क्रम में रखें" } },
    { id: "colorMatch", group: "play", ages: ["1-3", "4-6"], icon: "🎨", stars: 4, title: { en: "Color Match", hi: "कलर मैच" }, desc: { en: "Match color names", hi: "रंगों को मिलाएँ" } },
    { id: "fruitCatcher", group: "play", ages: ["4-6", "7-8"], icon: "🍓", stars: 5, title: { en: "Fruit Catcher", hi: "फ्रूट कैचर" }, desc: { en: "Catch falling fruits", hi: "गिरते फल पकड़ें" } },
    { id: "animalSoundGuess", group: "play", ages: ["1-3", "4-6"], icon: "🔊", stars: 4, title: { en: "Animal Sound Guess", hi: "जानवर आवाज़ पहचानें" }, desc: { en: "Hear and choose animal", hi: "सुनें और जानवर चुनें" } },
    { id: "shadowMatch", group: "play", ages: ["4-6"], icon: "🌑", stars: 4, title: { en: "Shadow Match", hi: "शैडो मैच" }, desc: { en: "Match shape shadows", hi: "छाया से आकार मिलाएँ" } },
    { id: "oddOneOut", group: "play", ages: ["4-6", "7-8"], icon: "🕵️", stars: 5, title: { en: "Odd One Out", hi: "अलग पहचानें" }, desc: { en: "Find the different item", hi: "अलग चीज़ ढूँढें" } },
    { id: "traceAlphabet", group: "play", ages: ["1-3", "4-6"], icon: "✍️", stars: 4, title: { en: "Trace Alphabet", hi: "अक्षर ट्रेस" }, desc: { en: "Trace big letters", hi: "बड़े अक्षर बनाइए" } },
    { id: "traceNumbers", group: "play", ages: ["1-3", "4-6"], icon: "🧮", stars: 4, title: { en: "Trace Numbers", hi: "नंबर ट्रेस" }, desc: { en: "Trace numbers", hi: "नंबर बनाइए" } },
    { id: "matchingGame", group: "play", ages: ["4-6"], icon: "🔗", stars: 5, title: { en: "Matching Game", hi: "मैचिंग गेम" }, desc: { en: "Match pictures to words", hi: "चित्र और शब्द मिलाएँ" } },
    { id: "pictureQuiz", group: "play", ages: ["1-3", "4-6"], icon: "🖼️", stars: 4, title: { en: "Picture Quiz", hi: "पिक्चर क्विज" }, desc: { en: "Choose the right picture", hi: "सही चित्र चुनें" } },
    { id: "letterHunt", group: "play", ages: ["4-6"], icon: "🔎", stars: 5, title: { en: "Letter Hunt", hi: "लेटर हंट" }, desc: { en: "Find hidden letters", hi: "छिपे अक्षर ढूँढें" } },
    { id: "wordBuilder", group: "play", ages: ["7-8"], icon: "🧱", stars: 6, title: { en: "Word Builder", hi: "वर्ड बिल्डर" }, desc: { en: "Build simple words", hi: "सरल शब्द बनाएँ" } },
    { id: "patternGame", group: "play", ages: ["4-6", "7-8"], icon: "🔁", stars: 5, title: { en: "Pattern Game", hi: "पैटर्न गेम" }, desc: { en: "Complete the pattern", hi: "पैटर्न पूरा करें" } },
    { id: "speedTap", group: "play", ages: ["7-8"], icon: "⚡", stars: 5, title: { en: "Speed Tap", hi: "स्पीड टैप" }, desc: { en: "Tap fast before time ends", hi: "समय से पहले तेज़ टैप" } },
    { id: "alphabetQuiz", group: "quiz", ages: ["4-6", "7-8"], icon: "🔤", stars: 6, title: { en: "Alphabet Quiz", hi: "अल्फाबेट क्विज" }, desc: { en: "No-repeat letter questions", hi: "बिना रिपीट अक्षर सवाल" } },
    { id: "numberQuiz", group: "quiz", ages: ["4-6", "7-8"], icon: "🔢", stars: 6, title: { en: "Number Quiz", hi: "नंबर क्विज" }, desc: { en: "Counting and number order", hi: "गिनती और नंबर क्रम" } },
    { id: "animalQuiz", group: "quiz", ages: ["4-6", "7-8"], icon: "🐾", stars: 6, title: { en: "Animal Quiz", hi: "एनिमल क्विज" }, desc: { en: "Animals, birds, sea life", hi: "जानवर, पक्षी, समुद्री जीवन" } },
    { id: "math", group: "quiz", ages: ["7-8"], icon: "➕", stars: 6, title: { en: "Math Quiz", hi: "मैथ क्विज" }, desc: { en: "Add and subtract", hi: "जोड़ और घटाना" } },
    { id: "spelling", group: "quiz", ages: ["7-8"], icon: "🔡", stars: 6, title: { en: "Spelling Game", hi: "स्पेलिंग गेम" }, desc: { en: "Choose missing letters", hi: "गुम अक्षर चुनें" } },
    { id: "vocabularyQuiz", group: "quiz", ages: ["7-8"], icon: "📚", stars: 6, title: { en: "Vocabulary Quiz", hi: "वोकैब क्विज" }, desc: { en: "Basic English words", hi: "सरल अंग्रेज़ी शब्द" } },
    { id: "gk", group: "quiz", ages: ["7-8"], icon: "🌍", stars: 6, title: { en: "GK Mini Quiz", hi: "जीके मिनी क्विज" }, desc: { en: "World facts", hi: "दुनिया की बातें" } },
    { id: "worldQuiz", group: "quiz", ages: ["7-8"], icon: "🪐", stars: 6, title: { en: "World Quiz", hi: "वर्ल्ड क्विज" }, desc: { en: "Nature, weather, space", hi: "प्रकृति, मौसम, स्पेस" } },
    { id: "habitsQuiz", group: "quiz", ages: ["4-6", "7-8"], icon: "💛", stars: 5, title: { en: "Good Habits Quiz", hi: "गुड हैबिट्स क्विज" }, desc: { en: "Kind daily habits", hi: "अच्छी रोज़ाना आदतें" } },
    { id: "logic", group: "quiz", ages: ["7-8"], icon: "🧩", stars: 6, title: { en: "Logic Challenge", hi: "लॉजिक चैलेंज" }, desc: { en: "Finish the pattern", hi: "पैटर्न पूरा करें" } },
    { id: "brain", group: "quiz", ages: ["7-8"], icon: "🧠", stars: 6, title: { en: "Brain Challenge", hi: "ब्रेन चैलेंज" }, desc: { en: "Think, tap, win", hi: "सोचें, टैप करें, जीतें" } },
    { id: "megaQuiz", group: "quiz", ages: ["7-8"], icon: "🏆", stars: 8, title: { en: "Mega Quiz Bank", hi: "मेगा क्विज बैंक" }, desc: { en: "3000+ no-repeat questions", hi: "3000+ बिना रिपीट सवाल" } }
  ];

  const rewardBadges = [
    { id: "starter", icon: "🌟", need: 5, title: { en: "Star Starter", hi: "स्टार स्टार्टर" } },
    { id: "reader", icon: "📚", need: 18, title: { en: "Little Reader", hi: "छोटा रीडर" } },
    { id: "artist", icon: "🎨", need: 32, title: { en: "Happy Artist", hi: "हैप्पी आर्टिस्ट" } },
    { id: "thinker", icon: "🧠", need: 50, title: { en: "Bright Thinker", hi: "ब्राइट थिंकर" } },
    { id: "champ", icon: "🏆", need: 75, title: { en: "Learning Champ", hi: "लर्निंग चैंप" } }
  ];

  const achievementBadges = [
    { id: "firstGame", icon: "🎮", title: { en: "First Game", hi: "पहला गेम" }, earned: (data) => totalCompleted(data.completed) >= 1 },
    { id: "quizExplorer", icon: "🧩", title: { en: "Quiz Explorer", hi: "क्विज़ एक्सप्लोरर" }, earned: (data) => data.stats.quizzesAnswered >= 20 },
    { id: "accuracyHero", icon: "🎯", title: { en: "Accuracy Hero", hi: "सटीकता हीरो" }, earned: (data) => data.stats.quizzesAnswered >= 20 && quizAccuracy(data) >= 80 },
    { id: "dailySpark", icon: "🔥", title: { en: "Daily Spark", hi: "डेली स्पार्क" }, earned: (data) => data.daily.streak >= 3 },
    { id: "coinCollector", icon: "🪙", title: { en: "Coin Collector", hi: "कॉइन कलेक्टर" }, earned: (data) => data.coins >= 150 },
    { id: "practicePro", icon: "⭐", title: { en: "Practice Pro", hi: "प्रैक्टिस प्रो" }, earned: (data) => data.stats.gamesPlayed >= 10 }
  ];

  let progress = loadInitialProgress();
  let state = {
    screen: "home",
    age: progress.settings.age || "4-6",
    learnCategory: "",
    parentUnlocked: false,
    activeGame: "",
    win: null,
    dailyMode: false,
    nativeStatus: {},
    mountedGame: "",
    gameStartedAt: 0
  };

  let audioContext = null;
  let musicTimer = 0;
  let cleanupFns = [];

  function clone(value) {
    return JSON.parse(JSON.stringify(value));
  }

  function isPlainObject(value) {
    return value && typeof value === "object" && !Array.isArray(value);
  }

  function deepMerge(target, source) {
    if (!isPlainObject(source)) return target;
    Object.keys(source).forEach((key) => {
      if (isPlainObject(source[key])) {
        target[key] = deepMerge(isPlainObject(target[key]) ? target[key] : {}, source[key]);
      } else if (Array.isArray(source[key])) {
        target[key] = source[key].slice();
      } else {
        target[key] = source[key];
      }
    });
    return target;
  }

  function loadInitialProgress() {
    const loaded = clone(defaultProgress);
    const local = safeJson(localStorage.getItem(STORAGE_KEY));
    deepMerge(loaded, local);

    if (hasNative()) {
      try {
        const nativeSaved = window.AndroidBridge.loadProgress();
        deepMerge(loaded, safeJson(nativeSaved));
      } catch (error) {
        console.warn("Native progress unavailable", error);
      }
    }

    loaded.level = Math.max(1, Math.floor(loaded.stars / 20) + 1);
    loaded.coins = Number(loaded.coins || 0);
    loaded.achievements = loaded.achievements || {};
    loaded.stats = deepMerge(clone(defaultProgress.stats), loaded.stats || {});
    loaded.stats.sessions = Number(loaded.stats.sessions || 0) + 1;
    loaded.stats.lastSessionAt = new Date().toISOString();
    return loaded;
  }

  function safeJson(raw) {
    if (!raw) return {};
    try {
      return JSON.parse(raw);
    } catch (error) {
      console.warn("Bad JSON ignored", error);
      return {};
    }
  }

  function saveProgress() {
    progress.level = Math.max(1, Math.floor(progress.stars / 20) + 1);
    const json = JSON.stringify(progress);
    localStorage.setItem(STORAGE_KEY, json);
    if (hasNative()) {
      try {
        state.nativeStatus = safeJson(window.AndroidBridge.saveProgress(json));
      } catch (error) {
        console.warn("Native save unavailable", error);
      }
    }
  }

  function t(key) {
    const lang = progress.settings.lang || "en";
    return (i18n[lang] && i18n[lang][key]) || i18n.en[key] || key;
  }

  function l10n(value) {
    if (typeof value === "string") return value;
    const lang = progress.settings.lang || "en";
    return value[lang] || value.en || "";
  }

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function shuffle(values) {
    const copy = values.slice();
    for (let index = copy.length - 1; index > 0; index -= 1) {
      const swap = Math.floor(Math.random() * (index + 1));
      [copy[index], copy[swap]] = [copy[swap], copy[index]];
    }
    return copy;
  }

  function randomFrom(values) {
    return values[Math.floor(Math.random() * values.length)];
  }

  function setText(id, value) {
    const node = document.getElementById(id);
    if (node) node.textContent = value;
  }

  function cleanupRuntime() {
    cleanupFns.forEach((fn) => fn());
    cleanupFns = [];
    state.mountedGame = "";
  }

  function addCleanup(fn) {
    cleanupFns.push(fn);
  }

  function totalCompleted(completed) {
    return Object.values(completed || {}).reduce((sum, value) => sum + Number(value || 0), 0);
  }

  function quizAccuracy(data = progress) {
    const answered = Number(data.stats?.quizzesAnswered || 0);
    if (!answered) return 0;
    return Math.round((Number(data.stats?.correctAnswers || 0) / answered) * 100);
  }

  function formatDuration(seconds) {
    const total = Math.max(0, Number(seconds || 0));
    const minutes = Math.floor(total / 60);
    if (minutes < 1) return `${total}s`;
    const hours = Math.floor(minutes / 60);
    const rest = minutes % 60;
    return hours ? `${hours}h ${rest}m` : `${minutes}m`;
  }

  function topAreas(map, fallback) {
    const entries = Object.entries(map || {})
      .sort((left, right) => Number(right[1]) - Number(left[1]))
      .slice(0, 3)
      .map(([name, count]) => `${name} (${count})`);
    return entries.length ? entries.join(", ") : fallback;
  }

  function refreshAchievements() {
    achievementBadges.forEach((achievement) => {
      if (achievement.earned(progress)) progress.achievements[achievement.id] = true;
    });
  }

  function navigate(screen) {
    cleanupRuntime();
    state.screen = screen;
    state.win = null;
    state.activeGame = "";
    render();
    playSound("tap");
  }

  function awardStars(stars, score, label) {
    progress.stars += stars;
    progress.coins += Math.max(1, stars * 5 + Math.floor(score / 25));
    progress.score += score;
    if (label) {
      progress.completed[label] = (progress.completed[label] || 0) + 1;
      if (label !== "dailyReward") progress.stats.gamesPlayed += 1;
    }
    rewardBadges.forEach((badge) => {
      if (progress.stars >= badge.need) progress.badges[badge.id] = true;
    });
    refreshAchievements();
    saveProgress();
  }

  function recordQuestionResult(question, correct) {
    const category = question.category || question.caption || "Quiz";
    progress.stats.quizzesAnswered += 1;
    if (correct) progress.stats.correctAnswers += 1;
    const target = correct ? progress.stats.strongAreas : progress.stats.weakAreas;
    target[category] = (target[category] || 0) + 1;
    refreshAchievements();
  }

  function speak(text, hiText) {
    const lang = progress.settings.lang || "en";
    const phrase = lang === "hi" && hiText ? hiText : text;
    if (!phrase) return;

    if (hasNative()) {
      try {
        window.AndroidBridge.speak(phrase, lang === "hi" ? "hi-IN" : "en-US");
        return;
      } catch (error) {
        console.warn("Native speech unavailable", error);
      }
    }

    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(phrase);
      utterance.lang = lang === "hi" ? "hi-IN" : "en-US";
      utterance.rate = 0.8;
      utterance.pitch = 1.45;
      window.speechSynthesis.speak(utterance);
    }
  }

  function vibrate(ms = 35) {
    if (hasNative()) {
      try {
        window.AndroidBridge.vibrate(ms);
        return;
      } catch (error) {
        console.warn("Native vibration unavailable", error);
      }
    }
    if ("vibrate" in navigator) navigator.vibrate(ms);
  }

  function ensureAudio() {
    if (progress.settings.muted) return null;
    if (!audioContext) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return null;
      audioContext = new AudioCtx();
    }
    if (audioContext.state === "suspended") audioContext.resume();
    return audioContext;
  }

  function tone(freq, duration = 0.12, type = "sine", gain = 0.05, delay = 0) {
    const ctx = ensureAudio();
    if (!ctx) return;
    const oscillator = ctx.createOscillator();
    const volume = ctx.createGain();
    oscillator.type = type;
    oscillator.frequency.value = freq;
    volume.gain.value = gain;
    volume.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + delay + duration);
    oscillator.connect(volume);
    volume.connect(ctx.destination);
    oscillator.start(ctx.currentTime + delay);
    oscillator.stop(ctx.currentTime + delay + duration);
  }

  function playSound(kind) {
    if (progress.settings.muted) return;
    const sounds = {
      tap: () => tone(520, 0.06, "triangle", 0.035),
      pop: () => { tone(760, 0.07, "square", 0.035); tone(340, 0.1, "triangle", 0.025, 0.05); },
      good: () => { tone(523, 0.08); tone(659, 0.08, "sine", 0.05, 0.08); tone(784, 0.12, "sine", 0.05, 0.16); },
      bad: () => { tone(220, 0.08, "triangle", 0.04); tone(180, 0.12, "triangle", 0.03, 0.08); },
      win: () => { [523, 659, 784, 1046].forEach((note, index) => tone(note, 0.12, "sine", 0.05, index * 0.08)); },
      dog: () => { tone(180, 0.08, "sawtooth", 0.035); tone(160, 0.08, "sawtooth", 0.035, 0.12); },
      cat: () => { tone(680, 0.14, "sine", 0.035); tone(900, 0.12, "sine", 0.025, 0.1); },
      cow: () => tone(130, 0.28, "sine", 0.04),
      lion: () => { tone(120, 0.25, "sawtooth", 0.05); tone(90, 0.28, "sawtooth", 0.035, 0.16); },
      elephant: () => { tone(440, 0.16, "square", 0.03); tone(760, 0.18, "square", 0.025, 0.14); },
      monkey: () => [520, 640, 480, 720].forEach((note, index) => tone(note, 0.05, "square", 0.025, index * 0.06))
    };
    (sounds[kind] || sounds.tap)();
  }

  function updateMusic() {
    window.clearInterval(musicTimer);
    musicTimer = 0;
    if (!progress.settings.music || progress.settings.muted) return;
    const melody = [392, 440, 523, 440, 392, 330, 392, 523];
    let index = 0;
    musicTimer = window.setInterval(() => {
      tone(melody[index % melody.length], 0.18, "sine", 0.018);
      index += 1;
    }, 420);
  }

  function render() {
    document.documentElement.lang = progress.settings.lang === "hi" ? "hi" : "en";
    app.innerHTML = `
      <div class="app-frame">
        ${renderHeader()}
        <main class="screen">${renderScreen()}</main>
        ${renderNav()}
      </div>
    `;
    if (state.screen === "game" && state.activeGame) {
      window.requestAnimationFrame(() => mountGame(state.activeGame));
    }
    if (state.screen === "win") {
      window.requestAnimationFrame(showConfetti);
    }
  }

  function renderHeader() {
    const cloudReady = state.nativeStatus.firebaseReady || false;
    return `
      <header class="topbar">
        <button class="brand" type="button" data-action="nav" data-screen="home" aria-label="${escapeHtml(t("brand"))}">
          <img src="./assets/images/mascot.svg" alt="">
          <span>
            <span class="brand-title">${escapeHtml(t("brand"))}</span>
            <span class="brand-subtitle">${escapeHtml(t("subtitle"))}</span>
          </span>
        </button>
        <div class="status-pills" aria-label="progress">
          <span class="pill"><img src="./assets/images/star.svg" alt=""> ${escapeHtml(t("stars"))}: ${progress.stars}</span>
          <span class="pill">🏅 ${escapeHtml(t("level"))}: ${progress.level}</span>
          <span class="pill">${cloudReady ? "☁️" : "📱"} ${escapeHtml(cloudReady ? t("cloudReady") : t("offlineReady"))}</span>
        </div>
      </header>
    `;
  }

  function renderNav() {
    return `
      <nav class="bottom-nav" aria-label="Main">
        ${navItems.map((item) => `
          <button class="nav-button ${state.screen === item.id ? "active" : ""}" type="button" data-action="nav" data-screen="${item.id}" aria-label="${escapeHtml(t(item.key))}">
            <span class="nav-icon">${item.icon}</span>
            <span class="nav-label">${item.id === "home" ? "Home" : escapeHtml(t(item.key))}</span>
          </button>
        `).join("")}
      </nav>
    `;
  }

  function renderScreen() {
    switch (state.screen) {
      case "learn": return renderLearn();
      case "play": return renderActivityList("play");
      case "quiz": return renderActivityList("quiz");
      case "rewards": return renderRewards();
      case "parent": return renderParent();
      case "settings": return renderSettings();
      case "daily": return renderDaily();
      case "game": return renderGameShell();
      case "win": return renderWin();
      default: return renderHome();
    }
  }

  function renderHome() {
    return `
      <section class="hero">
        <div>
          <h1>${escapeHtml(t("brand"))}</h1>
          <p>${escapeHtml(t("homeIntro"))}</p>
          ${renderAgeStrip()}
        </div>
        <div class="hero-art" aria-hidden="true">
          <img src="./assets/images/mascot.svg" alt="">
          <span class="floating-token">A</span>
          <span class="floating-token">3</span>
          <span class="floating-token">★</span>
        </div>
      </section>
      <section class="tile-grid">
        ${featureTiles.map((tile) => `
          <button class="feature-tile" data-tone="${tile.tone}" type="button" data-action="nav" data-screen="${tile.screen}">
            <span class="feature-icon">${tile.icon}</span>
            <strong>${escapeHtml(t(tile.key))}</strong>
            <span>${escapeHtml(l10n(tile.desc))}</span>
          </button>
        `).join("")}
      </section>
    `;
  }

  function renderAgeStrip() {
    return `
      <div class="age-strip" aria-label="${escapeHtml(t("chooseAge"))}">
        ${ages.map((age) => `
          <button class="age-button ${state.age === age.id ? "active" : ""}" type="button" data-action="set-age" data-age="${age.id}">
            ${age.label} <span class="visually-hidden">${escapeHtml(l10n(age.detail))}</span>
          </button>
        `).join("")}
      </div>
    `;
  }

  function getVisibleLearnCategories() {
    return learnCategories.filter((category) => category.ages.includes(state.age));
  }

  function renderLearn() {
    const categories = getVisibleLearnCategories();
    if (!categories.some((category) => category.id === state.learnCategory)) {
      state.learnCategory = categories[0]?.id || "letters";
    }
    const active = learnCategories.find((category) => category.id === state.learnCategory) || categories[0];

    return `
      <section class="page-title">
        <h1>${escapeHtml(t("learn"))}</h1>
        <p>${escapeHtml(l10n(active?.title || { en: "Learning", hi: "सीखना" }))}</p>
      </section>
      ${renderAgeStrip()}
      <div class="chip-row">
        ${categories.map((category) => `
          <button class="chip ${category.id === state.learnCategory ? "active" : ""}" type="button" data-action="learn-category" data-category="${category.id}">
            ${category.icon} ${escapeHtml(l10n(category.title))}
          </button>
        `).join("")}
      </div>
      <section class="learn-grid">
        ${(active?.items || []).map((item, index) => renderLearnCard(item, index)).join("")}
      </section>
    `;
  }

  function renderLearnCard(item, index) {
    const bg = item.bg ? ` style="background:${escapeHtml(item.bg)}"` : "";
    const word = progress.settings.lang === "hi" ? item.hi || item.word : item.word;
    return `
      <button class="learn-card" type="button" data-action="learn-card" data-index="${index}"${bg}>
        <span class="learn-icon">${item.icon || ""}</span>
        <span class="big-symbol">${escapeHtml(item.symbol || item.word)}</span>
        <strong>${escapeHtml(word)}</strong>
        <span class="listen">🔊</span>
      </button>
    `;
  }

  function renderActivityList(group) {
    const visible = activities.filter((activity) => activity.group === group && activity.ages.includes(state.age));
    return `
      <section class="page-title">
        <h1>${escapeHtml(t(group))}</h1>
        <p>${escapeHtml(group === "play" ? l10n({ en: "Touch-friendly games with stars and levels.", hi: "टच वाले खेल, सितारे और लेवल।" }) : l10n({ en: "Smart mini quizzes for growing minds.", hi: "बढ़ते दिमाग के लिए छोटे क्विज।" }))}</p>
      </section>
      ${renderAgeStrip()}
      <section class="activity-grid">
        ${visible.length ? visible.map(renderActivityCard).join("") : `<div class="empty-state">${escapeHtml(l10n({ en: "Pick another age to see more activities.", hi: "और गतिविधियों के लिए दूसरी उम्र चुनें।" }))}</div>`}
      </section>
    `;
  }

  function renderActivityCard(activity) {
    const done = progress.completed[activity.id] || 0;
    return `
      <button class="activity-card" type="button" data-action="start-game" data-game="${activity.id}">
        <span class="activity-icon">${activity.icon}</span>
        <strong>${escapeHtml(l10n(activity.title))}</strong>
        <span>${escapeHtml(l10n(activity.desc))}</span>
        <span class="activity-meta">⭐ ${activity.stars} · ✅ ${done}</span>
      </button>
    `;
  }

  function renderRewards() {
    const nextBadge = rewardBadges.find((badge) => !progress.badges[badge.id]);
    const nextNeed = nextBadge ? Math.max(0, nextBadge.need - progress.stars) : 0;
    return `
      <section class="page-title">
        <h1>${escapeHtml(t("rewards"))}</h1>
        <p>${nextBadge ? `${nextNeed} ${escapeHtml(t("stars"))} → ${escapeHtml(l10n(nextBadge.title))}` : escapeHtml(l10n({ en: "All badges unlocked.", hi: "सभी बैज खुल गए।" }))}</p>
      </section>
      <div class="reward-card">
        <span class="reward-badge">⭐</span>
        <div>
          <strong>${escapeHtml(t("stars"))}: ${progress.stars}</strong>
          <div class="progress-track" style="--value:${Math.min(100, (progress.stars % 20) * 5)}%"><span></span></div>
        </div>
      </div>
      <section class="reward-grid" style="margin-top:12px">
        ${rewardBadges.map((badge) => `
          <article class="reward-card ${progress.badges[badge.id] ? "" : "locked"}">
            <span class="reward-badge">${badge.icon}</span>
            <div>
              <strong>${escapeHtml(l10n(badge.title))}</strong>
              <div>${progress.badges[badge.id] ? "✅" : `⭐ ${badge.need}`}</div>
            </div>
          </article>
        `).join("")}
      </section>
    `;
  }

  function renderParent() {
    if (!state.parentUnlocked) {
      return `
        <section class="parent-panel">
          <div class="page-title">
            <h1>${escapeHtml(t("parentCheck"))}</h1>
            <p>${escapeHtml(t("parentLocked"))}</p>
          </div>
          <h2 class="question-text">7 + 5 = ?</h2>
          <div class="answer-grid">
            ${[10, 11, 12, 13].map((answer) => `
              <button class="answer-button" type="button" data-action="parent-answer" data-answer="${answer}">${answer}</button>
            `).join("")}
          </div>
        </section>
      `;
    }

    return `
      <section class="parent-panel">
        <div class="page-title">
          <h1>${escapeHtml(t("parent"))}</h1>
          <p>${escapeHtml(t("progressSaved"))} · ${escapeHtml((state.nativeStatus.firebaseReady ? t("cloudReady") : t("offlineReady")))}</p>
        </div>
        <div class="parent-grid">
          <div class="parent-row"><span>${escapeHtml(t("score"))}</span><strong>${progress.score}</strong></div>
          <div class="parent-row"><span>${escapeHtml(t("stars"))}</span><strong>${progress.stars}</strong></div>
          <div class="parent-row"><span>${escapeHtml(t("level"))}</span><strong>${progress.level}</strong></div>
          <div class="parent-row"><span>UID</span><strong>${escapeHtml(state.nativeStatus.uid || "local")}</strong></div>
        </div>
        <label class="range-label" style="margin-top:14px">
          ${escapeHtml(t("export"))}
          <textarea readonly rows="6">${escapeHtml(JSON.stringify(progress, null, 2))}</textarea>
        </label>
        <div class="chip-row">
          <button class="round-button secondary" type="button" data-action="cloud-sync">☁️ ${escapeHtml(t("cloudSync"))}</button>
          <button class="danger-button" type="button" data-action="reset-progress">♻️ ${escapeHtml(t("reset"))}</button>
        </div>
      </section>
    `;
  }

  function renderSettings() {
    return `
      <section class="settings-panel">
        <div class="page-title">
          <h1>${escapeHtml(t("settings"))}</h1>
          <p>${escapeHtml(l10n({ en: "Sound, language, age group, and offline play.", hi: "आवाज़, भाषा, उम्र और ऑफलाइन खेल।" }))}</p>
        </div>
        <div class="settings-grid">
          <div class="setting-row">
            <span>${escapeHtml(t("language"))}</span>
            <span>
              <button class="mini-button" type="button" data-action="set-lang" data-lang="en">EN</button>
              <button class="mini-button" type="button" data-action="set-lang" data-lang="hi">HI</button>
            </span>
          </div>
          <div class="setting-row">
            <span>${escapeHtml(t("mute"))}</span>
            <button class="toggle ${progress.settings.muted ? "active" : ""}" type="button" data-action="toggle-muted" aria-label="${escapeHtml(t("mute"))}"><span></span></button>
          </div>
          <div class="setting-row">
            <span>${escapeHtml(t("music"))}</span>
            <button class="toggle ${progress.settings.music ? "active" : ""}" type="button" data-action="toggle-music" aria-label="${escapeHtml(t("music"))}"><span></span></button>
          </div>
          <div class="setting-row">
            <span>${escapeHtml(t("chooseAge"))}</span>
            <strong>${state.age}</strong>
          </div>
        </div>
        ${renderAgeStrip()}
      </section>
    `;
  }

  function renderDaily() {
    const today = todayKey();
    const rewardClaimed = progress.daily.lastReward === today;
    const challengeDone = progress.daily.lastChallenge === today;
    return `
      <section class="page-title">
        <h1>${escapeHtml(t("dailyChallenge"))}</h1>
        <p>${escapeHtml(challengeDone ? t("challengeDone") : l10n({ en: "A small fresh challenge keeps learning fun.", hi: "छोटा नया चैलेंज सीखना मजेदार बनाता है।" }))}</p>
      </section>
      <section class="section-grid">
        <article class="reward-card">
          <span class="reward-badge">🎁</span>
          <div>
            <strong>${escapeHtml(rewardClaimed ? t("rewardClaimed") : t("rewardReady"))}</strong>
            <div>⭐ +3 · 🔥 ${progress.daily.streak}</div>
          </div>
        </article>
        <button class="activity-card" type="button" data-action="claim-daily" ${rewardClaimed ? "disabled" : ""}>
          <span class="activity-icon">🌞</span>
          <strong>${escapeHtml(t("claim"))}</strong>
          <span>⭐ +3</span>
        </button>
        <button class="activity-card" type="button" data-action="start-daily" ${challengeDone ? "disabled" : ""}>
          <span class="activity-icon">🚀</span>
          <strong>${escapeHtml(t("start"))}</strong>
          <span>${escapeHtml(t("dailyChallenge"))}</span>
        </button>
      </section>
    `;
  }

  function renderGameShell() {
    const activity = activities.find((item) => item.id === state.activeGame);
    return `
      <section class="game-shell">
        <div class="game-top">
          <h1 class="game-title">${escapeHtml(activity ? l10n(activity.title) : t("play"))}</h1>
          <div class="game-stats">
            <span class="pill">⭐ <span id="gameStars">${activity?.stars || 3}</span></span>
            <span class="pill">🏁 <span id="gameScore">0</span></span>
            <span class="pill">⏱️ <span id="gameTime">--</span></span>
            <button class="mini-button" type="button" data-action="nav" data-screen="${activity?.group || "play"}">← ${escapeHtml(t("back"))}</button>
          </div>
        </div>
        <div id="gameStage" class="game-stage"></div>
      </section>
    `;
  }

  function renderWin() {
    const win = state.win || { title: t("great"), stars: 0, score: 0, detail: t("winText") };
    return `
      <section class="win-panel">
        <img src="./assets/images/star.svg" alt="">
        <h1>${escapeHtml(t("great"))}</h1>
        <p>${escapeHtml(win.detail || t("winText"))}</p>
        <div class="chip-row">
          <span class="pill">⭐ +${win.stars}</span>
          <span class="pill">🏁 +${win.score}</span>
          <span class="pill">🏅 ${escapeHtml(t("level"))} ${progress.level}</span>
        </div>
        <div class="chip-row">
          <button class="round-button primary" type="button" data-action="nav" data-screen="home">🏠 Home</button>
          <button class="round-button secondary" type="button" data-action="nav" data-screen="rewards">⭐ ${escapeHtml(t("rewards"))}</button>
        </div>
      </section>
    `;
  }

  function handleLearnCard(index) {
    const active = learnCategories.find((category) => category.id === state.learnCategory);
    const item = active?.items[index];
    if (!item) return;
    const en = item.speak || `${item.symbol || ""} ${item.word || ""}`.trim();
    const hi = item.hiSpeak || item.hi || item.word;
    speak(en, hi);
    playSound(item.sound || "tap");
    vibrate(25);
    progress.learningTaps += 1;
    if (progress.learningTaps % 6 === 0) {
      awardStars(1, 5, "learnTap");
      render();
    } else {
      saveProgress();
    }
  }

  function startGame(gameId, dailyMode = false) {
    cleanupRuntime();
    state.dailyMode = dailyMode;
    state.activeGame = gameId;
    state.screen = "game";
    render();
    playSound("tap");
  }

  function mountGame(gameId) {
    if (state.mountedGame === gameId) return;
    const stage = document.getElementById("gameStage");
    if (!stage) return;
    state.mountedGame = gameId;
    const mounts = {
      balloon: mountBalloonGame,
      shapeMatch: mountShapeMatchGame,
      counting: mountCountingGame,
      drawing: mountDrawingGame,
      memory: mountMemoryGame,
      memoryMatch: mountMemoryGame,
      alphabetPuzzle: (node) => mountSequencePuzzleGame(node, "letters", "alphabetPuzzle"),
      numberPuzzle: (node) => mountSequencePuzzleGame(node, "numbers", "numberPuzzle"),
      colorMatch: mountColorMatchGame,
      fruitCatcher: mountFruitCatcherGame,
      animalSoundGuess: mountAnimalSoundGuessGame,
      shadowMatch: mountShadowMatchGame,
      oddOneOut: mountOddOneOutGame,
      traceAlphabet: (node) => mountTraceGame(node, "letters", "traceAlphabet"),
      traceNumbers: (node) => mountTraceGame(node, "numbers", "traceNumbers"),
      matchingGame: mountMatchingGame,
      pictureQuiz: (node) => mountQuestionGame(node, makeEngineQuestion("Picture Quiz"), 6, "pictureQuiz"),
      letterHunt: mountLetterHuntGame,
      wordBuilder: mountWordBuilderGame,
      patternGame: mountPatternGame,
      speedTap: mountSpeedTapGame,
      alphabetQuiz: (node) => mountQuestionGame(node, makeEngineQuestion("Alphabet"), 10, "alphabetQuiz"),
      numberQuiz: (node) => mountQuestionGame(node, makeEngineQuestion("Numbers"), 10, "numberQuiz"),
      animalQuiz: (node) => mountQuestionGame(node, makeEngineQuestion("Animals"), 10, "animalQuiz"),
      math: (node) => mountQuestionGame(node, makeMathQuestion, 7, "math"),
      spelling: (node) => mountQuestionGame(node, makeSpellingQuestion, 7, "spelling"),
      vocabularyQuiz: (node) => mountQuestionGame(node, makeEngineQuestion("Basic English Vocabulary"), 10, "vocabularyQuiz"),
      gk: (node) => mountQuestionGame(node, makeGkQuestion, 6, "gk"),
      worldQuiz: (node) => mountQuestionGame(node, makeMixedEngineQuestion(["Nature", "Weather", "Space", "Months", "Days"]), 10, "worldQuiz"),
      habitsQuiz: (node) => mountQuestionGame(node, makeEngineQuestion("Good Habits"), 8, "habitsQuiz"),
      logic: (node) => mountQuestionGame(node, makeLogicQuestion, 6, "logic"),
      brain: (node) => mountQuestionGame(node, makeBrainQuestion, 6, "brain"),
      megaQuiz: (node) => mountQuestionGame(node, makeEngineQuestion("Mega Quiz"), 12, "megaQuiz")
    };
    (mounts[gameId] || mountBalloonGame)(stage);
  }

  function finishGame(gameId, score, stars, detail) {
    cleanupRuntime();
    let finalStars = stars;
    if (state.dailyMode) {
      finalStars += 3;
      progress.daily.lastChallenge = todayKey();
      progress.daily.streak += 1;
      state.dailyMode = false;
    }
    awardStars(finalStars, score, gameId);
    const activity = activities.find((item) => item.id === gameId);
    state.win = {
      title: activity ? l10n(activity.title) : t("great"),
      score,
      stars: finalStars,
      detail
    };
    state.screen = "win";
    state.activeGame = "";
    render();
    playSound("win");
    speak("Great job! You earned stars.", "बहुत बढ़िया! आपने सितारे जीते।");
  }

  function mountBalloonGame(stage) {
    stage.innerHTML = "";
    let score = 0;
    let lastSpawn = 0;
    let running = true;
    const duration = 30_000;
    const start = performance.now();
    const balloons = new Set();
    let raf = 0;

    function spawn(now) {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "balloon";
      button.innerHTML = `<img src="./assets/images/balloon.svg" alt="balloon">`;
      const model = {
        el: button,
        x: 30 + Math.random() * Math.max(80, stage.clientWidth - 60),
        y: stage.clientHeight + 70,
        speed: 0.055 + Math.random() * 0.065,
        last: now
      };
      button.addEventListener("click", () => {
        if (!balloons.has(model)) return;
        score += 1;
        setText("gameScore", score);
        playSound("pop");
        vibrate(25);
        button.classList.add("popped");
        balloons.delete(model);
        window.setTimeout(() => button.remove(), 180);
      });
      balloons.add(model);
      stage.appendChild(button);
    }

    function loop(now) {
      if (!running) return;
      const remaining = Math.max(0, duration - (now - start));
      setText("gameTime", Math.ceil(remaining / 1000));
      if (now - lastSpawn > 540) {
        spawn(now);
        lastSpawn = now;
      }
      balloons.forEach((balloon) => {
        const delta = now - balloon.last;
        balloon.last = now;
        balloon.y -= delta * balloon.speed;
        balloon.el.style.transform = `translate(${balloon.x}px, ${balloon.y}px)`;
        if (balloon.y < -120) {
          balloons.delete(balloon);
          balloon.el.remove();
        }
      });
      if (remaining <= 0) {
        finishGame("balloon", score * 10, Math.max(3, Math.min(9, Math.floor(score / 4) + 3)), l10n({ en: `You popped ${score} balloons.`, hi: `आपने ${score} गुब्बारे पॉप किए।` }));
        return;
      }
      raf = window.requestAnimationFrame(loop);
    }

    raf = window.requestAnimationFrame(loop);
    addCleanup(() => {
      running = false;
      window.cancelAnimationFrame(raf);
    });
  }

  function mountShapeMatchGame(stage) {
    const shapes = [
      { name: "Circle", hi: "वृत्त", symbol: "●" },
      { name: "Square", hi: "वर्ग", symbol: "■" },
      { name: "Triangle", hi: "त्रिभुज", symbol: "▲" },
      { name: "Diamond", hi: "हीरा", symbol: "◆" },
      { name: "Star", hi: "सितारा", symbol: "★" },
      { name: "Heart", hi: "दिल", symbol: "♥" }
    ];
    let round = 0;
    let correct = 0;

    function next() {
      round += 1;
      if (round > 6) {
        finishGame("shapeMatch", correct * 12, 3 + correct, l10n({ en: `${correct} shapes matched.`, hi: `${correct} आकार मिले।` }));
        return;
      }
      const answer = randomFrom(shapes);
      const options = shuffle([answer, ...shuffle(shapes.filter((shape) => shape !== answer)).slice(0, 3)]);
      setText("gameTime", `${round}/6`);
      setText("gameScore", correct);
      stage.innerHTML = `
        <div class="question-panel">
          <p class="question-subtext">${escapeHtml(l10n({ en: "Find this shape", hi: "यह आकार ढूँढें" }))}</p>
          <h2 class="question-text">${answer.symbol}</h2>
          <div class="answer-grid">
            ${options.map((shape) => `<button class="answer-button" data-name="${shape.name}" type="button">${shape.symbol}<br><small>${escapeHtml(progress.settings.lang === "hi" ? shape.hi : shape.name)}</small></button>`).join("")}
          </div>
        </div>
      `;
      let answered = false;
      stage.querySelectorAll(".answer-button").forEach((button) => {
        button.addEventListener("click", () => {
          if (answered) return;
          answered = true;
          stage.querySelectorAll(".answer-button").forEach((item) => {
            item.disabled = true;
            if (item.dataset.name === answer.name) item.classList.add("correct");
          });
          const ok = button.dataset.name === answer.name;
          if (ok) correct += 1;
          markAnswer(stage, button, ok);
          window.setTimeout(next, 620);
        });
      });
    }
    next();
  }

  function mountCountingGame(stage) {
    const objects = ["🍎", "🍌", "🍓", "⭐", "🧸", "🚗"];
    let round = 0;
    let correct = 0;

    function next() {
      round += 1;
      if (round > 6) {
        finishGame("counting", correct * 12, 3 + correct, l10n({ en: `${correct} counting rounds correct.`, hi: `${correct} गिनती सही।` }));
        return;
      }
      const count = 1 + Math.floor(Math.random() * 9);
      const emoji = randomFrom(objects);
      const options = shuffle([count, count + 1, Math.max(1, count - 1), count + 2]).slice(0, 4);
      setText("gameTime", `${round}/6`);
      setText("gameScore", correct);
      stage.innerHTML = `
        <div class="question-panel">
          <p class="question-subtext">${escapeHtml(l10n({ en: "How many?", hi: "कितने हैं?" }))}</p>
          <div class="emoji-row">${Array.from({ length: count }, () => `<span class="count-emoji">${emoji}</span>`).join("")}</div>
          <div class="answer-grid">
            ${options.map((value) => `<button class="answer-button" data-value="${value}" type="button">${value}</button>`).join("")}
          </div>
        </div>
      `;
      let answered = false;
      stage.querySelectorAll(".answer-button").forEach((button) => {
        button.addEventListener("click", () => {
          if (answered) return;
          answered = true;
          stage.querySelectorAll(".answer-button").forEach((item) => {
            item.disabled = true;
            if (Number(item.dataset.value) === count) item.classList.add("correct");
          });
          const ok = Number(button.dataset.value) === count;
          if (ok) correct += 1;
          markAnswer(stage, button, ok);
          window.setTimeout(next, 620);
        });
      });
    }
    next();
  }

  function mountMemoryGame(stage) {
    const base = state.age === "7-8" ? ["🌞", "🚀", "🧠", "🎨", "🔢", "🌍", "⚡", "🏆"] : ["🍎", "🐶", "⭐", "🎈", "🚗", "🧸"];
    const pairs = shuffle(base).slice(0, state.age === "7-8" ? 8 : 6);
    const deck = shuffle([...pairs, ...pairs]).map((icon, index) => ({ id: `${icon}-${index}`, icon, matched: false }));
    let first = null;
    let locked = false;
    let moves = 0;
    let matched = 0;

    stage.innerHTML = `
      <div class="question-panel">
        <p class="question-subtext">${escapeHtml(l10n({ en: "Find matching pairs", hi: "मिलते जोड़े ढूँढें" }))}</p>
        <div class="memory-grid">
          ${deck.map((card, index) => `<button class="memory-card" data-index="${index}" type="button">?</button>`).join("")}
        </div>
      </div>
    `;

    stage.querySelectorAll(".memory-card").forEach((button) => {
      button.addEventListener("click", () => {
        if (locked || button.classList.contains("matched") || button.textContent !== "?") return;
        const card = deck[Number(button.dataset.index)];
        button.textContent = card.icon;
        playSound("tap");

        if (!first) {
          first = { button, card };
          return;
        }

        moves += 1;
        setText("gameScore", moves);
        if (first.card.icon === card.icon) {
          first.button.classList.add("matched");
          button.classList.add("matched");
          matched += 2;
          first = null;
          playSound("good");
          if (matched === deck.length) {
            const stars = Math.max(4, 10 - Math.floor(moves / 3));
            finishGame("memory", Math.max(40, 180 - moves * 4), stars, l10n({ en: `Finished in ${moves} moves.`, hi: `${moves} चाल में पूरा।` }));
          }
        } else {
          locked = true;
          playSound("bad");
          window.setTimeout(() => {
            first.button.textContent = "?";
            button.textContent = "?";
            first = null;
            locked = false;
          }, 640);
        }
      });
    });
    setText("gameTime", "∞");
  }

  function mountDrawingGame(stage) {
    stage.innerHTML = `
      <div class="drawing-board">
        <canvas class="draw-canvas" id="drawCanvas"></canvas>
        <div class="toolbox">
          <div class="swatches">
            ${["#24304f", "#ff5d8f", "#67d7ff", "#64d66e", "#ffd166", "#8b5cf6", "#ff9f1c", "#ffffff"].map((color) => `<button class="swatch" type="button" data-color="${color}" style="background:${color}" aria-label="${color}"></button>`).join("")}
          </div>
          <label class="range-label">${escapeHtml(t("brush"))}<input id="brushSize" type="range" min="4" max="30" value="12"></label>
          <button class="round-button secondary" id="clearDrawing" type="button">🧽 ${escapeHtml(t("clear"))}</button>
          <button class="round-button sunny" id="saveDrawing" type="button">💾 ${escapeHtml(t("saveDrawing"))}</button>
          <button class="round-button primary" id="finishDrawing" type="button">⭐ ${escapeHtml(t("drawDone"))}</button>
        </div>
      </div>
    `;

    const canvas = document.getElementById("drawCanvas");
    const ctx = canvas.getContext("2d");
    let color = "#ff5d8f";
    let drawing = false;
    let last = null;

    function resizeCanvas() {
      const rect = canvas.getBoundingClientRect();
      const ratio = window.devicePixelRatio || 1;
      canvas.width = Math.max(320, Math.floor(rect.width * ratio));
      canvas.height = Math.max(320, Math.floor(rect.height * ratio));
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, rect.width, rect.height);
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
    }

    function point(event) {
      const rect = canvas.getBoundingClientRect();
      return { x: event.clientX - rect.left, y: event.clientY - rect.top };
    }

    function draw(event) {
      if (!drawing) return;
      const brush = Number(document.getElementById("brushSize").value);
      const current = point(event);
      ctx.strokeStyle = color;
      ctx.lineWidth = brush;
      ctx.beginPath();
      ctx.moveTo(last.x, last.y);
      ctx.lineTo(current.x, current.y);
      ctx.stroke();
      last = current;
    }

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);
    canvas.addEventListener("pointerdown", (event) => {
      drawing = true;
      last = point(event);
      canvas.setPointerCapture(event.pointerId);
      playSound("tap");
    });
    canvas.addEventListener("pointermove", draw);
    canvas.addEventListener("pointerup", () => { drawing = false; });
    canvas.addEventListener("pointercancel", () => { drawing = false; });
    stage.querySelectorAll(".swatch").forEach((button) => {
      button.addEventListener("click", () => {
        color = button.dataset.color || color;
        playSound("tap");
      });
    });
    document.getElementById("clearDrawing").addEventListener("click", resizeCanvas);
    document.getElementById("saveDrawing").addEventListener("click", () => {
      const dataUrl = canvas.toDataURL("image/png");
      progress.drawings.unshift({ createdAt: new Date().toISOString(), dataUrl });
      progress.drawings = progress.drawings.slice(0, 5);
      saveProgress();
      if (hasNative()) {
        try {
          window.AndroidBridge.uploadDrawing(dataUrl, "kids-art");
        } catch (error) {
          console.warn("Drawing upload unavailable", error);
        }
      }
      playSound("good");
    });
    document.getElementById("finishDrawing").addEventListener("click", () => {
      finishGame("drawing", 40, 3, l10n({ en: "Your artwork is saved locally.", hi: "आपकी ड्रॉइंग लोकल सेव है।" }));
    });
    setText("gameTime", "∞");
    addCleanup(() => window.removeEventListener("resize", resizeCanvas));
  }

  function showAnswerBurst(stage, correct, text) {
    const burst = document.createElement("div");
    burst.className = `answer-burst ${correct ? "happy" : "gentle"}`;
    burst.textContent = text || (correct ? "Great!" : "Try again");
    stage.appendChild(burst);
    window.setTimeout(() => burst.remove(), 780);
  }

  function markAnswer(stage, button, correct) {
    button.classList.add(correct ? "correct" : "wrong");
    playSound(correct ? "good" : "bad");
    vibrate(correct ? 28 : 16);
    showAnswerBurst(stage, correct, correct ? "⭐ Correct!" : "Try again");
  }

  function mountSequencePuzzleGame(stage, mode, gameId) {
    const lettersSet = shuffle(alphabet.map((item) => item[0])).slice(0, 5).sort();
    const start = 1 + Math.floor(Math.random() * 12);
    const sequence = mode === "letters" ? lettersSet : Array.from({ length: 5 }, (_, index) => String(start + index));
    const shuffled = shuffle(sequence);
    let nextIndex = 0;
    stage.innerHTML = `
      <div class="question-panel">
        <p class="question-subtext">${escapeHtml(mode === "letters" ? "Tap letters in ABC order" : "Tap numbers from small to big")}</p>
        <h2 class="question-text" id="sequenceProgress">${sequence.map(() => "_").join(" ")}</h2>
        <div class="answer-grid">
          ${shuffled.map((item) => `<button class="answer-button" type="button" data-value="${item}">${item}</button>`).join("")}
        </div>
      </div>
    `;
    stage.querySelectorAll(".answer-button").forEach((button) => {
      button.addEventListener("click", () => {
        if (button.disabled) return;
        const correct = button.dataset.value === sequence[nextIndex];
        markAnswer(stage, button, correct);
        if (!correct) return;
        button.disabled = true;
        nextIndex += 1;
        document.getElementById("sequenceProgress").textContent = sequence.slice(0, nextIndex).join(" ") + " " + sequence.slice(nextIndex).map(() => "_").join(" ");
        setText("gameScore", nextIndex);
        if (nextIndex === sequence.length) {
          window.setTimeout(() => finishGame(gameId, 70, 5, mode === "letters" ? "Alphabet puzzle completed." : "Number puzzle completed."), 500);
        }
      });
    });
    setText("gameTime", "∞");
  }

  function mountColorMatchGame(stage) {
    const colors = [
      ["Red", "#ff6b6b"], ["Blue", "#67d7ff"], ["Yellow", "#ffd166"], ["Green", "#64d66e"],
      ["Purple", "#8b5cf6"], ["Orange", "#ff9f1c"], ["Pink", "#ff8fab"], ["Black", "#24304f"]
    ];
    let round = 0;
    let correctCount = 0;
    function next() {
      round += 1;
      if (round > 7) {
        finishGame("colorMatch", correctCount * 12, 3 + correctCount, `${correctCount} colors matched.`);
        return;
      }
      const answer = randomFrom(colors);
      const options = shuffle([answer, ...shuffle(colors.filter((item) => item !== answer)).slice(0, 3)]);
      setText("gameTime", `${round}/7`);
      setText("gameScore", correctCount);
      stage.innerHTML = `
        <div class="question-panel">
          <p class="question-subtext">Find this color</p>
          <h2 class="question-text">${answer[0]}</h2>
          <div class="answer-grid">
            ${options.map((item) => `<button class="answer-button color-choice" type="button" data-value="${item[0]}" style="background:${item[1]}">${item[1] === "#24304f" ? " " : "●"}</button>`).join("")}
          </div>
        </div>
      `;
      stage.querySelectorAll(".answer-button").forEach((button) => {
        button.addEventListener("click", () => {
          const ok = button.dataset.value === answer[0];
          if (ok) correctCount += 1;
          markAnswer(stage, button, ok);
          window.setTimeout(next, 560);
        }, { once: true });
      });
    }
    next();
  }

  function mountFruitCatcherGame(stage) {
    const fruits = ["🍎", "🍌", "🍇", "🍊", "🥭", "🍓", "🍉", "🍍"];
    const target = randomFrom(fruits);
    let score = 0;
    let running = true;
    let lastSpawn = 0;
    const duration = 22_000;
    const start = performance.now();
    const drops = new Set();
    let raf = 0;
    stage.innerHTML = `<div class="question-panel"><p class="question-subtext">Catch only this fruit</p><h2 class="question-text">${target}</h2></div>`;
    function spawn(now) {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "falling-item";
      const icon = randomFrom(fruits);
      button.textContent = icon;
      const model = { el: button, icon, x: 24 + Math.random() * Math.max(80, stage.clientWidth - 48), y: -40, speed: 0.08 + Math.random() * 0.08, last: now };
      button.addEventListener("click", () => {
        const ok = model.icon === target;
        if (ok) score += 1;
        setText("gameScore", score);
        markAnswer(stage, button, ok);
        drops.delete(model);
        window.setTimeout(() => button.remove(), 160);
      });
      drops.add(model);
      stage.appendChild(button);
    }
    function loop(now) {
      if (!running) return;
      const remaining = Math.max(0, duration - (now - start));
      setText("gameTime", Math.ceil(remaining / 1000));
      if (now - lastSpawn > 620) {
        spawn(now);
        lastSpawn = now;
      }
      drops.forEach((drop) => {
        const delta = now - drop.last;
        drop.last = now;
        drop.y += delta * drop.speed;
        drop.el.style.transform = `translate(${drop.x}px, ${drop.y}px)`;
        if (drop.y > stage.clientHeight + 80) {
          drops.delete(drop);
          drop.el.remove();
        }
      });
      if (remaining <= 0) {
        finishGame("fruitCatcher", score * 12, Math.max(3, Math.min(9, score + 2)), `You caught ${score} target fruits.`);
        return;
      }
      raf = window.requestAnimationFrame(loop);
    }
    raf = window.requestAnimationFrame(loop);
    addCleanup(() => {
      running = false;
      window.cancelAnimationFrame(raf);
    });
  }

  function mountAnimalSoundGuessGame(stage) {
    const animals = [
      ["Dog", "🐶", "dog", "woof woof"], ["Cat", "🐱", "cat", "meow"], ["Cow", "🐮", "cow", "moo"],
      ["Lion", "🦁", "lion", "roar"], ["Elephant", "🐘", "elephant", "trumpet"], ["Monkey", "🐵", "monkey", "chatter"]
    ];
    let round = 0;
    let correctCount = 0;
    function next() {
      round += 1;
      if (round > 6) {
        finishGame("animalSoundGuess", correctCount * 12, 3 + correctCount, `${correctCount} animal sounds guessed.`);
        return;
      }
      const answer = randomFrom(animals);
      const options = shuffle([answer, ...shuffle(animals.filter((item) => item !== answer)).slice(0, 3)]);
      playSound(answer[2]);
      speak(`${answer[3]}. Which animal is it?`, "");
      setText("gameTime", `${round}/6`);
      setText("gameScore", correctCount);
      stage.innerHTML = `
        <div class="question-panel">
          <p class="question-subtext">Listen and choose</p>
          <button class="round-button sunny" type="button" id="replaySound">🔊 Replay sound</button>
          <div class="answer-grid">
            ${options.map((item) => `<button class="answer-button" type="button" data-value="${item[0]}">${item[1]}<br><small>${item[0]}</small></button>`).join("")}
          </div>
        </div>
      `;
      document.getElementById("replaySound").addEventListener("click", () => playSound(answer[2]));
      stage.querySelectorAll(".answer-button").forEach((button) => {
        button.addEventListener("click", () => {
          const ok = button.dataset.value === answer[0];
          if (ok) correctCount += 1;
          markAnswer(stage, button, ok);
          window.setTimeout(next, 620);
        }, { once: true });
      });
    }
    next();
  }

  function mountShadowMatchGame(stage) {
    const shapes = [["Circle", "●"], ["Square", "■"], ["Triangle", "▲"], ["Diamond", "◆"], ["Star", "★"], ["Heart", "♥"]];
    let round = 0;
    let correctCount = 0;
    function next() {
      round += 1;
      if (round > 6) {
        finishGame("shadowMatch", correctCount * 12, 3 + correctCount, `${correctCount} shadows matched.`);
        return;
      }
      const answer = randomFrom(shapes);
      const options = shuffle([answer, ...shuffle(shapes.filter((item) => item !== answer)).slice(0, 3)]);
      setText("gameTime", `${round}/6`);
      stage.innerHTML = `
        <div class="question-panel">
          <p class="question-subtext">Match the shadow</p>
          <h2 class="question-text shadow-symbol">${answer[1]}</h2>
          <div class="answer-grid">
            ${options.map((item) => `<button class="answer-button" type="button" data-value="${item[0]}">${item[1]}<br><small>${item[0]}</small></button>`).join("")}
          </div>
        </div>
      `;
      stage.querySelectorAll(".answer-button").forEach((button) => {
        button.addEventListener("click", () => {
          const ok = button.dataset.value === answer[0];
          if (ok) correctCount += 1;
          setText("gameScore", correctCount);
          markAnswer(stage, button, ok);
          window.setTimeout(next, 560);
        }, { once: true });
      });
    }
    next();
  }

  function mountOddOneOutGame(stage) {
    const sets = [
      { same: ["🍎", "🍎", "🍎"], odd: "🚗" },
      { same: ["🐶", "🐶", "🐶"], odd: "🍌" },
      { same: ["🔴", "🔴", "🔴"], odd: "🔵" },
      { same: ["▲", "▲", "▲"], odd: "■" },
      { same: ["7", "7", "7"], odd: "9" }
    ];
    let round = 0;
    let correctCount = 0;
    function next() {
      round += 1;
      if (round > 6) {
        finishGame("oddOneOut", correctCount * 12, 3 + correctCount, `${correctCount} odd items found.`);
        return;
      }
      const set = randomFrom(sets);
      const options = shuffle([...set.same, set.odd]);
      setText("gameTime", `${round}/6`);
      stage.innerHTML = `
        <div class="question-panel">
          <p class="question-subtext">Tap the different one</p>
          <div class="answer-grid">
            ${options.map((item, index) => `<button class="answer-button" type="button" data-index="${index}" data-value="${item}">${item}</button>`).join("")}
          </div>
        </div>
      `;
      stage.querySelectorAll(".answer-button").forEach((button) => {
        button.addEventListener("click", () => {
          const ok = button.dataset.value === set.odd;
          if (ok) correctCount += 1;
          setText("gameScore", correctCount);
          markAnswer(stage, button, ok);
          window.setTimeout(next, 560);
        }, { once: true });
      });
    }
    next();
  }

  function mountTraceGame(stage, mode, gameId) {
    const target = mode === "letters" ? randomFrom(alphabet).slice(0, 1)[0] : String(1 + Math.floor(Math.random() * 9));
    stage.innerHTML = `
      <div class="drawing-board">
        <canvas class="draw-canvas trace-canvas" id="traceCanvas"></canvas>
        <div class="toolbox">
          <p class="question-subtext">Trace the big ${mode === "letters" ? "letter" : "number"}</p>
          <h2 class="question-text">${target}</h2>
          <button class="round-button secondary" id="clearTrace" type="button">🧽 ${escapeHtml(t("clear"))}</button>
          <button class="round-button primary" id="finishTrace" type="button">⭐ ${escapeHtml(t("drawDone"))}</button>
        </div>
      </div>
    `;
    const canvas = document.getElementById("traceCanvas");
    const ctx = canvas.getContext("2d");
    let drawing = false;
    let last = null;
    function resize() {
      const rect = canvas.getBoundingClientRect();
      const ratio = window.devicePixelRatio || 1;
      canvas.width = Math.max(320, Math.floor(rect.width * ratio));
      canvas.height = Math.max(320, Math.floor(rect.height * ratio));
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
      ctx.fillStyle = "#fff";
      ctx.fillRect(0, 0, rect.width, rect.height);
      ctx.font = `900 ${Math.min(rect.width, rect.height) * 0.72}px Trebuchet MS`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillStyle = "rgba(36, 48, 79, 0.12)";
      ctx.fillText(target, rect.width / 2, rect.height / 2);
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
    }
    function point(event) {
      const rect = canvas.getBoundingClientRect();
      return { x: event.clientX - rect.left, y: event.clientY - rect.top };
    }
    function draw(event) {
      if (!drawing) return;
      const current = point(event);
      ctx.strokeStyle = "#ff5d8f";
      ctx.lineWidth = 18;
      ctx.beginPath();
      ctx.moveTo(last.x, last.y);
      ctx.lineTo(current.x, current.y);
      ctx.stroke();
      last = current;
    }
    resize();
    window.addEventListener("resize", resize);
    canvas.addEventListener("pointerdown", (event) => {
      drawing = true;
      last = point(event);
      canvas.setPointerCapture(event.pointerId);
      playSound("tap");
    });
    canvas.addEventListener("pointermove", draw);
    canvas.addEventListener("pointerup", () => { drawing = false; });
    canvas.addEventListener("pointercancel", () => { drawing = false; });
    document.getElementById("clearTrace").addEventListener("click", resize);
    document.getElementById("finishTrace").addEventListener("click", () => finishGame(gameId, 45, 4, `${target} traced beautifully.`));
    setText("gameTime", "∞");
    addCleanup(() => window.removeEventListener("resize", resize));
  }

  function mountMatchingGame(stage) {
    const pairs = shuffle([
      ["Apple", "🍎"], ["Dog", "🐶"], ["Car", "🚗"], ["Book", "📘"], ["Sun", "☀️"], ["Star", "⭐"]
    ]).slice(0, 5);
    let index = 0;
    let correctCount = 0;
    function next() {
      if (index >= pairs.length) {
        finishGame("matchingGame", correctCount * 14, 3 + correctCount, `${correctCount} matches completed.`);
        return;
      }
      const answer = pairs[index];
      const options = shuffle([answer, ...shuffle(pairs.filter((item) => item !== answer)).slice(0, 3)]);
      setText("gameTime", `${index + 1}/${pairs.length}`);
      stage.innerHTML = `
        <div class="question-panel">
          <p class="question-subtext">Match word to picture</p>
          <h2 class="question-text">${answer[0]}</h2>
          <div class="answer-grid">
            ${options.map((item) => `<button class="answer-button" type="button" data-value="${item[0]}">${item[1]}</button>`).join("")}
          </div>
        </div>
      `;
      stage.querySelectorAll(".answer-button").forEach((button) => {
        button.addEventListener("click", () => {
          const ok = button.dataset.value === answer[0];
          if (ok) correctCount += 1;
          index += 1;
          setText("gameScore", correctCount);
          markAnswer(stage, button, ok);
          window.setTimeout(next, 560);
        }, { once: true });
      });
    }
    next();
  }

  function mountLetterHuntGame(stage) {
    let round = 0;
    let score = 0;
    function next() {
      round += 1;
      if (round > 6) {
        finishGame("letterHunt", score * 10, Math.max(4, score), `${score} letters found.`);
        return;
      }
      const target = randomFrom(alphabet)[0];
      const distractors = shuffle(alphabet.map((item) => item[0]).filter((letter) => letter !== target)).slice(0, 9);
      const lettersPool = shuffle([target, target, target, ...distractors]);
      setText("gameTime", `${round}/6`);
      stage.innerHTML = `
        <div class="question-panel">
          <p class="question-subtext">Find letter</p>
          <h2 class="question-text">${target}</h2>
          <div class="memory-grid">
            ${lettersPool.map((letter) => `<button class="memory-card" type="button" data-value="${letter}">${letter}</button>`).join("")}
          </div>
        </div>
      `;
      stage.querySelectorAll(".memory-card").forEach((button) => {
        button.addEventListener("click", () => {
          const ok = button.dataset.value === target;
          if (ok) score += 1;
          setText("gameScore", score);
          markAnswer(stage, button, ok);
          window.setTimeout(next, ok ? 430 : 650);
        }, { once: true });
      });
    }
    next();
  }

  function mountWordBuilderGame(stage) {
    const words = ["APPLE", "WATER", "SMILE", "PLANET", "SCHOOL", "FLOWER", "TIGER"];
    const word = randomFrom(words);
    const lettersToTap = shuffle(word.split(""));
    let built = "";
    stage.innerHTML = `
      <div class="question-panel">
        <p class="question-subtext">Build the word</p>
        <h2 class="question-text" id="builtWord">${word.split("").map(() => "_").join(" ")}</h2>
        <div class="answer-grid">
          ${lettersToTap.map((letter, index) => `<button class="answer-button" type="button" data-index="${index}" data-value="${letter}">${letter}</button>`).join("")}
        </div>
      </div>
    `;
    stage.querySelectorAll(".answer-button").forEach((button) => {
      button.addEventListener("click", () => {
        if (button.disabled) return;
        const expected = word[built.length];
        const ok = button.dataset.value === expected;
        markAnswer(stage, button, ok);
        if (!ok) return;
        button.disabled = true;
        built += expected;
        document.getElementById("builtWord").textContent = built.split("").join(" ") + " " + word.slice(built.length).split("").map(() => "_").join(" ");
        setText("gameScore", built.length);
        if (built === word) window.setTimeout(() => finishGame("wordBuilder", 90, 7, `${word} built correctly.`), 500);
      });
    });
    setText("gameTime", "∞");
  }

  function mountPatternGame(stage) {
    const patterns = [
      { prompt: ["🔴", "🔵", "🔴", "🔵"], answer: "🔴", options: ["🔴", "🔵", "🟡", "🟢"] },
      { prompt: ["1", "2", "3", "4"], answer: "5", options: ["4", "5", "6", "7"] },
      { prompt: ["▲", "■", "▲", "■"], answer: "▲", options: ["▲", "■", "●", "◆"] },
      { prompt: ["2", "4", "6", "8"], answer: "10", options: ["9", "10", "11", "12"] }
    ];
    let round = 0;
    let correctCount = 0;
    function next() {
      round += 1;
      if (round > 6) {
        finishGame("patternGame", correctCount * 12, 3 + correctCount, `${correctCount} patterns solved.`);
        return;
      }
      const pattern = randomFrom(patterns);
      setText("gameTime", `${round}/6`);
      stage.innerHTML = `
        <div class="question-panel">
          <p class="question-subtext">Complete the pattern</p>
          <h2 class="question-text">${pattern.prompt.join(" ")} ?</h2>
          <div class="answer-grid">
            ${shuffle(pattern.options).map((option) => `<button class="answer-button" type="button" data-value="${option}">${option}</button>`).join("")}
          </div>
        </div>
      `;
      stage.querySelectorAll(".answer-button").forEach((button) => {
        button.addEventListener("click", () => {
          const ok = button.dataset.value === pattern.answer;
          if (ok) correctCount += 1;
          setText("gameScore", correctCount);
          markAnswer(stage, button, ok);
          window.setTimeout(next, 560);
        }, { once: true });
      });
    }
    next();
  }

  function mountSpeedTapGame(stage) {
    let taps = 0;
    let running = true;
    const start = performance.now();
    const duration = 10_000;
    let raf = 0;

    stage.innerHTML = `
      <div class="question-panel">
        <p class="question-subtext">${escapeHtml(l10n({ en: "Tap the button fast", hi: "बटन तेज़ी से टैप करें" }))}</p>
        <button class="speed-target" id="speedTarget" type="button">0</button>
      </div>
    `;

    document.getElementById("speedTarget").addEventListener("click", () => {
      taps += 1;
      setText("gameScore", taps);
      document.getElementById("speedTarget").textContent = taps;
      playSound("tap");
      vibrate(12);
    });

    function loop(now) {
      if (!running) return;
      const remaining = Math.max(0, duration - (now - start));
      setText("gameTime", (remaining / 1000).toFixed(1));
      if (remaining <= 0) {
        finishGame("speedTap", taps * 5, Math.max(4, Math.min(10, Math.floor(taps / 5))), l10n({ en: `${taps} speedy taps.`, hi: `${taps} तेज़ टैप।` }));
        return;
      }
      raf = window.requestAnimationFrame(loop);
    }
    raf = window.requestAnimationFrame(loop);
    addCleanup(() => {
      running = false;
      window.cancelAnimationFrame(raf);
    });
  }

  function getEngineQuestion(category, round, totalRounds, gameId) {
    const engine = window.KidsQuizEngine;
    if (!engine || typeof engine.next !== "function") return null;
    try {
      const question = engine.next(category, progress, {
        age: state.age,
        round,
        totalRounds,
        gameId,
        lang: progress.settings.lang
      });
      saveProgress();
      return normalizeQuestion(question, category);
    } catch (error) {
      console.warn("Quiz engine fallback used", category, error);
      return null;
    }
  }

  function normalizeQuestion(question, fallbackCaption) {
    const answer = String(question.answer);
    const options = Array.from(new Set((question.options || []).map(String)));
    if (!options.includes(answer)) options.unshift(answer);
    return {
      ...question,
      answer,
      caption: question.caption || fallbackCaption || "Quiz",
      options: shuffle(options).slice(0, 4)
    };
  }

  function makeEngineQuestion(category) {
    return (round, totalRounds, gameId) => (
      getEngineQuestion(category, round, totalRounds, gameId) || makeFallbackQuestion(category)
    );
  }

  function makeMixedEngineQuestion(categories) {
    return (round, totalRounds, gameId) => {
      const category = categories[(round - 1) % categories.length] || randomFrom(categories);
      return getEngineQuestion(category, round, totalRounds, gameId) || makeFallbackQuestion(category);
    };
  }

  function makeFallbackQuestion(category) {
    const item = randomFrom(alphabet);
    const options = shuffle([item[1], ...shuffle(alphabet.filter((letter) => letter !== item)).slice(0, 3).map((letter) => letter[1])]);
    return {
      prompt: `What starts with ${item[0]}?`,
      promptHi: `${item[0]} se kya shuru hota hai?`,
      speak: `What starts with ${item[0]}?`,
      caption: category || "Quiz",
      options,
      answer: item[1]
    };
  }

  function mountQuestionGame(stage, questionFactory, totalRounds, gameId) {
    let round = 0;
    let correct = 0;

    function next() {
      round += 1;
      if (round > totalRounds) {
        finishGame(gameId, correct * 18, Math.max(3, correct + 2), l10n({ en: `${correct} correct answers.`, hi: `${correct} सही जवाब।` }));
        return;
      }
      const question = normalizeQuestion(questionFactory(round, totalRounds, gameId), "Quiz");
      setText("gameTime", `${round}/${totalRounds}`);
      setText("gameScore", correct);
      speak(question.speak || question.prompt, question.hiSpeak || question.promptHi);
      const bankInfo = question.bankSize
        ? `<span class="quiz-bank-pill">${question.remaining} left in bank</span>`
        : "";
      stage.innerHTML = `
        <div class="question-panel">
          <p class="question-subtext">${escapeHtml(question.caption || "")} ${bankInfo}</p>
          <h2 class="question-text">${escapeHtml(progress.settings.lang === "hi" && question.promptHi ? question.promptHi : question.prompt)}</h2>
          <div class="answer-grid">
            ${question.options.map((option) => `<button class="answer-button" data-value="${escapeHtml(option)}" type="button">${escapeHtml(option)}</button>`).join("")}
          </div>
        </div>
      `;
      let answered = false;
      stage.querySelectorAll(".answer-button").forEach((button) => {
        button.addEventListener("click", () => {
          if (answered) return;
          answered = true;
          stage.querySelectorAll(".answer-button").forEach((item) => {
            item.disabled = true;
            if (item.dataset.value === String(question.answer)) item.classList.add("correct");
          });
          const ok = button.dataset.value === String(question.answer);
          if (ok) correct += 1;
          markAnswer(stage, button, ok);
          window.setTimeout(next, 680);
        });
      });
    }
    next();
  }

  function makeMathQuestion(round, totalRounds, gameId) {
    const engineQuestion = getEngineQuestion("Numbers", round, totalRounds, gameId);
    if (engineQuestion) return engineQuestion;
    const first = 2 + Math.floor(Math.random() * 18);
    const second = 1 + Math.floor(Math.random() * 12);
    const add = Math.random() > 0.35;
    const a = add ? first : Math.max(first, second);
    const b = add ? second : Math.min(first, second);
    const answer = add ? a + b : a - b;
    const options = shuffle([answer, answer + 1, answer - 1, answer + 3]).map(String);
    return {
      prompt: `${a} ${add ? "+" : "-"} ${b}`,
      promptHi: `${a} ${add ? "+" : "-"} ${b}`,
      speak: add ? `What is ${a} plus ${b}?` : `What is ${a} minus ${b}?`,
      hiSpeak: `${a} ${add ? "जोड़" : "घटाना"} ${b}`,
      caption: l10n({ en: "Solve", hi: "हल करें" }),
      options,
      answer: String(answer)
    };
  }

  function makeSpellingQuestion(round, totalRounds, gameId) {
    const engineQuestion = getEngineQuestion("Basic English Vocabulary", round, totalRounds, gameId);
    if (engineQuestion) return engineQuestion;
    const words = ["APPLE", "TIGER", "WATER", "HOUSE", "SMILE", "PLANET", "SCHOOL", "FLOWER"];
    const word = randomFrom(words);
    const index = 1 + Math.floor(Math.random() * (word.length - 2));
    const answer = word[index];
    const prompt = `${word.slice(0, index)} _ ${word.slice(index + 1)}`;
    const letters = shuffle([answer, "A", "E", "O", "T", "R", "S"].filter((letter, i, arr) => arr.indexOf(letter) === i)).slice(0, 4);
    if (!letters.includes(answer)) letters[0] = answer;
    return {
      prompt,
      speak: `Choose the missing letter in ${word}`,
      caption: l10n({ en: "Missing letter", hi: "गुम अक्षर" }),
      options: shuffle(letters),
      answer
    };
  }

  function makeGkQuestion(round, totalRounds, gameId) {
    const engineQuestion = getEngineQuestion("General Knowledge", round, totalRounds, gameId);
    if (engineQuestion) return engineQuestion;
    const questions = [
      { prompt: "Which planet do we live on?", promptHi: "हम किस ग्रह पर रहते हैं?", answer: "Earth", options: ["Earth", "Mars", "Moon", "Sun"] },
      { prompt: "How many days are in a week?", promptHi: "एक सप्ताह में कितने दिन होते हैं?", answer: "7", options: ["5", "6", "7", "8"] },
      { prompt: "Which animal gives us milk?", promptHi: "कौन सा जानवर दूध देता है?", answer: "Cow", options: ["Cow", "Lion", "Tiger", "Fish"] },
      { prompt: "What color is the sun often drawn?", promptHi: "सूरज को आमतौर पर किस रंग से बनाते हैं?", answer: "Yellow", options: ["Blue", "Yellow", "Purple", "Black"] },
      { prompt: "Which shape has three sides?", promptHi: "किस आकार की तीन भुजाएँ होती हैं?", answer: "Triangle", options: ["Circle", "Square", "Triangle", "Star"] }
    ];
    return addCaption(randomFrom(questions));
  }

  function addCaption(question) {
    return {
      ...question,
      caption: l10n({ en: "General knowledge", hi: "सामान्य ज्ञान" }),
      options: shuffle(question.options)
    };
  }

  function makeLogicQuestion(round, totalRounds, gameId) {
    const engineQuestion = getEngineQuestion("Logic", round, totalRounds, gameId);
    if (engineQuestion) return engineQuestion;
    const patterns = [
      { prompt: "🔴 🔵 🔴 🔵 ?", answer: "🔴", options: ["🔴", "🔵", "🟡", "🟢"] },
      { prompt: "1 2 3 4 ?", answer: "5", options: ["4", "5", "6", "7"] },
      { prompt: "▲ ■ ▲ ■ ?", answer: "▲", options: ["▲", "■", "●", "◆"] },
      { prompt: "2 4 6 8 ?", answer: "10", options: ["9", "10", "11", "12"] },
      { prompt: "☀️ 🌙 ☀️ 🌙 ?", answer: "☀️", options: ["☀️", "🌙", "⭐", "☁️"] }
    ];
    const question = randomFrom(patterns);
    return {
      ...question,
      caption: l10n({ en: "Finish the pattern", hi: "पैटर्न पूरा करें" }),
      options: shuffle(question.options)
    };
  }

  function makeBrainQuestion(round, totalRounds, gameId) {
    const engineQuestion = getEngineQuestion("Brain Challenge", round, totalRounds, gameId);
    if (engineQuestion) return engineQuestion;
    const left = 2 + Math.floor(Math.random() * 5);
    const right = left + 2;
    const answer = right;
    return randomFrom([
      {
        prompt: `Which is bigger: ${left} or ${right}?`,
        promptHi: `कौन बड़ा है: ${left} या ${right}?`,
        answer: String(answer),
        options: shuffle([String(left), String(right), String(left - 1), String(right + 1)]),
        caption: l10n({ en: "Brain challenge", hi: "ब्रेन चैलेंज" })
      },
      {
        prompt: "What comes after C?",
        promptHi: "C के बाद क्या आता है?",
        answer: "D",
        options: shuffle(["A", "B", "D", "F"]),
        caption: l10n({ en: "Brain challenge", hi: "ब्रेन चैलेंज" })
      },
      {
        prompt: "Find the odd one: 🍎 🍎 🚗 🍎",
        promptHi: "अलग चीज़ ढूँढें: 🍎 🍎 🚗 🍎",
        answer: "🚗",
        options: shuffle(["🍎", "🚗", "🍌", "⭐"]),
        caption: l10n({ en: "Brain challenge", hi: "ब्रेन चैलेंज" })
      }
    ]);
  }

  function claimDailyReward() {
    if (progress.daily.lastReward === todayKey()) return;
    progress.daily.lastReward = todayKey();
    progress.daily.streak += 1;
    awardStars(3, 15, "dailyReward");
    render();
    playSound("win");
  }

  function startDailyChallenge() {
    const byAge = {
      "1-3": randomFrom(["shapeMatch", "colorMatch", "animalSoundGuess", "pictureQuiz", "traceAlphabet"]),
      "4-6": randomFrom(["balloon", "counting", "shapeMatch", "memory", "fruitCatcher", "letterHunt", "patternGame"]),
      "7-8": randomFrom(["math", "logic", "speedTap", "spelling", "megaQuiz", "worldQuiz", "wordBuilder"])
    };
    startGame(byAge[state.age] || "balloon", true);
  }

  function showConfetti() {
    const confetti = document.createElement("div");
    confetti.className = "confetti";
    const colors = ["#ffd166", "#67d7ff", "#64d66e", "#ff5d8f", "#8b5cf6", "#ff9f1c"];
    confetti.innerHTML = Array.from({ length: 46 }, (_, index) => `
      <i style="left:${Math.random() * 100}%;background:${colors[index % colors.length]};animation-delay:${Math.random() * 0.45}s"></i>
    `).join("");
    document.body.appendChild(confetti);
    window.setTimeout(() => confetti.remove(), 1900);
  }

  document.addEventListener("click", (event) => {
    const target = event.target.closest("[data-action]");
    if (!target) return;
    const action = target.dataset.action;
    playSound("tap");

    if (action === "nav") {
      navigate(target.dataset.screen || "home");
    }
    if (action === "set-age") {
      state.age = target.dataset.age || state.age;
      progress.settings.age = state.age;
      state.learnCategory = "";
      saveProgress();
      render();
    }
    if (action === "learn-category") {
      state.learnCategory = target.dataset.category || state.learnCategory;
      render();
    }
    if (action === "learn-card") {
      handleLearnCard(Number(target.dataset.index));
    }
    if (action === "start-game") {
      startGame(target.dataset.game);
    }
    if (action === "parent-answer") {
      if (Number(target.dataset.answer) === 12) {
        state.parentUnlocked = true;
        playSound("good");
        render();
      } else {
        target.classList.add("wrong");
        playSound("bad");
      }
    }
    if (action === "set-lang") {
      progress.settings.lang = target.dataset.lang || "en";
      saveProgress();
      render();
    }
    if (action === "toggle-muted") {
      progress.settings.muted = !progress.settings.muted;
      if (progress.settings.muted) window.clearInterval(musicTimer);
      saveProgress();
      updateMusic();
      render();
    }
    if (action === "toggle-music") {
      progress.settings.music = !progress.settings.music;
      saveProgress();
      updateMusic();
      render();
    }
    if (action === "claim-daily") {
      claimDailyReward();
    }
    if (action === "start-daily") {
      startDailyChallenge();
    }
    if (action === "cloud-sync") {
      if (hasNative()) {
        try {
          window.AndroidBridge.requestCloudProgress();
        } catch (error) {
          console.warn("Cloud sync unavailable", error);
        }
      }
    }
    if (action === "reset-progress") {
      const ok = window.confirm("Reset all local progress?");
      if (!ok) return;
      progress = clone(defaultProgress);
      state.age = progress.settings.age;
      localStorage.removeItem(STORAGE_KEY);
      if (hasNative()) {
        try { window.AndroidBridge.clearProgress(); } catch (error) { console.warn(error); }
      }
      saveProgress();
      render();
    }
  });

  window.KidsNativeBridge = {
    onFirebaseStatus(raw) {
      state.nativeStatus = typeof raw === "string" ? safeJson(raw) : raw || {};
      render();
    },
    onDrawingUploaded(raw) {
      const payload = typeof raw === "string" ? safeJson(raw) : raw || {};
      if (payload.ok) {
        progress.drawings[0] = { ...(progress.drawings[0] || {}), cloudUrl: payload.url };
        saveProgress();
      }
    }
  };

  window.KidsApp = {
    receiveCloudProgress(raw) {
      const cloud = safeJson(raw);
      if (!Object.keys(cloud).length) return;
      const localStars = progress.stars;
      const localScore = progress.score;
      deepMerge(progress, cloud);
      progress.stars = Math.max(progress.stars || 0, localStars);
      progress.score = Math.max(progress.score || 0, localScore);
      progress.settings = { ...defaultProgress.settings, ...(progress.settings || {}) };
      saveProgress();
      render();
    }
  };

  if ("serviceWorker" in navigator && (location.protocol === "http:" || location.protocol === "https:")) {
    navigator.serviceWorker.register("./sw.js").catch((error) => console.warn("Service worker skipped", error));
  }

  if (hasNative()) {
    try {
      state.nativeStatus = safeJson(window.AndroidBridge.getStatus());
      window.AndroidBridge.requestCloudProgress();
    } catch (error) {
      console.warn("Native status unavailable", error);
    }
  }

  updateMusic();
  window.setTimeout(render, 450);
})();
