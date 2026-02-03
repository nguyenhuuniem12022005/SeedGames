import jwt from 'jsonwebtoken';
import { tokenBlocklist } from '../../services/auth.service.js';
import pool from '../../../configs/postgres.js';
import ApiError from '../../../utils/classes/api-error.js';
import dotenv from 'dotenv';

dotenv.config();

async function requireAuthentication(req, res, next) {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return next(ApiError.unauthorized('Thiếu token xác thực!'));
        }

        const token = authHeader.split(' ')[1];
        if (!token) {
            return next(ApiError.unauthorized('Token không hợp lệ!'));
        }

        if (tokenBlocklist.has(token)) {
            return next(ApiError.unauthorized('Token đã bị vô hiệu hoá!'));
        }

        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        const result = await pool.query('select * from users where id = $1', [decoded.id]);
        if (result.rows.length > 0) {
            next();
            req.user = result.rows[0];
            return;
        }
        next(ApiError.unauthorized('Người dùng không tồn tại!'))

    } catch (error) {
        return next(ApiError.unauthorized('Token không hợp lệ hoặc đã hết hạn!'));
    }   
}

export default requireAuthentication;