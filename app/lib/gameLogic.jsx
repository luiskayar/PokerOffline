import { evaluateHand, compareHands } from './poker';

export function initializeGame(numPlayers) {
  return {
    players: Array(numPlayers).fill().map((_, i) => ({
      id: i,
      name: i === 0 ? 'You' : `Bot ${i}`,
      hand: [],
      chips: 1000,
      bet: 0,
      folded: false,
    })),
    communityCards: [],
    pot: 0,
    currentPlayer: 0,
    dealer: 0,
    phase: 'preflop',
    deck: [],
  };
}

export function nextPhase(gameState) {
  const phases = ['preflop', 'flop', 'turn', 'river', 'showdown'];
  const currentIndex = phases.indexOf(gameState.phase);
  if (currentIndex < phases.length - 1) {
    gameState.phase = phases[currentIndex + 1];
    if (gameState.phase === 'flop') {
      gameState.communityCards.push(...gameState.deck.splice(0, 3));
    } else if (gameState.phase === 'turn' || gameState.phase === 'river') {
      gameState.communityCards.push(gameState.deck.pop());
    }
  }
  return gameState;
}

export function determineWinner(gameState) {
  const activePlayers = gameState.players.filter(p => !p.folded);
  const hands = activePlayers.map(player => ({
    player,
    evaluation: evaluateHand([...player.hand, ...gameState.communityCards])
  }));

  hands.sort((a, b) => compareHands(a.evaluation, b.evaluation));
  
  return hands[hands.length - 1].player;
}