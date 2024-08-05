// botLogic.js

import { evaluateHand } from './poker';

function calculateHandStrength(hand, communityCards) {
  const allCards = [...hand, ...communityCards];
  const { strength } = evaluateHand(allCards);
  return strength / 10; // Normalizar la fuerza de la mano a un valor entre 0 y 1
}

function calculatePotOdds(potSize, currentBet) {
  return currentBet / (potSize + currentBet);
}

function makeBotDecision(hand, communityCards, potSize, currentBet, chipStack, position) {
  const handStrength = calculateHandStrength(hand, communityCards);
  const potOdds = calculatePotOdds(potSize, currentBet);

  // Factores adicionales
  const bluffFactor = Math.random() * 0.2; // 20% de posibilidad de farolear
  const positionFactor = position === 'late' ? 0.1 : 0; // Más agresivo en posición tardía

  const decisionThreshold = handStrength + bluffFactor + positionFactor;

  if (decisionThreshold > 0.8) {
    // Mano muy fuerte: subir
    const raiseAmount = Math.min(currentBet * 3, chipStack);
    return { action: 'raise', amount: raiseAmount };
  } else if (decisionThreshold > potOdds + 0.1) {
    // Mano decente: igualar
    return { action: 'call', amount: currentBet };
  } else if (decisionThreshold > potOdds - 0.1) {
    // Mano marginal: igualar con probabilidad
    return Math.random() < 0.5 ? { action: 'call', amount: currentBet } : { action: 'fold' };
  } else {
    // Mano débil: pasar
    return { action: 'fold' };
  }
}

function adjustStrategy(opponentActions, chipStacks) {
  // Implementar ajustes basados en las acciones de los oponentes y los stacks de fichas
  // Este es un placeholder y necesitaría ser desarrollado más
  return {
    aggressiveness: Math.random(),
    bluffFrequency: Math.random()
  };
}

export function botDecision(player, gameState) {
  const highestBet = Math.max(...gameState.players.map(p => p.bet));
  const callAmount = highestBet - player.bet;

  if (Math.random() < 0.1) {
    return { action: 'fold' };
  } else if (callAmount === 0 || Math.random() < 0.7) {
    return { action: 'call', amount: callAmount };
  } else {
    return { action: 'raise', amount: callAmount + Math.floor(Math.random() * 50) + 10 };
  }
}

export { makeBotDecision, adjustStrategy };