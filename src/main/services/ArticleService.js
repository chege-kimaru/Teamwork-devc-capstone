import db from '../utils/db';
import { ResourceNotFoundError } from '../utils/errors';

const { pool } = db;

class ArticleService {
  static async createArticle(article, employeeId) {
    try {
      const query = 'INSERT INTO articles (employeeId, title, article, tags) VALUES ($1, $2, $3, $4) RETURNING *';
      const values = [employeeId, article.title, article.article, article.tags];
      const res = await pool.query(query, values);
      return res.rows[0];
    } catch (err) {
      throw err;
    }
  }

  static async getEmployeeArticles(employeeId) {
    try {
      const empQuery = 'SELECT id FROM employees WHERE id=$1';
      const empRes = await pool.query(empQuery, [employeeId]);
      if (!empRes.rows || !empRes.rows[0] || !empRes.rows[0].id) throw new ResourceNotFoundError('This employee does not exist');
      const query = 'SELECT * FROM articles where employeeId=$1 ORDER BY createdAt DESC';
      const resp = await pool.query(query, [employeeId]);
      return resp.rows;
    } catch (err) {
      throw err;
    }
  }
}

export default ArticleService;
