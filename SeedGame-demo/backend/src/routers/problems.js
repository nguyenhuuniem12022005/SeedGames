import express from 'express';
import pool from '../configs/postgres.js';

const router = express.Router();

// GET /api/problems - List all problems
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, title, slug, difficulty, created_at FROM problems ORDER BY id ASC'
    );
    res.json({ problems: result.rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch problems' });
  }
});

// GET /api/problems/:id or :slug - Get problem detail
router.get('/:idOrSlug', async (req, res) => {
  const { idOrSlug } = req.params;
  try {
    let result;
    if (isNaN(idOrSlug)) {
      result = await pool.query(
        'SELECT * FROM problems WHERE slug = $1',
        [idOrSlug]
      );
    } else {
      result = await pool.query(
        'SELECT * FROM problems WHERE id = $1',
        [idOrSlug]
      );
    }

    if (!result.rows.length) {
      return res.status(404).json({ error: 'Problem not found' });
    }

    res.json({ problem: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch problem' });
  }
});

// POST /api/problems/submit - Save submission
router.post('/submit', async (req, res) => {
  const { userId, problemId, codeContent, status, judgeResult } = req.body;

  if (!problemId || !codeContent) {
    return res
      .status(400)
      .json({ error: 'problemId and codeContent are required' });
  }

  try {
    const result = await pool.query(
      `INSERT INTO submissions (user_id, problem_id, code_content, status, judge_result)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, user_id, problem_id, code_content, status, judge_result, submitted_at`,
      [userId || null, problemId, codeContent, status || 'PENDING', judgeResult || null]
    );

    res.status(201).json({ submission: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to save submission' });
  }
});

// GET /api/problems/:problemId/submissions/:userId
router.get('/:problemId/submissions/:userId', async (req, res) => {
  const { problemId, userId } = req.params;

  try {
    const result = await pool.query(
      `SELECT id, status, code_content, judge_result, submitted_at
       FROM submissions
       WHERE problem_id = $1 AND user_id = $2
       ORDER BY submitted_at DESC`,
      [problemId, userId]
    );

    res.json({ submissions: result.rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch submissions' });
  }
});

export default router;
