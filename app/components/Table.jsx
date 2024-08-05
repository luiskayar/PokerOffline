"use client"
import React, { useState, useEffect } from 'react';
import Player from './Player';
import Bot from './Bot';
import Deck from './Deck';
import { createDeck, shuffleDeck, dealCards } from '../lib/utils';
import { initializeGame, nextPhase, determineWinner } from '../lib/gameLogic';
import { botDecision } from '../lib/botLogic';

export default function Table() {
  const [gameState, setGameState] = useState(null);

  useEffect(() => {
    startNewGame();
  }, []);

  useEffect(() => {
    if (gameState && gameState.players[gameState.currentPlayer].name !== 'You') {
      const botTimer = setTimeout(() => {
        handleBotTurn();
      }, 1000);
      return () => clearTimeout(botTimer);
    }
  }, [gameState]);

  function startNewGame() {
    let newGameState = initializeGame(4);
    newGameState.deck = shuffleDeck(createDeck());
    const { hands, remainingDeck } = dealCards(newGameState.deck, 4, 2);
    newGameState.deck = remainingDeck;
    newGameState.players.forEach((player, index) => {
      player.hand = hands[index];
    });
    setGameState(newGameState);
  }

  function handleBotTurn() {
    if (!gameState) return;
    const currentPlayer = gameState.players[gameState.currentPlayer];
    const decision = botDecision(currentPlayer, gameState);
    handlePlayerAction(decision.action, decision.amount);
  }

  function handlePlayerAction(action, amount = 0) {
    if (!gameState) return;

    let updatedGameState = { ...gameState };
    const currentPlayer = updatedGameState.players[updatedGameState.currentPlayer];

    switch (action) {
      case 'fold':
        currentPlayer.folded = true;
        break;
      case 'call':
        const highestBet = Math.max(...updatedGameState.players.map(p => p.bet));
        const callAmount = highestBet - currentPlayer.bet;
        currentPlayer.bet = highestBet;
        currentPlayer.chips -= callAmount;
        updatedGameState.pot += callAmount;
        break;
      case 'raise':
        const raiseAmount = amount + Math.max(...updatedGameState.players.map(p => p.bet)) - currentPlayer.bet;
        currentPlayer.bet += raiseAmount;
        currentPlayer.chips -= raiseAmount;
        updatedGameState.pot += raiseAmount;
        break;
    }

    // Move to next player
    do {
      updatedGameState.currentPlayer = (updatedGameState.currentPlayer + 1) % updatedGameState.players.length;
    } while (updatedGameState.players[updatedGameState.currentPlayer].folded);

    // Check if round is over
    if (updatedGameState.players.filter(p => !p.folded).length === 1 || 
        (updatedGameState.currentPlayer === updatedGameState.dealer && 
         updatedGameState.players.every(p => p.folded || p.bet === Math.max(...updatedGameState.players.map(p => p.bet))))) {
      updatedGameState = nextPhase(updatedGameState);
      if (updatedGameState.phase === 'showdown' || updatedGameState.players.filter(p => !p.folded).length === 1) {
        endHand(updatedGameState);
        return;
      }
    }

    setGameState(updatedGameState);
  }

  function endHand(gameState) {
    const activePlayers = gameState.players.filter(p => !p.folded);
    let winner;
    if (activePlayers.length === 1) {
      winner = activePlayers[0];
    } else {
      winner = determineWinner(gameState);
    }
    winner.chips += gameState.pot;
    alert(`${winner.name} wins ${gameState.pot} chips!`);
    setTimeout(startNewGame, 2000);
  }

  if (!gameState) return <div>Loading...</div>;

  const currentPlayer = gameState.players[gameState.currentPlayer];
  const isPlayerTurn = currentPlayer.name === 'You';

  return (
    <div className="table">
      <Deck cardsRemaining={gameState.deck.length} />
      {gameState.players.map((player, index) => (
        index === 0 ? (
          <Player 
            key={player.id}
            name={player.name}
            hand={player.hand}
            chips={player.chips}
            bet={player.bet}
            className="player"
            onAction={handlePlayerAction}
            isActive={isPlayerTurn}
          />
        ) : (
          <Bot
            key={player.id}
            name={player.name}
            hand={player.hand}
            chips={player.chips}
            bet={player.bet}
            className={`bot bot${index}`}
            isActive={currentPlayer.id === player.id}
          />
        )
      ))}
      <div className="community-cards">
        {gameState.communityCards.map((card, index) => (
          <div key={index} className="card">{card.value} of {card.suit}</div>
        ))}
      </div>
      <div className="game-info">
        <p>Pot: {gameState.pot}</p>
        <p>Current Phase: {gameState.phase}</p>
        <p>Current Player: {currentPlayer.name}</p>
      </div>
    </div>
  );
}