import db from '../utils/db';
import { AuthorizationError, OperationNotAllowedError, ResourceNotFoundError } from '../utils/errors';

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
      const aQuery = 'SELECT id FROM gifs WHERE id=$1 AND status=1';
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

  /**
   *
   * @param gifId
   * @param employeeId
   * @returns {Promise<boolean>}
   * Toggle inappropriate flag
   */
  static async inappropriateFlag(gifId, employeeId) {
    try {
      const aQuery = 'SELECT id FROM gifs WHERE id=$1 AND status=1';
      const aRes = await pool.query(aQuery, [gifId]);
      if (!aRes.rows || !aRes.rows[0] || !aRes.rows[0].id) throw new ResourceNotFoundError('This gif does not exist');

      const fQuery = 'SELECT id FROM inappropriateFlags WHERE gifId=$1 AND employeeId=$2';
      const fRes = await pool.query(fQuery, [gifId, employeeId]);
      if (fRes.rows && fRes.rows[0] && fRes.rows[0].id) {
        const dQuery = 'DELETE FROM inappropriateFlags WHERE gifId=$1 AND employeeId=$2';
        await pool.query(dQuery, [gifId, employeeId]);
        return false;
      }

      const query = 'INSERT INTO inappropriateFlags (gifId, employeeId) VALUES ($1, $2) RETURNING *';
      const values = [gifId, employeeId];
      await pool.query(query, values);
      return true;
    } catch (err) {
      throw err;
    }
  }

  static async commentInappropriateFlag(gifId, commentId, employeeId) {
    try {
      const aQuery = 'SELECT id FROM gifComments WHERE id=$1 AND gifId=$2 AND status=1';
      const aRes = await pool.query(aQuery, [commentId, gifId]);
      if (!aRes.rows || !aRes.rows[0] || !aRes.rows[0].id) throw new ResourceNotFoundError('This comment does not exist');

      const fQuery = 'SELECT id FROM inappropriateFlags WHERE gifCommentId=$1 AND employeeId=$2';
      const fRes = await pool.query(fQuery, [commentId, employeeId]);
      if (fRes.rows && fRes.rows[0] && fRes.rows[0].id) {
        const dQuery = 'DELETE FROM inappropriateFlags WHERE gifCommentId=$1 AND employeeId=$2';
        await pool.query(dQuery, [commentId, employeeId]);
        return false;
      }

      const query = 'INSERT INTO inappropriateFlags (gifCommentId, employeeId) VALUES ($1, $2) RETURNING *';
      const values = [commentId, employeeId];
      await pool.query(query, values);
      return true;
    } catch (err) {
      throw err;
    }
  }

  static async deleteGif(gifId, employeeId) {
    try {
      const aQuery = 'SELECT id, employeeId FROM gifs WHERE id=$1 and status=1';
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

  static async deleteInappropriateGif(gifId) {
    try {
      const aQuery = 'SELECT id FROM gifs WHERE id=$1 and status=1';
      const aRes = await pool.query(aQuery, [gifId]);
      if (!aRes.rows || !aRes.rows[0] || !aRes.rows[0].id) throw new ResourceNotFoundError('This gif does not exist');

      const fQuery = 'SELECT id FROM inappropriateFlags WHERE gifId=$1';
      const fRes = await pool.query(fQuery, [gifId]);
      if (!fRes.rows || !fRes.rows.length >= 1) throw new OperationNotAllowedError('This gif has not been marked as inappropriate');

      const query = 'UPDATE gifs SET status=0, updatedAt=$1 WHERE id=$2 RETURNING *';
      const values = [new Date(), gifId];
      const res = await pool.query(query, values);
      return res.rows[0];
    } catch (err) {
      throw err;
    }
  }

  static async deleteInappropriateGifComment(gifId, commentId) {
    try {
      const aQuery = 'SELECT id FROM gifComments WHERE id=$1 AND gifId=$2 AND status=1';
      const aRes = await pool.query(aQuery, [commentId, gifId]);
      if (!aRes.rows || !aRes.rows[0] || !aRes.rows[0].id) throw new ResourceNotFoundError('This comment does not exist');

      const fQuery = 'SELECT id FROM inappropriateFlags WHERE gifCommentId=$1';
      const fRes = await pool.query(fQuery, [commentId]);
      if (!fRes.rows || !fRes.rows.length >= 1) throw new OperationNotAllowedError('This comment has not been marked as inappropriate');

      const query = 'UPDATE gifComments SET status=0, updatedAt=$1 WHERE id=$2 RETURNING *';
      const values = [new Date(), commentId];
      const res = await pool.query(query, values);
      return res.rows[0];
    } catch (err) {
      throw err;
    }
  }

  static async getGifs() {
    try {
      const query = `SELECT g.*, CONCAT(e.firstName, ' ', e.lastName) AS author 
                     FROM gifs g, employees e 
                     WHERE g.employeeId=e.id AND status=1 ORDER BY createdAt DESC`;
      const resp = await pool.query(query);
      return resp.rows;
    } catch (err) {
      throw err;
    }
  }

  static async getGifById(gifId) {
    try {
      const query = `SELECT g.*, CONCAT(e.firstName, ' ', e.lastName) AS author, e.id AS authorid 
                    FROM gifs g, employees e 
                    WHERE g.employeeId=e.id AND status=1 AND g.id=$1`;
      const resp = await pool.query(query, [gifId]);
      const gif = resp.rows[0];

      if (!gif || !gif.id) throw new ResourceNotFoundError('This gif does not exist');

      const cquery = 'SELECT * FROM gifComments WHERE gifId=$1 AND status=1 ORDER BY createdAt DESC';
      const cresp = await pool.query(cquery, [gifId]);
      gif.comments = cresp.rows;

      return gif;
    } catch (err) {
      throw err;
    }
  }
}

export default GifService;
