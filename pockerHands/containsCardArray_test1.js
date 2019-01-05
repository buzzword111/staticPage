function containsCardArray(cardArray1, cardArray2) {
    if(!cardArray1 || !cardArray2) return false;
    if(!Array.isArray(cardArray1) || !Array.isArray(cardArray2)) return false;

    var smallArray = cardArray1.length < cardArray2.length ? cardArray1 : cardArray2;
    var largeArray = cardArray1.length < cardArray2.length ? cardArray2 : cardArray1;

    var containsCard = true;
    smallArray.forEach(function(card) {
        var hasSameCard = _.some(largeArray, function(largeArrayCard) {
            return JSON.stringify(largeArrayCard) === JSON.stringify(card);
        });
        if (!hasSameCard) {
          containsCard = false;
          return;
        }
    });
    return containsCard;
}

var allCards = [
  {"number":  1,"suit": "♠"},
  {"number":  1,"suit": "♥"},
  {"number":  2,"suit": "♥"},
  {"number": 10,"suit": "♣"},
  {"number": 11,"suit": "♥"},
  {"number": 12,"suit": "♠"},
  {"number": 13,"suit": "♥"}
];

var allCards2 = [
  {"number":  1,"suit": "♠"},
  {"number":  1,"suit": "♥"},
  {"number":  1,"suit": "♣"}, /* 上のallCardsから行追加 */
  {"number":  2,"suit": "♥"},
  {"number": 10,"suit": "♣"},
  {"number": 11,"suit": "♥"},
  {"number": 12,"suit": "♠"},
  {"number": 13,"suit": "♥"}
];

var allCards3 = [
  {"number":  1,"suit": "♠"},
  {"number":  7,"suit": "♥"},
  {"number":  8,"suit": "♣"},
  {"number":  9,"suit": "♥"},
  {"number": 10,"suit": "♠"},
  {"number": 10,"suit": "♥"},
  {"number": 11,"suit": "♠"}
];
console.log('containsCardArray(allCards, allCards) %O', containsCardArray(allCards, allCards));
console.log('containsCardArray(allCards, allCards2) %O', containsCardArray(allCards, allCards2));
console.log('containsCardArray(allCards2, allCards) %O', containsCardArray(allCards2, allCards));
console.log('containsCardArray(allCards, allCards3) %O', containsCardArray(allCards, allCards3));