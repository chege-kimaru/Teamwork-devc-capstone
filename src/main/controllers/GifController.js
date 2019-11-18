import GifService from '../services/GifService';
import Send from '../utils/Send';
import ReqValidator from '../utils/validator';

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

  static async deleteGif(req, res) {
    try {
      const resData = await GifService.deleteGif(req.params.gifId, req.user.id);
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
}

export default GifController;
