import { Router } from 'express';
import Middlewares from '../middlewares';
import ArticleController from '../controllers/ArticleController';

const router = Router();

router.post('/', Middlewares.Auth, ArticleController.createArticle);
router.put('/:articleId', Middlewares.Auth, ArticleController.updateArticle);
router.delete('/:articleId', Middlewares.Auth, ArticleController.deleteArticle);
router.get('/employee/:employeeId', Middlewares.Auth, ArticleController.getEmployeeArticles);
router.post('/:articleId/comments', Middlewares.Auth, ArticleController.createComment);

export default router;
