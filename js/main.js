/*
  # Programming Proficiency Test

  Assumes basic JavaScript knowledge; jQuery knowledge helps a lot.

  ## Exercises

  1. Clicking the button should generate two random hands in memory (console.log).
  2. Clicking the button should render two random hands on the page as cards.
  3. Determine the winning hand by its number of pairs, add class="winning" to hand.
  4. Determine winning pairs and add class="pair0" (or "pair1" for 2nd pair) to cards.
  5. [Extra Credit] Ensure that 90% of hands have at least one pair.

*/

Poker = (function($) {

  var cardBaseURL = "http://h3h.net/images/cards/{suit}_{card}.svg";
  var suits = ['spade', 'heart', 'diamond', 'club'];
  var cards = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];

  var totalPossibleCardsArray = [];

  var init = function() {
    $(".buttons button").on("click", eventPlayAgainClicked);
  };

  /**
   * This function returns array of total possible cards combination
   */
  var getTotalPossibleCardsArray = () => {
    totalPossibleCardsArray = [];
    suits.forEach(suit => {
      cards.forEach(card => {
        totalPossibleCardsArray.push({
          suit: suit,
          card: card,
        })
      })
    });
  }

  /**
   * This function generate and return one unique card
   */
  var getRandomCard = function() {
    var randomCardKey = Math.floor(Math.random() * totalPossibleCardsArray.length);
    var card = totalPossibleCardsArray[randomCardKey];
    totalPossibleCardsArray.splice(randomCardKey, 1)
    return card;
  };

  /**
   * This function returns array of unique cards for one hand
   */
  var getRandomHandsCards = function() {
    var cardsArray = [];
    for (var i = 0; i < 5; i++) {
      var card = getRandomCard();
      cardsArray.push(card);
    }
    return cardsArray;
  };

  /**
   * This function returns unique elements of array
   */
  var getUniqueCards = function(value, key, self) {
    return self.indexOf(value) === key;
  }

  /**
   * This function returns dublicated elements of array
   */
  var getDublicatedCards = function(value, key, self) {
    return self.indexOf(value) !== key;
  }

  /**
   * This function return pairs from cards array
   */
  var getHandPairs = function(cards) {
    var cardNumbers = cards.map(card => card.card);
    var pairs = cardNumbers.filter(getDublicatedCards);
    return pairs;
  };

  /**
   * This function returns class of the image
   */
  var getImageClass = function(winnerCard, currentCard, pairs) {
    var imageClass = "card";
    if (winnerCard === currentCard && pairs.indexOf(winnerCard) !== -1) {
      imageClass += " pair0";
    } else if (pairs.indexOf(currentCard) !== -1) {
      imageClass += " pair1";
    }
    return imageClass;
  };

  /**
   * This function show cards and adds related classes to winner and pair cards
   */
  var showCards = function(cards, cardsWrapper, winnerCard, pairs) {
    return cards.forEach(card => {
      var imageClass = getImageClass(winnerCard, card.card, pairs);
      var imageSourse = cardBaseURL
        .replace('{suit}', card.suit)
        .replace('{card}', card.card);
      var image = '<img class="' + imageClass + '" src="' + imageSourse + '"/>';
      $(image).appendTo($(cardsWrapper));
    });
  }

  /**
   * This function returns index of maximal card in pair
   */
  var getPairMaximalIndex = function(pairs) {
    var indexes = [];
    var uniquePairs = pairs.filter(getUniqueCards);
    uniquePairs.forEach(pair => {
      indexes.push(cards.indexOf(pair));
    });
    return (indexes.length > 0) ? Math.max(...indexes) : null;
  };

  /**
   * This function returns winner card number
   */
  var getWinnerCard = function(firstHandPairs, secondHandPairs) {
    var firstPairMaximalIndex = getPairMaximalIndex(firstHandPairs);
    var secondPairMaximalIndex = getPairMaximalIndex(secondHandPairs);
    var firstHandPairsNumber = firstHandPairs.length;
    var secondHandPairsNumber = secondHandPairs.length;
    var winnerCard = null;
    if (firstPairMaximalIndex > secondPairMaximalIndex || firstHandPairsNumber > secondHandPairsNumber) {
      winnerCard = cards[firstPairMaximalIndex];
    } else if (firstPairMaximalIndex < secondPairMaximalIndex || firstHandPairsNumber < secondHandPairsNumber) {
      winnerCard = cards[secondPairMaximalIndex];
    }
    return winnerCard;
  };

  /**
   * This function defines winner and adds related class to Player block
   */
  var defineWinner = function(firstHandPairs, secondHandPairs, winnerCard) {
    var hands = $(".hand").toArray();
    var firstHandPairsNumber = firstHandPairs.length;
    var secondHandPairsNumber = secondHandPairs.length;
    if (firstHandPairs.indexOf(winnerCard) !== -1 || firstHandPairsNumber > secondHandPairsNumber) {
      var winner = hands[0];
      $(winner).addClass("winning");
    } else if (secondHandPairs.indexOf(winnerCard) !== -1 || firstHandPairsNumber < secondHandPairsNumber) {
      var winner = hands[1];
      $(winner).addClass("winning");
    }
  }

  /**
   * This function removes results of previous game
   */
  var removePreviousResults = function() {
    $(".cards-block .firstHand").empty();
    $(".cards-block .secondHand").empty();
    var hands = $(".hand").toArray();
    hands.forEach(hand => {
      $(hand).removeClass("winning");
    });
  };

  // *-* event methods *-*

  var eventPlayAgainClicked = function() {

    try {
      removePreviousResults();
      getTotalPossibleCardsArray();

      var firstHandCards = getRandomHandsCards();
      var secondHandCards = getRandomHandsCards();

      console.log('firstHandCards', firstHandCards);
      console.log('secondHandCards', secondHandCards);

      var firstHandPairs = getHandPairs(firstHandCards);
      var secondHandPairs = getHandPairs(secondHandCards);

      var winnerCard = getWinnerCard(firstHandPairs, secondHandPairs);

      showCards(firstHandCards, ".cards-block .firstHand", winnerCard, firstHandPairs);
      showCards(secondHandCards, ".cards-block .secondHand", winnerCard, secondHandPairs);

      defineWinner(firstHandPairs, secondHandPairs, winnerCard);
    } catch (e) {
      window.location.reload();
    }

  };

  // expose public methods
  return {
    init: init
  };
})(jQuery);

$(document).ready(Poker.init);

/*

The MIT License

Copyright (c) 2012 Brad Fults.

Permission is hereby granted, free of charge, to any person
obtaining a copy of this software and associated documentation
files (the "Software"), to deal in the Software without
restriction, including without limitation the rights to use,
copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the
Software is furnished to do so, subject to the following
conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
OTHER DEALINGS IN THE SOFTWARE.

*/
