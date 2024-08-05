"use client"
import React from 'react';
import Hand from './Hand';

export default function Player({ name, hand, chips, bet, className, onAction, isActive }) {
  return (
    <div className={className}>
      <h2>{name}</h2>
      <Hand cards={hand} />
      <p>Chips: {chips}</p>
      <p>Current Bet: {bet}</p>
      <div className="actions">
        <button onClick={() => onAction('fold')} disabled={!isActive}>Fold</button>
        <button onClick={() => onAction('call')} disabled={!isActive}>Call</button>
        <button onClick={() => onAction('raise', 10)} disabled={!isActive}>Raise</button>
      </div>
    </div>
  );
}