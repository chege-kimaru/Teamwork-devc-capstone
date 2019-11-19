import GifService from '../services/GifService';
import Send from '../utils/Send';
import ReqValidator from '../utils/validator';
import ArticleService from '../services/ArticleService';

class ArticleController {
  static async createArticle(req, res) {
    try {
      const valid = await ReqValidator.validate(req, res, {
        title: 'required',
        article: 'required',
      });
      if (!valid) return;
      const data = {
        title: req.body.title,
        article: req.body.article,
        tags: req.body.tags,
      };
      const resData = await ArticleService.createArticle(data, req.user.id);
      Send.success(res, 201, resData);
    } catch (err) {
      Send.error(res, err);
    }
  }

  static async updateArticle(req, res) {
    try {
      const valid = await ReqValidator.validate(req, res, {
        title: 'required',
        article: 'required',
      });
      if (!valid) return;
      const data = {
        title: req.body.title,
        article: req.body.article,
        tags: req.body.tags,
      };
      const resData = await ArticleService.updateArticle(data, req.params.articleId, req.user.id);
      Send.success(res, 200, resData);
    } catch (err) {
      Send.error(res, err);
    }
  }

  static async deleteArticle(req, res) {
    try {
      const resData = await ArticleService.deleteArticle(req.params.articleId, req.user.id);
      Send.success(res, 200, resData);
    } catch (err) {
      Send.error(res, err);
    }
  }

  static async deleteInappropriateArticle(req, res) {
    try {
      const resData = await ArticleService.deleteInappropriateArticle(req.params.articleId);
      Send.success(res, 200, resData);
    } catch (err) {
      Send.error(res, err);
    }
  }

  static async deleteInappropriateArticleComment(req, res) {
    try {
      const resData = await ArticleService.deleteInappropriateArticleComment(req.params.articleId, req.params.commentId);
      Send.success(res, 200, resData);
    } catch (err) {
      Send.error(res, err);
    }
  }

  static async flagInappropriate(req, res) {
    try {
      const resData = await ArticleService.inappropriateFlag(req.params.articleId, req.user.id);
      Send.success(res, 200, resData);
    } catch (err) {
      Send.error(res, err);
    }
  }

  static async flagCommentInappropriate(req, res) {
    try {
      const resData = await ArticleService.commentInappropriateFlag(req.params.articleId, req.params.commentId, req.user.id);
      Send.success(res, 200, resData);
    } catch (err) {
      Send.error(res, err);
    }
  }

  static async createComment(req, res) {
    try {
      const valid = await ReqValidator.validate(req, res, {
        comment: 'required'
      });
      if (!valid) return;
      const data = {
        comment: req.body.comment
      };
      const resData = await ArticleService.createComment(data, req.params.articleId, req.user.id);
      Send.success(res, 201, resData);
    } catch (err) {
      Send.error(res, err);
    }
  }

  static async getEmployeeArticles(req, res) {
    try {
      const resData = await ArticleService.getEmployeeArticles(req.params.employeeId);
      Send.success(res, 200, resData);
    } catch (err) {
      Send.error(res, err);
    }
  }

  static async getArticles(req, res) {
    try {
      const resData = await ArticleService.getArticles();
      Send.success(res, 200, resData);
    } catch (err) {
      Send.error(res, err);
    }
  }

  static async getArticlesByTag(req, res) {
    try {
      const resData = await ArticleService.getArticlesByTag(req.params.tag);
      Send.success(res, 200, resData);
    } catch (err) {
      Send.error(res, err);
    }
  }

  static async getArticleById(req, res) {
    try {
      const resData = await ArticleService.getArticleById(req.params.articleId);
      Send.success(res, 200, resData);
    } catch (err) {
      Send.error(res, err);
    }
  }
}

export default ArticleController;
