import { json } from '@sveltejs/kit';
import { isCompleteAndValid } from '$lib/sudokuEngine';

export async function POST({ request }) {
  try {
    const { grid } = await request.json();
    if (!grid || !Array.isArray(grid) || grid.length !== 9) {
      return json({
        success: false,
        message: 'Invalid grid format. Must be a 9x9 matrix.'
      }, { status: 400 });
    }

    // Check for empty cells (0)
    const hasZeros = grid.flat().some(cell => cell === 0 || cell === null || cell === undefined);
    if (hasZeros) {
      return json({
        success: false,
        valid: false,
        message: 'Masih ada sel yang kosong!'
      });
    }

    const valid = isCompleteAndValid(grid);
    return json({
      success: true,
      valid,
      message: valid ? 'Sudoku berhasil diselesaikan!' : 'Ada angka yang duplikat atau salah penempatan.'
    });
  } catch (error) {
    console.error('Error verifying puzzle:', error);
    return json({
      success: false,
      message: 'Internal server error during verification'
    }, { status: 500 });
  }
}
