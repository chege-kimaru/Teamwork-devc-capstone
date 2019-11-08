import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import db from '../utils/db';
import {AuthenticationError, ResourceNotFoundError} from '../utils/errors';

const {pool} = db;

const SALT = 10;

class AuthService {
  static async initializeAdmin() {
    try {
      const adminQuery = 'INSERT INTO users (email, password, role) VALUES ($1, $2, $3) RETURNING *';
      const adminPass = await bcrypt.hash('1234', SALT);
      const adminValues = ['admin@teamwork.com', adminPass, 1];
      await pool.query(adminQuery, adminValues);
    }catch(err) {
      throw err;
    }
  }

  static async findUserById(id) {
    try {
      const query = 'SELECT * FROM users where id=$1';
      const resp = await pool.query(query, [id]);
      const user = resp.rows[0];
      if (!user) throw new ResourceNotFoundError('This user does not exist');
      delete user.password;
      return user;
    } catch (err) {
      throw err;
    }
  }

  static async signIn(u) {
    try {
      const query = 'SELECT id, email, password, role FROM users where email=$1';
      const resp = await pool.query(query, [u.email]);
      const userData = resp.rows[0];
      if (!userData) throw new AuthenticationError();
      const match = await bcrypt.compare(u.password, userData.password);
      if (!match) throw new AuthenticationError();
      const payload = {id: userData.id, email: userData.email, role: userData.role};
      payload.token = jwt.sign(payload, process.env.SECRET_KEY);
      return payload;
    } catch (err) {
      throw err;
    }
  }


  static async changePassword(data, userId) {
    try {
      let query = 'SELECT * FROM users where id=$1';
      let resp = await pool.query(query, [userId]);
      let userData = resp.rows[0];
      if (!userData) throw new AuthenticationError();

      const match = await bcrypt.compare(data.currentPassword, userData.password);
      if (!match) throw new AuthenticationError();

      query = 'UPDATE users SET password=$1, updatedAt=$2 WHERE id=$3 RETURNING *';
      const pass = await bcrypt.hash(data.password, SALT);
      resp = await pool.query(query, [pass, new Date(), userData.id]);
      userData = resp.rows[0];

      delete userData.password;
      return userData;
    } catch (err) {
      throw err;
    }
  }
}

export default AuthService;
