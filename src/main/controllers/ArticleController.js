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

  static async getEmployeeArticles(req, res) {
    try {
      const resData = await ArticleService.getEmployeeArticles(req.params.employeeId);
      Send.success(res, 200, resData);
    } catch (err) {
      Send.error(res, err);
    }
  }
}

export default ArticleController;