import { Router } from 'express';
import Middlewares from '../middlewares';
import ArticleController from '../controllers/ArticleController';

const router = Router();

router.post('/', Middlewares.Auth, ArticleController.createArticle);
router.put('/:articleId', Middlewares.Auth, ArticleController.updateArticle);
router.get('/employee/:employeeId', Middlewares.Auth, ArticleController.getEmployeeArticles);

export default router;
