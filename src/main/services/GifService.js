import db from '../utils/db';
import {AuthorizationError, ResourceNotFoundError} from '../utils/errors';

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

  static async createComment(comment, gifId, employeeId) {
    try {
      const aQuery = 'SELECT id FROM gifs WHERE id=$1';
      const aRes = await pool.query(aQuery, [gifId]);
      if (!aRes.rows || !aRes.rows[0] || !aRes.rows[0].id) throw new ResourceNotFoundError('This gif does not exist');

      const query = 'INSERT INTO gifComments (employeeId, gifId, commentm) VALUES ($1, $2, $3) RETURNING *';
      const values = [employeeId, gifId, comment.comment];
      const res = await pool.query(query, values);
      return res.rows[0];
    } catch (err) {
      throw err;
    }
  }

  static async deleteGif(gifId, employeeId) {
    try {
      const aQuery = 'SELECT id, employeeId FROM gifs WHERE id=$1';
      const aRes = await pool.query(aQuery, [gifId]);
      if (!aRes.rows || !aRes.rows[0] || !aRes.rows[0].id) throw new ResourceNotFoundError('This gif does not exist');
      if (aRes.rows[0].employeeid !== employeeId) throw new AuthorizationError('You are not authorized to delete this gif.');

      const query = 'DELETE FROM gifs WHERE id=$1';
      const values = [gifId];
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
