import pool from '../../configs/postgres.js';

// Helper to determine contest status
function determineStatus(startTime, endTime) {
  const now = new Date();
  if (startTime && now < new Date(startTime)) return 'UPCOMING';
  if (endTime && now > new Date(endTime)) return 'FINISHED';
  return 'ONGOING';
}

function computeTimeRemaining(startTime, endTime) {
  const now = new Date();
  let target = null;
  if (startTime && now < new Date(startTime)) target = new Date(startTime);
  else if (endTime && now < new Date(endTime)) target = new Date(endTime);
  if (!target) return null;
  const diff = Math.max(0, target - now);
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(minutes / 60);
  const remMinutes = minutes % 60;
  if (hours > 0) return `${hours}h ${remMinutes}m`;
  return `${remMinutes}m`;
}

function mapContestRow(row) {
  return {
    id: row.id,
    name: row.title || row.name,
    description: row.description || null,
    startTime: row.start_time || row.startTime || null,
    endTime: row.end_time || row.endTime || null,
    createdAt: row.created_at || row.createdAt || null,
    prize: row.prize || null,
    participantCount: row.participant_count !== undefined ? Number(row.participant_count) : null
  };
}

export async function listContests() {
  const query = `
    SELECT id, title,  start_time, end_time, created_at
    FROM contests
    ORDER BY start_time DESC
  `;
  const result = await pool.query(query);
  return result.rows.map(row => {
    const mapped = mapContestRow(row);
    mapped.status = determineStatus(mapped.startTime, mapped.endTime);
    mapped.timeRemaining = computeTimeRemaining(mapped.startTime, mapped.endTime);
    mapped.participants = 'Solo';
    mapped.gameMode = 'Competitive';
    mapped.difficulty = 'Intermediate';
    return mapped;
  });
}

export async function getContestById(id) {
  const query = `
    SELECT id, title, start_time, end_time
    FROM contests
    WHERE id = $1
  `;
  const result = await pool.query(query, [id]);
  const row = result.rows[0];
  if (!row) return null;
  const mapped = mapContestRow(row);
  mapped.status = determineStatus(mapped.startTime, mapped.endTime);
  mapped.timeRemaining = computeTimeRemaining(mapped.startTime, mapped.endTime);
  mapped.participants = 'Solo';
  mapped.gameMode = 'Competitive';
  mapped.difficulty = 'Intermediate';
  return mapped;
}

export async function getContestRankings(contestId) {
  const query = `
    SELECT u.id, u.username, COUNT(s.id) as score, RANK() OVER (ORDER BY COUNT(s.id) DESC) as rank
    FROM users u
    LEFT JOIN submissions s ON u.id = s.user_id AND s.contest_id = $1
    GROUP BY u.id, u.username
    ORDER BY rank
    LIMIT 100
  `;
  const result = await pool.query(query, [contestId]);
  return result.rows;
}

export async function registerContest(contestId, userId) {
  const query = `
    INSERT INTO contest_registrations (contest_id, user_id) 
    VALUES ($1, $2)
    ON CONFLICT DO NOTHING
    RETURNING id
  `;
  const result = await pool.query(query, [contestId, userId]);
  return result.rowCount > 0;
}

export async function createContest({ title, start_time, end_time }) {
  const query = `
    INSERT INTO contests (title, start_time, end_time)
    VALUES ($1, $2, $3)
    RETURNING id, title as name, start_time as startTime, end_time as endTime, created_at as createdAt
  `;
  const result = await pool.query(query, [title, start_time || null, end_time || null]);
  const row = result.rows[0];
  
  return {
    ...row,
    status: determineStatus(row.startTime, row.endTime),
    participants: 'Solo',
    gameMode: 'Competitive',
    difficulty: 'Intermediate'
  };
}

export async function updateContest(id, { title, start_time, end_time }) {
  const fields = [];
  const values = [];
  let idx = 1;

  if (title !== undefined) {
    fields.push(`title = $${idx++}`);
    values.push(title);
  }
  if (start_time !== undefined) {
    fields.push(`start_time = $${idx++}`);
    values.push(start_time);
  }
  if (end_time !== undefined) {
    fields.push(`end_time = $${idx++}`);
    values.push(end_time);
  }

  if (!fields.length) return await getContestById(id);

  const query = `
    UPDATE contests SET ${fields.join(', ')} WHERE id = $${idx} 
    RETURNING id, title as name, start_time as startTime, end_time as endTime, created_at as createdAt
  `;
  values.push(id);
  const result = await pool.query(query, values);
  const row = result.rows[0];
  if (!row) return null;
  
  return {
    ...row,
    status: determineStatus(row.startTime, row.endTime),
    participants: 'Solo',
    gameMode: 'Competitive',
    difficulty: 'Intermediate'
  };
}

export async function deleteContest(id) {
  const result = await pool.query('DELETE FROM contests WHERE id = $1 RETURNING id', [id]);
  return result.rowCount > 0;
}
