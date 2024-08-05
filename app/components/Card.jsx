"use client"
import React from 'react'

export default function Card({ suit, value }) {
  return (
    <div className="card">
      {value} of {suit}
    </div>
  )
}