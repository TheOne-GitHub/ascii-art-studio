// Curated, column-aligned ASCII & Unicode Art Vault
(function (root) {
  const CATEGORIES = [
    { id: "all", label: "All Vault", icon: "◈" },
    { id: "flowers", label: "Flowers", icon: "❀" },
    { id: "eyes", label: "Eyes", icon: "◉" },
    { id: "bears", label: "Teddy & Cute", icon: "ʕ•ᴥ•ʔ" },
    { id: "chess", label: "Chess", icon: "♞" },
    { id: "aesthetic", label: "Aesthetic & Vibes", icon: "✦" }
  ];

  const ART_VAULT = [
  {
    "id": "flower-rose",
    "title": "Long-Stem Rose",
    "category": "flowers",
    "tags": [
      "rose",
      "flower",
      "romantic",
      "classic",
      "stem",
      "petals"
    ],
    "art": "           _.._           \n         .' .-'`          \n        /  /  _.._        \n       |  | .'    '.      \n       \\  \\ |  ()  |      \n        '._`'.____.'      \n           `--.___.'      \n              \\|/         \n               |   _      \n          _   /|  / )     \n         ( \\ / | / /      \n          \\ \\| |/ /       \n           '-|-'         \n             |  ,         \n             | /          \n             |/           \n             |            "
  },
  {
    "id": "flower-lotus",
    "title": "Blooming Lotus",
    "category": "flowers",
    "tags": [
      "lotus",
      "flower",
      "zen",
      "water",
      "petals",
      "calm"
    ],
    "art": "             /\\             \n            /  \\            \n       /\\  / /\\ \\  /\\       \n      /  \\/ /  \\ \\/  \\      \n  /\\ / /\\ \\|    |/ /\\ \\ /\\  \n /  \\ /  \\ \\    / /  \\ /  \\ \n|    \\    \\ \\  / /    /    |\n \\    '.   '.\\/.'   .'    / \n  '._   '._  \\/  _.'   _.'  \n     '._   '----'   _.'     \n   ~ ~ ~'----------'~ ~ ~   \n     ~   ~   ~~   ~   ~     "
  },
  {
    "id": "flower-bouquet",
    "title": "Flower Bouquet",
    "category": "flowers",
    "tags": [
      "bouquet",
      "flowers",
      "gift",
      "ribbon",
      "cute"
    ],
    "art": "        _.-._        \n      .' (@) '.      \n   _.-\\  '-'  /-._   \n .' (@)'.   .'(@) '. \n \\  '-'  \\ /  '-'  / \n  '._  \\  |  /  _.'  \n     \\  \\ | /  /     \n      \\  \\|/  /      \n       \\  |  /       \n       _\\_|_/_       \n      (  ===  )      \n       ' /|\\ '       \n        / | \\        \n       /  |  \\       \n      '   '   '      "
  },
  {
    "id": "flower-tulip",
    "title": "Spring Tulip",
    "category": "flowers",
    "tags": [
      "tulip",
      "flower",
      "spring",
      "minimal",
      "garden"
    ],
    "art": "      /\\  /\\  /\\      \n     |  \\/  \\/  |     \n     |  |\\  /|  |     \n     |  | \\/ |  |     \n      \\  \\  /  /      \n       '.____.'       \n          ||          \n     __   ||   __     \n    /  \\  ||  /  \\    \n   |    \\ || /    |   \n    \\    \\||/    /    \n     '._  ||  _.'     \n        '\\||/'        \n          ||          "
  },
  {
    "id": "flower-sunflower",
    "title": "Radiant Sunflower",
    "category": "flowers",
    "tags": [
      "sunflower",
      "flower",
      "summer",
      "bright",
      "yellow"
    ],
    "art": "         \\  |  /         \n       \\ .--^--. /       \n      --/ .:::. \\--      \n    -- | ::###:: | --    \n      --\\ ':::' /--      \n       / '--v--' \\       \n         /  |  \\         \n            |            \n         _  |            \n        ( \\ |  _         \n         \\ \\| / )        \n          '-|-'          \n            |            \n           /|\\           "
  },
  {
    "id": "flower-sakura",
    "title": "Sakura Branch",
    "category": "flowers",
    "tags": [
      "sakura",
      "cherry blossom",
      "flower",
      "japan",
      "aesthetic",
      "branch"
    ],
    "art": "        .  *   (❀)     *      \n             \\  |  /          \n    (✿)       \\ | /   (✿)     \n     \\  .--._  \\|/  .-'       \n======'======'==*=='          \n           /     \\  *         \n     *    /  (❀)  \\      .    \n         /         '-.        \n   .    (✿)       *   (❀)     \n              .               \n        *          .    *     "
  },
  {
    "id": "eye-detailed",
    "title": "Detailed Shaded Eye",
    "category": "eyes",
    "tags": [
      "eye",
      "realistic",
      "shaded",
      "gaze",
      "classic"
    ],
    "art": "             _..----.._             \n          .-'  _...._  '-.          \n       .-'  .-'░▒▓█▓▒'-.  '-.       \n     .'   .' ░▒▓█  █▓▒░ '.   '.     \n    <    |  ░▒▓█ () █▓▒░  |    >    \n     '.   '. ░▒▓████▓▒░ .'   .'     \n       '-.  '-._░▒▓▒_.-'  .-'       \n          '-._        _.-'          \n              ''----''              "
  },
  {
    "id": "eye-anime",
    "title": "Anime Sparkle Eye",
    "category": "eyes",
    "tags": [
      "eye",
      "anime",
      "manga",
      "sparkle",
      "aesthetic"
    ],
    "art": "        ▄▄████████████▄▄        \n     ▄██▀▀▀          ▀▀▀██▄     \n   ▄█▀    ▄▄████████▄▄    ▀█    \n  █▀    ▄██▀  ▄▄  ▀███▄         \n       ███   ████   ████        \n      ▐███  ▐████▌  ████▌       \n      ▐███   ▀██▀ ▄ ████▌       \n       ▀███▄  ▀▀ ▀▀▄███▀        \n         ▀▀██████████▀▀         \n       ▀▄▄            ▄▄▀       \n           ▀▀▀▀▀▀▀▀▀▀           "
  },
  {
    "id": "eye-crying",
    "title": "Crying Eye",
    "category": "eyes",
    "tags": [
      "eye",
      "crying",
      "tear",
      "sad",
      "emo",
      "aesthetic"
    ],
    "art": "           _.--------._           \n        .-'  .------.  '-.        \n      .'   .' ░▒██▒░ '.   '.      \n     <    |  ░▒█()█▒░  |    >     \n      '.   '. ░▒██▒░ .'   .'      \n        '-._ '------' _.-'        \n           /`--------'            \n          /  |                    \n         |  ()                    \n          \\  /                    \n           \\/                     \n            o                     "
  },
  {
    "id": "eye-starry",
    "title": "Starry Galaxy Eye",
    "category": "eyes",
    "tags": [
      "eye",
      "stars",
      "galaxy",
      "cosmic",
      "dreamy"
    ],
    "art": "            ✦    .    ✧            \n        _.--============--._       \n     .-'    .-'      '-.    '-.    \n   .'     .'  ✦  .  ✧   '.     '.  \n  <      |  .   ★  *   .  |      > \n   '.     '.  ✧  .  ✦   .'     .'  \n     '-._   '-._    _.-'   _.-'    \n         '--.__======__.--'        \n            .    ✧    ✦            "
  },
  {
    "id": "eye-winking",
    "title": "Winking Eyes",
    "category": "eyes",
    "tags": [
      "eye",
      "wink",
      "cute",
      "playful",
      "face"
    ],
    "art": "    _.------._              _.._    \n  .'  .----.  '.          .'    '.  \n <   ( ▓██▓ )   >        /  .--.  \\ \n  '.  '----'  .'        '  '    '  '\n    '--------'                      \n                \\___/               "
  },
  {
    "id": "bear-heart",
    "title": "Teddy Bear Holding Heart",
    "category": "bears",
    "tags": [
      "teddy",
      "bear",
      "heart",
      "love",
      "cute",
      "plush"
    ],
    "art": "      .--.       .--.      \n     ( () )-----( () )     \n      \\  .'     '.  /      \n       |'  ●   ●  '|       \n       |    (_)    |       \n        \\   '-'   /        \n       .-'-.   .-'-.       \n      /  / .---. \\  \\      \n     |  ( ( ♥♥♥ ) )  |     \n      \\  \\ '---' /  /      \n       '-.'     '.-'       \n        /  /   \\  \\        \n       (__/     \\__)       "
  },
  {
    "id": "bear-classic",
    "title": "Classic Teddy Bear",
    "category": "bears",
    "tags": [
      "teddy",
      "bear",
      "classic",
      "cute",
      "fluffy"
    ],
    "art": "       _         _       \n     _( )_______( )_     \n    (_  .'     '.  _)    \n      |'  ●   ●  '|      \n      |   .---.   |      \n      |  (  Y  )  |      \n       \\  '---'  /       \n      .-'._____.'-.      \n     / /  .---.  \\ \\     \n    ( (  /     \\  ) )    \n     \\_\\ |     | /_/     \n        \\'-----'/        \n        /  / \\  \\        \n       (__/   \\__)       "
  },
  {
    "id": "bear-sleepy",
    "title": "Sleepy Bear",
    "category": "bears",
    "tags": [
      "bear",
      "sleepy",
      "nap",
      "zzz",
      "cozy",
      "cute"
    ],
    "art": "                   z  Z  \n                z        \n      .--.   .--.        \n     ( () )-( () )       \n      \\ .'   '. /        \n      |' -   - '|        \n      |   (_)   |        \n      \\   '-'   /        \n     .-'-------'-.       \n    /  /  ~~~  \\  \\      \n   (__/_________\\__)     "
  },
  {
    "id": "cute-bunny",
    "title": "Cute Bunny",
    "category": "bears",
    "tags": [
      "bunny",
      "rabbit",
      "cute",
      "kawaii",
      "animal"
    ],
    "art": "       /\\   /\\     \n      |  | |  |    \n      |  | |  |    \n      |  | |  |    \n     .'  '-'  '.   \n    /  ●     ●  \\  \n   (  ==  Y  ==  ) \n    '.   '-'   .'  \n     /'-------'\\   \n    (  |     |  )o \n     '-'-----'-'   "
  },
  {
    "id": "cute-cat",
    "title": "Cozy Sitting Cat",
    "category": "bears",
    "tags": [
      "cat",
      "kitty",
      "cute",
      "pet",
      "meow"
    ],
    "art": "      /\\_____/\\      \n     /  o   o  \\     \n    ( ==  ^  == )    \n     )         (     \n    (           )    \n   ( (  )   (  ) )   \n  (__(__)___(__)__)  \n                  )) \n                 //  \n                ((   "
  },
  {
    "id": "cute-frog",
    "title": "Happy Chibi Frog",
    "category": "bears",
    "tags": [
      "frog",
      "cute",
      "chibi",
      "pond",
      "meme"
    ],
    "art": "       _       _       \n      (●)_____(●)      \n    .-'         '-.    \n   /   \\_______/   \\   \n  |                 |  \n   \\   .-------.   /   \n  .-' /         \\ '-.  \n /___/           \\___\\ \n ^ ^               ^ ^ "
  },
  {
    "id": "chess-board",
    "title": "Starting Chessboard",
    "category": "chess",
    "tags": [
      "chess",
      "board",
      "game",
      "pieces",
      "unicode",
      "strategy"
    ],
    "art": "    a   b   c   d   e   f   g   h  \n  ┌───┬───┬───┬───┬───┬───┬───┬───┐\n8 │ ♜ │ ♞ │ ♝ │ ♛ │ ♚ │ ♝ │ ♞ │ ♜ │ 8\n  ├───┼───┼───┼───┼───┼───┼───┼───┤\n7 │ ♟ │ ♟ │ ♟ │ ♟ │ ♟ │ ♟ │ ♟ │ ♟ │ 7\n  ├───┼───┼───┼───┼───┼───┼───┼───┤\n6 │   │ ░ │   │ ░ │   │ ░ │   │ ░ │ 6\n  ├───┼───┼───┼───┼───┼───┼───┼───┤\n5 │ ░ │   │ ░ │   │ ░ │   │ ░ │   │ 5\n  ├───┼───┼───┼───┼───┼───┼───┼───┤\n4 │   │ ░ │   │ ░ │   │ ░ │   │ ░ │ 4\n  ├───┼───┼───┼───┼───┼───┼───┼───┤\n3 │ ░ │   │ ░ │   │ ░ │   │ ░ │   │ 3\n  ├───┼───┼───┼───┼───┼───┼───┼───┤\n2 │ ♙ │ ♙ │ ♙ │ ♙ │ ♙ │ ♙ │ ♙ │ ♙ │ 2\n  ├───┼───┼───┼───┼───┼───┼───┼───┤\n1 │ ♖ │ ♘ │ ♗ │ ♕ │ ♔ │ ♗ │ ♘ │ ♖ │ 1\n  └───┴───┴───┴───┴───┴───┴───┴───┘\n    a   b   c   d   e   f   g   h  "
  },
  {
    "id": "chess-king",
    "title": "Chess King",
    "category": "chess",
    "tags": [
      "chess",
      "king",
      "royal",
      "piece",
      "checkmate"
    ],
    "art": "         _+_         \n        |_ _|        \n          |          \n       .='='=.       \n      (  ___  )      \n       \\     /       \n        |   |        \n        |   |        \n       /     \\       \n     .'_______'.     \n    [___________]    "
  },
  {
    "id": "chess-queen",
    "title": "Chess Queen",
    "category": "chess",
    "tags": [
      "chess",
      "queen",
      "crown",
      "piece"
    ],
    "art": "      o   o   o      \n      |\\ /|\\ /|      \n       \\  |  /       \n       (=====)       \n        \\   /        \n        |   |        \n        |   |        \n       /     \\       \n     .'_______'.     \n    [___________]    "
  },
  {
    "id": "chess-rook",
    "title": "Chess Rook",
    "category": "chess",
    "tags": [
      "chess",
      "rook",
      "castle",
      "tower",
      "piece"
    ],
    "art": "     _   _   _       \n    | |_| |_| |      \n    |_________|      \n     \\_______/       \n      |     |        \n      |     |        \n      |     |        \n     /_______\\       \n    [_________]      "
  },
  {
    "id": "chess-bishop",
    "title": "Chess Bishop",
    "category": "chess",
    "tags": [
      "chess",
      "bishop",
      "diagonal",
      "piece"
    ],
    "art": "          o          \n        .' '.        \n       /  /  \\       \n      |  /    |      \n       \\_____/       \n       (=====)       \n        |   |        \n       /     \\       \n     .'_______'.     \n    [___________]    "
  },
  {
    "id": "chess-knight",
    "title": "Chess Knight",
    "category": "chess",
    "tags": [
      "chess",
      "knight",
      "horse",
      "piece",
      "fork"
    ],
    "art": "        ,/|          \n      .'  '\\         \n    .'  ●   '\\       \n   /          |\\     \n  (___.-'  /  ||     \n         .'   ||     \n        /     |/     \n       /______\\      \n     .'________'.    \n    [____________]   "
  },
  {
    "id": "chess-pawn",
    "title": "Chess Pawn",
    "category": "chess",
    "tags": [
      "chess",
      "pawn",
      "piece",
      "opening"
    ],
    "art": "         ___         \n        /   \\        \n        \\___/        \n       (=====)       \n        |   |        \n       /     \\       \n     .'_______'.     \n    [___________]    "
  },
  {
    "id": "vibe-heart",
    "title": "Shaded Pixel Heart",
    "category": "aesthetic",
    "tags": [
      "heart",
      "love",
      "pixel",
      "block",
      "aesthetic"
    ],
    "art": "    ▄▄███▄▄     ▄▄███▄▄    \n  ▄███▓▓▓███▄ ▄███▓▓▓███▄  \n ▐██▓▒░░░▒▓█████▓▒░░░▒▓██▌ \n ▐██▓░   ░▒▓███▓▒░   ░▓██▌ \n  ▀██▓▒░ ░▒▓███▓▒░ ░▒▓██▀  \n    ▀██▓▒░▒▓███▓▒░▒▓██▀    \n      ▀██▓▒▓███▓▒▓██▀      \n        ▀██▓███▓██▀        \n          ▀█████▀          \n            ▀█▀            "
  },
  {
    "id": "vibe-butterfly",
    "title": "Monarch Butterfly",
    "category": "aesthetic",
    "tags": [
      "butterfly",
      "wings",
      "nature",
      "aesthetic",
      "bio"
    ],
    "art": "    _..---.._   \\ /   _..---.._    \n  .'  .---.  '.  |  .'  .---.  '.  \n /  .' ░▒░ '.  \\( )/  .' ░▒░ '.  \\ \n|  |  ░▒▓▒░  |  | |  |  ░▒▓▒░  |  |\n \\  '. ░▒░ .'  / | \\  '. ░▒░ .'  / \n  '._ '---' _.'  |  '._ '---' _.'  \n    .' .-. '.    |    .' .-. '.    \n   /  ( ░ )  \\   |   /  ( ░ )  \\   \n   '._ '-' _.'   v   '._ '-' _.'   \n      '---'             '---'      "
  },
  {
    "id": "vibe-crown",
    "title": "Royal Crown",
    "category": "aesthetic",
    "tags": [
      "crown",
      "king",
      "queen",
      "royalty",
      "gold",
      "flex"
    ],
    "art": "             ★             \n     ✦      /|\\      ✦     \n     |\\    / | \\    /|     \n     | \\  /  |  \\  / |     \n     |  \\/   |   \\/  |     \n     |  ◆    ◆    ◆  |     \n     |_______________|     \n     [===============]     "
  },
  {
    "id": "vibe-sword",
    "title": "Fantasy Blade",
    "category": "aesthetic",
    "tags": [
      "sword",
      "blade",
      "knight",
      "rpg",
      "fantasy",
      "weapon"
    ],
    "art": "            /\\            \n           /  \\           \n           |::|           \n           |::|           \n           |::|           \n           |::|           \n           |::|           \n      _____|::|_____      \n     (=====|  |=====)     \n           |##|           \n           |##|           \n           (♦♦)           "
  },
  {
    "id": "vibe-skull",
    "title": "Classic Skull",
    "category": "aesthetic",
    "tags": [
      "skull",
      "spooky",
      "goth",
      "edgy",
      "retro"
    ],
    "art": "        _.--------._        \n      .'            '.      \n     /   ___    ___   \\     \n    |   /███\\  /███\\   |    \n    |   \\███/  \\███/   |    \n     \\       /\\       /     \n      '.    /__\\    .'      \n        |  _    _  |        \n        |_| |__| |_|        \n         '--'--'--'         "
  },
  {
    "id": "vibe-moon",
    "title": "Crescent Moon & Stars",
    "category": "aesthetic",
    "tags": [
      "moon",
      "stars",
      "night",
      "sky",
      "dream",
      "aesthetic"
    ],
    "art": "        .    ✦      _..---.     \n   ✧             .-'    _.'     \n        ★      .'    .-'    .   \n              /    .'   ✦       \n     .       |    |        ✧    \n             |    |   ★         \n              \\    '.     .     \n    ✦          '.    '-.        \n          .      '-._   '-.  ✧  \n                     ''---'     "
  },
  {
    "id": "vibe-music",
    "title": "Music Notes & Beat",
    "category": "aesthetic",
    "tags": [
      "music",
      "notes",
      "audio",
      "song",
      "vibes",
      "beats"
    ],
    "art": "           ___________      ♪   \n          |  _______  |         \n     ♪    | |       | |         \n          | |       | |    ♫    \n          | |       | |         \n      ____| |   ____| |         \n     (██████)  (██████)         \n      ▀▀▀▀▀▀    ▀▀▀▀▀▀          \n  ▁ ▂ ▄ ▆ █ ▆ ▄ ▂ ▅ ▇ █ ▅ ▃ ▁  "
  },
  {
    "id": "vibe-dividers",
    "title": "Aesthetic Dividers Pack",
    "category": "aesthetic",
    "tags": [
      "dividers",
      "bio",
      "discord",
      "lines",
      "stars",
      "sparkles"
    ],
    "art": "─── ･ ｡ﾟ☆: *.☽ .* :☆ﾟ. ───\n━━━━━━━ ★ ━━━━━━━\n✧･ﾟ: *✧･ﾟ:*   *:･ﾟ✧*:･ﾟ✧\n╔═══*.·:·.☽✧  ✦  ✧☾.·:·.*═══╗\n╰─▸ ❝ ────────────── ❞\n• ────── ✾ ────── •\n══✿══╡°˖✧✿✧˖°╞══✿══\n▓▓▓▓▓▓▓▓▓░░░░░░░ 60%"
  }
];

  root.ASCII_CATEGORIES = CATEGORIES;
  root.ASCII_ART_VAULT = ART_VAULT;
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = { CATEGORIES, ART_VAULT };
  }
})(typeof window !== 'undefined' ? window : globalThis);
