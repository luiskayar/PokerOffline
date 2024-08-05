"use client"
import React from 'react';

export default function Hand({ cards, faceDown = false }) {
  return (
    <div className="hand">
      {cards.map((card, index) => (
        <div key={index} className="card">
          {faceDown ? '🂠' : `${card.value} of ${card.suit}`}
        </div>
      ))}
    </div>
  );
}