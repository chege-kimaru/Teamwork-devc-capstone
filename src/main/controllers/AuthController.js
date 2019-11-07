import AuthService from '../services/AuthService';
import Send from '../utils/Send';
import ReqValidator from '../utils/validator';

class AuthController {
  static async signin(req, res) {
    try {
      const valid = await ReqValidator.validate(req, res, {
        email: 'required|email',
        password: 'required',
      });
      if (!valid) return;
      const data = {
        email: req.body.email,
        password: req.body.password,
      };
      const resData = await AuthService.signIn(data);
      Send.success(res, 200, resData);
    } catch (err) {
      Send.error(res, err);
    }
  }
}

export default AuthController;
