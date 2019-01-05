var Pocker = Pocker || {
    /**
     * カードを配る
     * @return {
     *  holeCards: カード配列,
     *  communityCards: カード配列
     *  allCards: カード配列
     * }
     */
    dealCards: function() {
        // https://ja.wikipedia.org/wiki/%E3%82%B9%E3%83%BC%E3%83%88
        var suitArray = ['♠', '♣', '♦', '♥'];
        var deck = [];
        for (var number = 1; number <= 13; number++) {
            suitArray.forEach(function(suit) {
                var Card = {
                'number': number, // 1~13
                'suit': suit      // スート（絵柄）'♠','♣','♦','♥'
                };
                deck.push(Card);
            });
        }
        // カードをシャッフル
        deck = _.shuffle(deck);

        /**
         * カードを引く。
         * @return 引いたCardオブジェクトを返す。
         */
        function drawCard() {
            return deck.pop();
        }

        // ホールカード ※各プレイヤーの手元に配られるカード
        var holeCards = [];
        holeCards.push(drawCard());
        holeCards.push(drawCard());
        holeCards = _.sortBy(holeCards, function(card) { return card.number; }); // Card.numberの昇順でソート

        // コミュニティカード ※テーブルの中央にオープンされる5枚のカード
        var communityCards = [];
        communityCards.push(drawCard());
        communityCards.push(drawCard());
        communityCards.push(drawCard());
        communityCards.push(drawCard());
        communityCards.push(drawCard());
        communityCards = _.sortBy(communityCards, function(card) { return card.number; }); // Card.numberの昇順でソート

        // 全てのカード ※ホールカード ＋ コミュニティカード
        var allCards = [];
        holeCards.forEach(function(holeCard) { allCards.push(holeCard); });
        communityCards.forEach(function(communityCard) { allCards.push(communityCard); });
        // 全てのカードをCard.numberの昇順でソートする。
        allCards = _.sortBy(allCards, function(card) { return card.number; });

        return {
            'holeCards': holeCards,
            'communityCards': communityCards,
            'allCards': allCards
        };
    },

    /**
     * 役判定
     * @param dealtCards 配られたカード
     * @return 判定された役文字列
     */
    judgeHands: function(dealtCards) {
        var allCards = dealtCards.allCards;

        /**
         * 指定フィールドの値が同じCardオブジェクトを連想配列へ
         * @return 
         *  (例)指定フィールド='number'の場合
         *  {
         *    '指定フィールド': {sum: 合計枚数, cardArray: 対象Card配列}
         *    '1': {sum: 1, cardArray: [card1]},
         *    '3': {sum: 2, cardArray: [card1, card2]},
         *    '6': {sum: 3, cardArray: [card1, card2, card3]}
         *    ...
         *  }
         */
        function sameArrayByField(fieldName) {
            var sameArray = {};
            allCards.forEach(function(card) {
                var sum;
                var cardArray;
                // キーが存在しない場合
                if(!sameArray[card[fieldName]]) {
                sum = 1;
                cardArray = [];
                } else {
                // キーが存在する場合
                sum = sameArray[card[fieldName]].sum + 1;
                cardArray = sameArray[card[fieldName]].cardArray;
                }
                cardArray.push(card);
                sameArray[card[fieldName]] = {
                'sum' : sum,
                'cardArray': cardArray
                };
            });
            return sameArray;
        }
        sameNumberArray = sameArrayByField('number');
        sameSuitArray = sameArrayByField('suit');








        /*************************************************************
         * ストレート判定
         *************************************************************/

        /**
         * 配列を値コピーする
         * 参考URL: http://cly7796.net/wp/javascript/copy-array-value/
         */
        function copyArray(array) {
            return JSON.parse(JSON.stringify(array));
        }
    
        // 1と13が含まれる場合のみ、1を(14)として扱うため 末尾に1を追加する
        var allCardsAddLastAce = copyArray(allCards);
        var aceCardArray = _.filter(allCards, function(card){ return card.number == 1});
        var kingCardArray = _.filter(allCards, function(card){ return card.number == 13});
        if(aceCardArray.length >= 1 && kingCardArray.length >= 1) {
            aceCardArray.forEach(function(aceCard){
                allCardsAddLastAce.push(aceCard);
            });
        }
    
        // straightCount = { straightCardCnt: ストレートカードの枚数, straightCardArray: 対象Card配列 }
        var straightCountArray = [];
        var straightCardCnt    = 0;
        var straightCardArray  = [];
        for(var i=0; i < allCardsAddLastAce.length; i++) {
            straightCardCnt++;
            straightCardArray.push(allCardsAddLastAce[i]);
            
            // 最後の要素はスキップ
            if (i == allCardsAddLastAce.length - 1) {
                straightCountArray.push({
                    'straightCardCnt' : straightCardCnt,
                    'straightCardArray': straightCardArray
                });
                continue;
            };
            
            var currentNumber = allCardsAddLastAce[i].number;
            var nextNumber    = allCardsAddLastAce[i+1].number;
            // 同一数字はスキップ。
            if (currentNumber == nextNumber) {
                // 同一数字の場合は、ストレートカウントとしてカウントしない。
                // 上記処理で足した分減算して元に戻す。
                straightCardCnt--;
                continue;
            }
            var isNextPlusOne = currentNumber + 1 == nextNumber; // 次の要素が現在要素+1と同一判定
            var isKingNextAce = currentNumber == 13 && nextNumber == 1; // 13(King)の次が1(Ace)判定
            if (isNextPlusOne || isKingNextAce) {
                continue;
            } else {
                straightCountArray.push({
                    'straightCardCnt' : straightCardCnt,
                    'straightCardArray': straightCardArray
                });
                straightCardCnt = 0;
                straightCardArray = [];
            }
        }


        /**
         * 同一のカードを含んでいるか。
         * @param {*} cardArray1 
         * @param {*} cardArray2 
         */
        function containsCardArray(cardArray1, cardArray2) {
            if(!cardArray1 || !cardArray2) return false;
            if(!Array.isArray(cardArray1) || !Array.isArray(cardArray2)) return false;
        
            var smallArray = cardArray1.length < cardArray2.length ? cardArray1 : cardArray2;
            var largeArray = cardArray1.length < cardArray2.length ? cardArray2 : cardArray1;
        
            var isContainsCard = true;
            smallArray.forEach(function(card) {
                var hasSameCard = _.some(largeArray, function(largeArrayCard) {
                    return JSON.stringify(largeArrayCard) === JSON.stringify(card);
                });
                if (!hasSameCard) {
                  isContainsCard = false;
                  return;
                }
            });
            return isContainsCard;
        }


        var isStraightFlush = function() {
            var straightCard = _.find(straightCountArray, function(straightCount){ return straightCount.straightCardCnt >= 5});
            var sameSuitCard = _.find(sameSuitArray, function(sameSuit){ return sameSuit.sum >= 5});
            if(straightCard === undefined || sameSuitCard === undefined) return false;

            console.debug('isStraightFlush(): straightCard = %O', straightCard);
            console.debug('isStraightFlush(): sameSuitCard = %O', sameSuitCard);
            return containsCardArray(straightCard.straightCardArray, sameSuitCard.cardArray);
        };
        var isFourCard = function() {
            var sameFourCard = _.find(sameNumberArray, function(sameNumber){ return sameNumber.sum == 4});
            return sameFourCard !== undefined;
        };
        var isFullHouse = function() {
            var sameThreeCard = _.find(sameNumberArray, function(sameNumber){ return sameNumber.sum == 3});
            var sameTwoCard = _.find(sameNumberArray, function(sameNumber){ return sameNumber.sum == 2});
            return sameThreeCard !== undefined && sameTwoCard !== undefined;
        };
        var isFlush = function() {
            var maxSameSuit = _.max(sameSuitArray, function(sameSuit){ return sameSuit.sum});
            return maxSameSuit.sum >= 5;
        };
        var isStraight = function() {
            var straightCard = _.find(straightCountArray, function(straightCount){ return straightCount.straightCardCnt >= 5});
            console.debug('isStraight(): straightCard = %O', straightCard);
            return straightCard !== undefined;
        };
        var isThreeCard = function() {
            var sameThreeCard = _.find(sameNumberArray, function(sameNumber){ return sameNumber.sum == 3});
            return sameThreeCard !== undefined;
        };
        var isTwoPair = function() {
            var sameTwoCardArray = _.filter(sameNumberArray, function(sameNumber){ return sameNumber.sum == 2});
            return sameTwoCardArray.length >= 2;
        };
        var isOnePair = function() {
            var sameTwoCardArray = _.filter(sameNumberArray, function(sameNumber){ return sameNumber.sum == 2});
            return sameTwoCardArray.length >= 1;
        };
        var ighCard = function() {
             _.max(allCards, function(card){ return card.number == 1? 14 : card.number; });


            var sameTwoCardArray = _.filter(sameNumberArray, function(sameNumber){ return sameNumber.sum == 2});
            return sameTwoCardArray.length >= 1;
        };

        var strongOrderArray = [
            {'handsJudgeFunction': isStraightFlush, 'handsName': 'ストレートフラッシュ'},
            {'handsJudgeFunction': isFourCard, 'handsName': 'フォーカード'},
            {'handsJudgeFunction': isFullHouse, 'handsName': 'フルハウス'},
            {'handsJudgeFunction': isFlush, 'handsName': 'フラッシュ'},
            {'handsJudgeFunction': isStraight, 'handsName': 'ストレート'},
            {'handsJudgeFunction': isThreeCard, 'handsName': 'スリーカード'},
            {'handsJudgeFunction': isTwoPair, 'handsName': 'ツーペア'},
            {'handsJudgeFunction': isOnePair, 'handsName': 'ワンペア'}
        ];

        var judgedHands = _.find(strongOrderArray, function(strongOrder) {
            return strongOrder.handsJudgeFunction();
        });

        if (judgedHands !== undefined) {
            return judgedHands.handsName;
        } else {
            var getStrongestCardNumber = function() {
                // 1(ace)は, 14として扱う。
                return _.max(allCards, function(card){ return card.number == 1? 14 : card.number; });
            }
            return '役なし（ハイカード） 一番強い数字は' + getStrongestCardNumber().number;
        }
    },


    outputCardArray: function(cardArray) {
        var cardsOutput = '';
        cardArray.forEach(function(card) {
            cardStr = card.number + card.suit;
            var blackSuit = ['♠', '♣'];
            var redSuit   = ['♦', '♥'];
            var sameSuitFunction = function(suit) { return suit == card.suit; };
            if (_.some(blackSuit, sameSuitFunction)) {
                cardsOutput += '<span style="color: black; padding-right: 14px;">' + cardStr + '</span>';
            } else if (_.some(redSuit, sameSuitFunction)) {
                cardsOutput += '<span style="color: red; padding-right: 14px;">' + cardStr + '</span>';
            } else {
                cardsOutput += '<span>' + cardStr + '</span>';
            }
        });
        return cardsOutput;
    }
}


