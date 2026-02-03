import pool from '../../configs/postgres.js';

export async function getAllProblems() {
    const query = 'SELECT id, title, slug, difficulty, created_at FROM problems ORDER BY id ASC';
    const result = await pool.query(query);
    return result.rows;
}

export async function getProblemDetail(idOrSlug) {
    let query;
    const params = [idOrSlug];

    if (isNaN(idOrSlug)) {
        query = 'SELECT * FROM problems WHERE slug = $1';
    } else {
        query = 'SELECT * FROM problems WHERE id = $1';
    }

    const result = await pool.query(query, params);
    return result.rows[0] || null;
}

export async function submitProblem({ userId, problemId, codeContent, status, judgeResult }) {
    const query = `
        INSERT INTO submissions (user_id, problem_id, code_content, status, judge_result)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING id, user_id, problem_id, code_content, status, judge_result, submitted_at
    `;
    const result = await pool.query(query, [
        userId || null,
        problemId,
        codeContent,
        status || 'PENDING',
        judgeResult || null
    ]);
    return result.rows[0];
}

export async function getUserSubmissions(problemId, userId) {
    const query = `
        SELECT id, status, code_content, judge_result, submitted_at
        FROM submissions
        WHERE problem_id = $1 AND user_id = $2
        ORDER BY submitted_at DESC
    `;
    const result = await pool.query(query, [problemId, userId]);
    return result.rows;
}
