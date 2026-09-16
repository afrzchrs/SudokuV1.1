import { json } from '@sveltejs/kit';
import { generatePuzzle } from '$lib/sudokuEngine';

export function GET({ url }) {
  try {
    const difficulty = (url.searchParams.get('difficulty') || 'easy').toLowerCase();
    const result = generatePuzzle(difficulty);

    return json({
      success: true,
      data: {
        difficulty: result.difficulty,
        puzzle: result.puzzle,
        solution: result.solution,
        clueCount: result.clueCount
      }
    });
  } catch (error) {
    console.error('Error generating puzzle:', error);
    return json({
      success: false,
      message: 'Failed to generate puzzle'
    }, { status: 500 });
  }
}
