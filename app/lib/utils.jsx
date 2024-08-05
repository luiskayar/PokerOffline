export function createDeck() {
  const suits = ['Hearts', 'Diamonds', 'Clubs', 'Spades'];
  const values = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
  return suits.flatMap(suit => values.map(value => ({ suit, value })));
}

export function shuffleDeck(deck) {
  return [...deck].sort(() => Math.random() - 0.5);
}

export function dealCards(deck, numPlayers, cardsPerPlayer) {
  const hands = Array(numPlayers).fill().map(() => []);
  for (let i = 0; i < cardsPerPlayer; i++) {
    for (let j = 0; j < numPlayers; j++) {
      hands[j].push(deck.pop());
    }
  }
  return { hands, remainingDeck: deck };
}