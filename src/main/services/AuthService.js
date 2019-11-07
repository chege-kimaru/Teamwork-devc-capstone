import bcrypt from 'bcrypt';
import db from '../utils/db';

const { pool } = db;

const SALT = 10;

class AuthService {
  static async initiateAdmin() {
    const query = 'INSERT INTO users (email, password, role) VALUES ($1, $2, $3) RETURNING *';
    const pass = await bcrypt.hash('1234', SALT);
    const values = ['admin@teamwork.com', pass, 1];
    return pool.query(query, values);
  }

}

export default AuthService;
