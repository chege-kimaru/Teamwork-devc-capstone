import { Router } from 'express';
import Middlewares from '../middlewares';
import ArticleController from '../controllers/ArticleController';

const router = Router();

router.post('/', Middlewares.Auth, ArticleController.createArticle);
router.post('/:articleId/comments', Middlewares.Auth, ArticleController.createComment);
router.put('/:articleId', Middlewares.Auth, ArticleController.updateArticle);
router.delete('/:articleId', Middlewares.Auth, ArticleController.deleteArticle);
router.get('/employee/:employeeId', Middlewares.Auth, ArticleController.getEmployeeArticles);
router.get('/', Middlewares.Auth, ArticleController.getArticles);
router.get('/:articleId', Middlewares.Auth, ArticleController.getArticleById);

export default router;
