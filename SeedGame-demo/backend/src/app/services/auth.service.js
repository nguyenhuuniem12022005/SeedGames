import pool from '../../configs/postgres.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import { createUser } from './user.service.js';
import moment from 'moment';
import NodeCache from 'node-cache';

dotenv.config();

// Khoi tao cache luu toke bi block (Se bi mat du lieu neu restart) - Tot hon dung redis
export const tokenBlocklist = new NodeCache();

// Xac thuc xem dang nhap co dung hay khong
export async function checkValidLogin({ email, password }) {
    const queryText = 'select * from users where email = $1';
    const result = await pool.query(queryText, [email]);
    const user = result.rows[0];

    if (user) {
        const verified = await bcrypt.compare(password, user.password_hash);
        if (verified) {
            return user;
        }
    }
    return false;
}

export function authToken(user) {
    const payload = { id: user.id };
    const accessToken = jwt.sign(payload, process.env.SECRET_KEY, { expiresIn: process.env.LOGIN_EXPIRE_IN });
    const decode = jwt.decode(accessToken);
    const expireIn = decode.exp - decode.iat;
    return {
        access_token: accessToken,
        expire_in: expireIn,
        auth_type: 'Bearer token'
    }
}

// Dang ky
export async function register({ username, email, password }) {
    const user = await createUser({ username, email, password });
    return user;
}

// Dung cho viec blocktoken som hon nhu (logout, xoa quyen truy cap, ...)
export async function blockToken(token) {
    const decoded = jwt.decode(token);
    const now = moment().unix();
    const expireIn = decoded.exp - now;
    tokenBlocklist.set(token, true, expireIn);
}

