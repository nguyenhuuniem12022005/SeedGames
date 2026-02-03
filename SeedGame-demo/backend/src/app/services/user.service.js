import pool from '../../configs/postgres.js';
import bcrypt from 'bcrypt';

export async function createUser({ username, email, password }) {
    const salt = await bcrypt.genSalt(10); // ma hoa hash code
    const hashedPassword = await bcrypt.hash(password, salt);

    const queryText = `
        insert into users (username, email, password_hash)
        values ($1, $2, $3)
        returning id, username, email
    `;
    const result = await pool.query(queryText, [username, email, hashedPassword]);
    return result.rows[0];
};

// src/app/services/user.service.js

export async function resetPassword(email, password) {
    // 1. Log để debug xem ID có truyền vào đúng không
    // console.log(`>>> Service đang đổi pass cho ID: ${id}`);

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const query = `
        UPDATE users 
        SET password_hash = $1 
        WHERE email = $2
        RETURNING *
    `;
    
    const result = await pool.query(query, [hashedPassword, email]);

    // 2. KIỂM TRA QUAN TRỌNG: Nếu không có dòng nào được update
    if (result.rowCount === 0) {
        return null; // Trả về null để báo hiệu thất bại
    }

    return result.rows[0]; // Trả về user nếu thành công
}