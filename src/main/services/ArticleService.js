import db from '../utils/db';
import { ResourceNotFoundError, AuthorizationError } from '../utils/errors';

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

  static async updateArticle(article, articleId, employeeId) {
    try {
      const aQuery = 'SELECT id, employeeId FROM articles WHERE id=$1';
      const aRes = await pool.query(aQuery, [articleId]);
      if (!aRes.rows || !aRes.rows[0] || !aRes.rows[0].id) throw new ResourceNotFoundError('This article does not exist');
      if (aRes.rows[0].employeeid !== employeeId) throw new AuthorizationError('You are not authorized to edit this article.');

      const query = 'UPDATE articles SET title=$1, article=$2, tags=$3 WHERE id=$4 RETURNING *';
      const values = [article.title, article.article, article.tags, articleId];
      const res = await pool.query(query, values);
      return res.rows[0];
    } catch (err) {
      throw err;
    }
  }

  static async createComment(comment, articleId, employeeId) {
    try {
      const aQuery = 'SELECT id FROM articles WHERE id=$1';
      const aRes = await pool.query(aQuery, [articleId]);
      if (!aRes.rows || !aRes.rows[0] || !aRes.rows[0].id) throw new ResourceNotFoundError('This article does not exist');

      const query = 'INSERT INTO articleComments (employeeId, articleId, commentm) VALUES ($1, $2, $3) RETURNING *';
      const values = [employeeId, articleId, comment.comment];
      const res = await pool.query(query, values);
      return res.rows[0];
    } catch (err) {
      throw err;
    }
  }

  static async deleteArticle(articleId, employeeId) {
    try {
      const aQuery = 'SELECT id, employeeId FROM articles WHERE id=$1';
      const aRes = await pool.query(aQuery, [articleId]);
      if (!aRes.rows || !aRes.rows[0] || !aRes.rows[0].id) throw new ResourceNotFoundError('This article does not exist');
      if (aRes.rows[0].employeeid !== employeeId) throw new AuthorizationError('You are not authorized to delete this article.');

      const query = 'DELETE FROM articles WHERE id=$1';
      const values = [articleId];
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
