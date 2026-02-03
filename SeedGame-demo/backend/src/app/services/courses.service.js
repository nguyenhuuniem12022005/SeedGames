import pool from '../../configs/postgres.js';

function mapCourseRow(row) {
  // Map DB columns (best-effort) to frontend Course shape
  return {
    id: row.id,
    title: row.title,
    subtitle: row.subtitle || null,
    description: row.description || null,
    level: row.level || 'Beginner',
    duration: row.duration || null,
    rating: row.rating !== undefined ? Number(row.rating) : null,
    totalRatings: row.total_ratings !== undefined ? Number(row.total_ratings) : null,
    price: row.price !== undefined ? Number(row.price) : null,
    originalPrice: row.original_price !== undefined ? Number(row.original_price) : null,
    image: row.image || row.thumbnail_url || null,
    is_published: row.is_published || false,
    createdAt: row.created_at || row.createdAt || null,
    // modules will be attached by getCourseById when needed
  };
}

export async function listCourses() {
  const query = `
    SELECT id, title, description, thumbnail_url, is_published, created_at
    FROM courses
    WHERE is_published = true
    ORDER BY created_at DESC
  `;
  const result = await pool.query(query);
  return result.rows.map(mapCourseRow);
}

export async function getCourseById(id) {
  const query = `
    SELECT id, title,description, thumbnail_url, is_published, created_at
    FROM courses
    WHERE id = $1
  `;
  const result = await pool.query(query, [id]);
  const row = result.rows[0];
  if (!row) return null;

  const course = mapCourseRow(row);

  // fetch modules if modules table exists
  try {
    const modQuery = `SELECT id, title, lectures, duration, content FROM modules WHERE course_id = $1 ORDER BY id ASC`;
    const mods = await pool.query(modQuery, [id]);
    course.modules = mods.rows.map(m => ({
      id: m.id,
      title: m.title,
      lectures: m.lectures || 0,
      duration: m.duration || null,
      content: m.content || null
    }));
  } catch (e) {
    // if modules table doesn't exist yet, return empty modules
    course.modules = [];
  }

  return course;
}

export async function createCourse(fields) {
  // Accept frontend fields and persist best-effort to DB columns available
  const {
    title,
    subtitle,
    description,
    is_published
  } = fields;

  const query = `
    INSERT INTO courses (title, description, thumbnail_url, is_published)
    VALUES ($1,$2,$3,$4)
    RETURNING id, title, description, is_published, created_at
  `;
  const result = await pool.query(query, [
    title,
    subtitle || null,
    description || null,
    !!is_published
  ]);

  return mapCourseRow(result.rows[0]);
}

export async function updateCourse(id, fields) {
  const allowed = ['title','description','thumbnail_url','is_published'];
  const sets = [];
  const values = [];
  let idx = 1;
  for (const key of Object.keys(fields)) {
    if (!allowed.includes(key)) continue;
    sets.push(`${key} = $${idx++}`);
    values.push(fields[key]);
  }
  if (!sets.length) return await getCourseById(id);

  const query = `UPDATE courses SET ${sets.join(', ')} WHERE id = $${idx} RETURNING id, title, thumbnail_url, is_published`;
  values.push(id);
  const result = await pool.query(query, values);
  const row = result.rows[0];
  if (!row) return null;
  return mapCourseRow(row);
}

export async function deleteCourse(id) {
  const result = await pool.query('DELETE FROM courses WHERE id = $1 RETURNING id', [id]);
  return result.rowCount > 0;
}

export async function getModuleById(courseId, moduleId) {
  const query = `
    SELECT id, title, lectures, duration, content FROM modules 
    WHERE id = $1 AND course_id = $2
  `;
  const result = await pool.query(query, [moduleId, courseId]);
  return result.rows[0] || null;
}
