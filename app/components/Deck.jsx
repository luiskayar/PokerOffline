"use client"
import React from 'react';

export default function Deck({ cardsRemaining }) {
  return (
    <div className="deck">
      {cardsRemaining} cards remaining
    </div>
  );
}