// テスト
// allCards = [
//   {"number":  1,"suit": "♠"},
//   {"number":  7,"suit": "♥"},
//   {"number":  8,"suit": "♣"},
//   {"number":  9,"suit": "♥"},
//   {"number": 10,"suit": "♠"},
//   {"number": 10,"suit": "♥"},
//   {"number": 11,"suit": "♠"}
// ];

// allCards = [
//   {"number":  1,"suit": "♠"},
//   {"number":  1,"suit": "♥"},
//   {"number":  2,"suit": "♥"},
//   {"number": 10,"suit": "♣"},
//   {"number": 11,"suit": "♥"},
//   {"number": 12,"suit": "♠"},
//   {"number": 13,"suit": "♥"}
// ];

// allCards = [
//   {"number":  1,"suit": "♠"},
//   {"number":  1,"suit": "♥"},
//   {"number":  2,"suit": "♥"},
//   {"number":  3,"suit": "♣"},
//   {"number":  4,"suit": "♥"},
//   {"number":  5,"suit": "♠"},
//   {"number":  7,"suit": "♥"}
// ];


// console.dir("allCards: %O", allCards);










// function equalCardArray(cardArray1, cardArray2) {
//   if(!cardArray1 || !cardArray2) return false;
//   if(!Array.isArray(cardArray1) || !Array.isArray(cardArray2)) return false;

//   if(cardArray1.length != cardArray2.length) return false;
//   for(var i=0; i < cardArray1.length; i++) {
//     var card1 = cardArray1[i];
//     var card2 = cardArray2[i];
//     if(JSON.stringify(card1) !== JSON.stringify(card2)) return false;
//   }
//   return true;
// }

// console.log("equalCardArray(allCards, straightCardArray): %O", equalCardArray(allCards, straightCardArray));

// var PockerHand = {

// }
// console.log("PockerHand: %O", PockerHand);

// console.log("PockerHand.isStraight(): %O", PockerHand.isStraight());
// console.log("PockerHand.isFlush(): %O", PockerHand.isFlush());
// console.log("PockerHand.isFourCard(): %O", PockerHand.isFourCard());
// console.log("PockerHand.isFullHouse(): %O", PockerHand.isFullHouse());
// console.log("PockerHand.isThreeCard(): %O", PockerHand.isThreeCard());
// console.log("PockerHand.isTwoPair(): %O", PockerHand.isTwoPair());
// console.log("PockerHand.isOnePair(): %O", PockerHand.isOnePair());