



// ストレート正常系
// 10, 11, 12, 13, 1のストレートになるか
dealtCards.allCards = [
    {"number":  1,"suit": "♠"},
    {"number":  1,"suit": "♥"},
    {"number":  2,"suit": "♥"},
    {"number": 10,"suit": "♣"},
    {"number": 11,"suit": "♥"},
    {"number": 12,"suit": "♠"},
    {"number": 13,"suit": "♥"}
];



// ストレートの判定誤り: ペアがカウントで2扱いとなっている。
// ⇒3, 4, 5, 6, 6のストレートになってしまう。
dealtCards.allCards = [
  {"number": 3,"suit": "♦"},
  {"number": 4,"suit": "♥"},
  {"number": 5,"suit": "♠"},
  {"number": 6,"suit": "♦"},
  {"number": 6,"suit": "♣"},
  {"number": 8,"suit": "♠"},
  {"number": 10,"suit": "♥"}
]


// ツーペア 正常系
dealtCards.allCards = [
  {"number": 1,"suit": "♠"},
  {"number": 2,"suit": "♥"},
  {"number": 7,"suit": "♥"},
  {"number": 8,"suit": "♠"},
  {"number": 8,"suit": "♦"},
  {"number": 13,"suit": "♥"},
  {"number": 13,"suit": "♦" }
]