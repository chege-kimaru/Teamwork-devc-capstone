import bcrypt from 'bcrypt';
import db from '../utils/db';
import { AuthenticationError } from '../utils/errors';
import jwt from 'jsonwebtoken';

const { pool } = db;

const SALT = 10;

class AuthService {
  static async initiateAdmin() {
    const query = 'INSERT INTO users (email, password, role) VALUES ($1, $2, $3) RETURNING *';
    const pass = await bcrypt.hash('1234', SALT);
    const values = ['admin@teamwork.com', pass, 1];
    return pool.query(query, values);
  }

  static async signIn(u) {
    const query = 'SELECT id, email, password FROM users where email=$1';
    const resp = await pool.query(query, [u.email]);
    const userData = resp.rows[0];
    if (!userData) throw new AuthenticationError();
    const match = await bcrypt.compare(u.password, userData.password);
    if (!match) throw new AuthenticationError();
    const payload = {id: userData.id, email: userData.email, role: userData.role};
    payload.token = jwt.sign(payload, process.env.SECRET_KEY);
    return payload;
  }
}

export default AuthService;
