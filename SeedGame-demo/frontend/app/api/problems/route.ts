import { NextResponse } from 'next/server';

const problems = [
  { id: 1, title: 'Paint the Grid', difficulty: 'Hard', successRate: '45.5%' },
  { id: 2, title: 'Move the Hero', difficulty: 'Easy', successRate: '56.8%' },
  { id: 3, title: 'Vector Dash', difficulty: 'Med.', successRate: '47.6%' },
  { id: 4, title: 'Physics Knockback', difficulty: 'Hard', successRate: '45.5%' },
  { id: 5, title: 'State Machine Basics', difficulty: 'Med.', successRate: '38.1%' },
];

export async function GET() {
  return NextResponse.json({ problems });
}
