import db from '../utils/db';
import {ResourceNotFoundError, AuthorizationError, OperationNotAllowedError} from '../utils/errors';

const {pool} = db;

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
      const aQuery = 'SELECT id, employeeId FROM articles WHERE id=$1 AND status=1';
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

  /**
   *
   * @param articleId
   * @param employeeId
   * @returns {Promise<boolean>}
   * Toggle inappropriate flag
   */
  static async inappropriateFlag(articleId, employeeId) {
    try {
      const aQuery = 'SELECT id FROM articles WHERE id=$1 AND status=1';
      const aRes = await pool.query(aQuery, [articleId]);
      if (!aRes.rows || !aRes.rows[0] || !aRes.rows[0].id) throw new ResourceNotFoundError('This article does not exist');

      const fQuery = 'SELECT id FROM inappropriateFlags WHERE articleId=$1 AND employeeId=$2';
      const fRes = await pool.query(fQuery, [articleId, employeeId]);
      if (fRes.rows && fRes.rows[0] && fRes.rows[0].id) {
        const dQuery = 'DELETE FROM inappropriateFlags WHERE articleId=$1 AND employeeId=$2';
        await pool.query(dQuery, [articleId, employeeId]);
        return false;
      }

      const query = 'INSERT INTO inappropriateFlags (articleId, employeeId) VALUES ($1, $2) RETURNING *';
      const values = [articleId, employeeId];
      await pool.query(query, values);
      return true;
    } catch (err) {
      throw err;
    }
  }

  static async commentInappropriateFlag(articleId, commentId, employeeId) {
    try {
      const aQuery = 'SELECT id FROM articleComments WHERE id=$1 AND articleId=$2 AND status=1';
      const aRes = await pool.query(aQuery, [commentId, articleId]);
      if (!aRes.rows || !aRes.rows[0] || !aRes.rows[0].id) throw new ResourceNotFoundError('This comment does not exist');

      const fQuery = 'SELECT id FROM inappropriateFlags WHERE articleCommentId=$1 AND employeeId=$2';
      const fRes = await pool.query(fQuery, [commentId, employeeId]);
      if (fRes.rows && fRes.rows[0] && fRes.rows[0].id) {
        const dQuery = 'DELETE FROM inappropriateFlags WHERE articleCommentId=$1 AND employeeId=$2';
        await pool.query(dQuery, [commentId, employeeId]);
        return false;
      }

      const query = 'INSERT INTO inappropriateFlags (articleCommentId, employeeId) VALUES ($1, $2) RETURNING *';
      const values = [commentId, employeeId];
      await pool.query(query, values);
      return true;
    } catch (err) {
      throw err;
    }
  }

  static async createComment(comment, articleId, employeeId) {
    try {
      const aQuery = 'SELECT id FROM articles WHERE id=$1 AND status=1';
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
      const aQuery = 'SELECT id, employeeId FROM articles WHERE id=$1 AND status=1';
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

  static async deleteInappropriateArticle(articleId) {
    try {
      const aQuery = 'SELECT id FROM articles WHERE id=$1 AND status=1';
      const aRes = await pool.query(aQuery, [articleId]);
      if (!aRes.rows || !aRes.rows[0] || !aRes.rows[0].id) throw new ResourceNotFoundError('This article does not exist');

      const fQuery = 'SELECT id FROM inappropriateFlags WHERE articleId=$1';
      const fRes = await pool.query(fQuery, [articleId]);
      if (!fRes.rows || !fRes.rows.length >= 1) throw new OperationNotAllowedError('This article has not been marked as inappropriate');

      const query = 'UPDATE articles SET status=0 WHERE id=$1 RETURNING *';
      const values = [articleId];
      const res = await pool.query(query, values);
      return res.rows[0];
    } catch (err) {
      throw err;
    }
  }

  static async deleteInappropriateArticleComment(articleId, commentId) {
    try {
      const aQuery = 'SELECT id FROM articleComments WHERE id=$1 AND articleId=$2 AND status=1';
      const aRes = await pool.query(aQuery, [commentId, articleId]);
      if (!aRes.rows || !aRes.rows[0] || !aRes.rows[0].id) throw new ResourceNotFoundError('This comment does not exist');

      const fQuery = 'SELECT id FROM inappropriateFlags WHERE articleCommentId=$1';
      const fRes = await pool.query(fQuery, [commentId]);
      if (!fRes.rows || !fRes.rows.length >= 1) throw new OperationNotAllowedError('This comment has not been marked as inappropriate');

      const query = 'UPDATE articleComments SET status=0 WHERE id=$1 RETURNING *';
      const values = [commentId];
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
      const query = 'SELECT * FROM articles where employeeId=$1 AND status=1 ORDER BY createdAt DESC';
      const resp = await pool.query(query, [employeeId]);
      return resp.rows;
    } catch (err) {
      throw err;
    }
  }

  static async getArticles() {
    try {
      const query = `SELECT a.*, CONCAT(e.firstName, \' \', e.lastName) AS author 
                    FROM articles a, employees e 
                    WHERE a.employeeId=e.id AND status=1
                    ORDER BY createdAt DESC`;
      const resp = await pool.query(query);
      return resp.rows;
    } catch (err) {
      throw err;
    }
  }

  static async getArticlesByTag(tag) {
    try {
      const query = `SELECT a.*, CONCAT(e.firstName, ' ', e.lastName) AS author 
                     FROM articles a, employees e
                     WHERE a.employeeId=e.id  AND status=1
                     AND tags LIKE $1 OR tags LIKE $2 OR tags LIKE $3 
                     ORDER BY createdAt DESC`;
      const resp = await pool.query(query, [`%,${tag}`, `${tag},%`, `%,${tag},%`]);
      return resp.rows;
    } catch (err) {
      throw err;
    }
  }

  static async getArticleById(articleId) {
    try {
      const query = `SELECT a.*, CONCAT(e.firstName, \' \', e.lastName) AS author, e.id AS authorid 
                    FROM articles a, employees e 
                    WHERE a.employeeId=e.id AND a.id=$1 AND status=1`;
      const resp = await pool.query(query, [articleId]);
      const article = resp.rows[0];

      if (!article || !article.id) throw new ResourceNotFoundError('This article does not exist');

      const cquery = 'SELECT * FROM articleComments WHERE articleId=$1 AND status=1 ORDER BY createdAt DESC';
      const cresp = await pool.query(cquery, [articleId]);
      article.comments = cresp.rows;

      return article;
    } catch (err) {
      throw err;
    }
  }
}

export default ArticleService;
