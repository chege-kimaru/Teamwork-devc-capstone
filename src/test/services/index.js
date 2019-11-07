import AuthServiceTests from './AuthService';
import AuthRoutesTests from '../routes/AuthRoutes';

const test = () => {
  AuthServiceTests();
  AuthRoutesTests();
};

export default test;
