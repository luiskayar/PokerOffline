// poker.js

const RANKS = '23456789TJQKA';
const SUITS = 'hdcs';

function evaluateHand(hand) {
  const cards = hand.map(card => ({
    rank: RANKS.indexOf(card.value.charAt(0)),
    suit: SUITS.indexOf(card.suit.charAt(0).toLowerCase())
  }));

  cards.sort((a, b) => b.rank - a.rank);

  const ranks = cards.map(card => card.rank);
  const suits = cards.map(card => card.suit);

  const isFlush = suits.every(suit => suit === suits[0]);
  const isStraight = ranks.every((rank, i) => i === 0 || rank === ranks[i - 1] - 1);

  const rankCounts = ranks.reduce((counts, rank) => {
    counts[rank] = (counts[rank] || 0) + 1;
    return counts;
  }, {});

  const countValues = Object.values(rankCounts).sort((a, b) => b - a);

  if (isFlush && isStraight && ranks[0] === RANKS.length - 1) return { name: 'Royal Flush', strength: 10 };
  if (isFlush && isStraight) return { name: 'Straight Flush', strength: 9 };
  if (countValues[0] === 4) return { name: 'Four of a Kind', strength: 8 };
  if (countValues[0] === 3 && countValues[1] === 2) return { name: 'Full House', strength: 7 };
  if (isFlush) return { name: 'Flush', strength: 6 };
  if (isStraight) return { name: 'Straight', strength: 5 };
  if (countValues[0] === 3) return { name: 'Three of a Kind', strength: 4 };
  if (countValues[0] === 2 && countValues[1] === 2) return { name: 'Two Pair', strength: 3 };
  if (countValues[0] === 2) return { name: 'One Pair', strength: 2 };
  return { name: 'High Card', strength: 1 };
}

function compareHands(hand1, hand2) {
  const eval1 = evaluateHand(hand1);
  const eval2 = evaluateHand(hand2);

  if (eval1.strength !== eval2.strength) {
    return eval1.strength - eval2.strength;
  }

  // Si las manos tienen la misma fuerza, comparar las cartas altas
  const ranks1 = hand1.map(card => RANKS.indexOf(card.value.charAt(0))).sort((a, b) => b - a);
  const ranks2 = hand2.map(card => RANKS.indexOf(card.value.charAt(0))).sort((a, b) => b - a);

  for (let i = 0; i < ranks1.length; i++) {
    if (ranks1[i] !== ranks2[i]) {
      return ranks1[i] - ranks2[i];
    }
  }

  return 0; // Empate
}

export { evaluateHand, compareHands };