import jwt from 'jsonwebtoken';
import Send from '../utils/Send';
import {AuthorizationError} from '../utils/errors';
import AuthService from '../services/AuthService';

class Middlewares {
  static Auth(req, res, next) {
    const {token} = req.headers;
    jwt.verify(token, process.env.SECRET_KEY, async (err, decoded) => {
      if (err) return Send.error(res, new AuthorizationError('Auth: You are not authorized'));
      try {
        req.user = await AuthService.findUserById(decoded.id);
        return next();
      } catch (error) {
        return Send.error(res, error);
      }
    });
  }

  static adminAuth(req, res, next) {
    const {token} = req.headers;
    jwt.verify(token, process.env.SECRET_KEY, async (err, decoded) => {
      if (err || +decoded.role !== 1) return Send.error(res, new AuthorizationError());
      try {
        req.user = await AuthService.findUserById(decoded.id);
        return next();
      } catch (error) {
        return Send.error(res, error);
      }
    });
  }
}

export default Middlewares;
