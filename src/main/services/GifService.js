import db from '../utils/db';
import { ResourceNotFoundError } from '../utils/errors';

const { pool } = db;

class GifService {
  static async createGif(gif, employeeId) {
    try {
      const query = 'INSERT INTO gifs (employeeId, title, imageUrl) VALUES ($1, $2, $3) RETURNING *';
      const values = [employeeId, gif.title, gif.imageUrl];
      const res = await pool.query(query, values);
      return res.rows[0];
    } catch (err) {
      throw err;
    }
  }

  static async getEmployeeGifs(employeeId) {
    try {
      const empQuery = 'SELECT id FROM employees WHERE id=$1';
      const empRes = await pool.query(empQuery, [employeeId]);
      if (!empRes.rows || !empRes.rows[0] || !empRes.rows[0].id) throw new ResourceNotFoundError('This employee does not exist');
      const query = 'SELECT * FROM gifs where employeeId=$1 ORDER BY createdAt DESC';
      const resp = await pool.query(query, [employeeId]);
      return resp.rows;
    } catch (err) {
      throw err;
    }
  }
}

export default GifService;
