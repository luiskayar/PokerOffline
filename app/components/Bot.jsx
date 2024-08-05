"use client"
import React from 'react';
import Hand from './Hand';

export default function Bot({ name, hand, chips, className }) {
  return (
    <div className={className}>
      <h2>{name}</h2>
      <Hand cards={hand} faceDown={true} />
      <p>Chips: {chips}</p>
    </div>
  );
}