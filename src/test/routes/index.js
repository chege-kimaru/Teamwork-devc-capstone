import AuthRouteTests from './AuthRoutes';
import EmployeeRoutes from './EmployeeRoutes';
import GifRoutes from './GifRoutes';
import ArticleRoutes from './ArticleRoutes';

const test = () => {
  AuthRouteTests();
  EmployeeRoutes();
  GifRoutes();
  ArticleRoutes();
};

export default test;
