import GifService from '../services/GifService';
import Send from '../utils/Send';
import ReqValidator from '../utils/validator';
import ArticleService from "../services/ArticleService";

class GifController {
  static async createGif(req, res) {
    try {
      req.body.imageUrl = req.file && req.file.secure_url;
      const valid = await ReqValidator.validate(req, res, {
        title: 'required',
        imageUrl: 'required',
      });
      if (!valid) return;
      const data = {
        title: req.body.title,
        imageUrl: req.body.imageUrl,
      };
      const resData = await GifService.createGif(data, req.user.id);
      Send.success(res, 201, resData);
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
      const resData = await GifService.createComment(data, req.params.gifId, req.user.id);
      Send.success(res, 201, resData);
    } catch (err) {
      Send.error(res, err);
    }
  }

  static async deleteGif(req, res) {
    try {
      const resData = await GifService.deleteGif(req.params.gifId, req.user.id);
      Send.success(res, 200, resData);
    } catch (err) {
      Send.error(res, err);
    }
  }

  static async flagInappropriate(req, res) {
    try {
      const resData = await GifService.inappropriateFlag(req.params.gifId, req.user.id);
      Send.success(res, 200, resData);
    } catch (err) {
      Send.error(res, err);
    }
  }

  static async flagCommentInappropriate(req, res) {
    try {
      const resData = await GifService.commentInappropriateFlag(req.params.gifId, req.params.commentId, req.user.id);
      Send.success(res, 200, resData);
    } catch (err) {
      Send.error(res, err);
    }
  }

  static async deleteInappropriateGif(req, res) {
    try {
      const resData = await GifService.deleteInappropriateGif(req.params.gifId);
      Send.success(res, 200, resData);
    } catch (err) {
      Send.error(res, err);
    }
  }

  static async deleteInappropriateGifComment(req, res) {
    try {
      const resData = await GifService.deleteInappropriateGifComment(req.params.gifId, req.params.commentId);
      Send.success(res, 200, resData);
    } catch (err) {
      Send.error(res, err);
    }
  }


  static async getEmployeeGifs(req, res) {
    try {
      const resData = await GifService.getEmployeeGifs(req.params.employeeId);
      Send.success(res, 200, resData);
    } catch (err) {
      Send.error(res, err);
    }
  }

  static async getGifs(req, res) {
    try {
      const resData = await GifService.getGifs();
      Send.success(res, 200, resData);
    } catch (err) {
      Send.error(res, err);
    }
  }

  static async getGifById(req, res) {
    try {
      const resData = await GifService.getGifById(req.params.gifId);
      Send.success(res, 200, resData);
    } catch (err) {
      Send.error(res, err);
    }
  }

}

export default GifController;
