import { Router } from 'express';
import Middlewares from '../middlewares';
import ArticleController from '../controllers/ArticleController';

const router = Router();

router.post('/', Middlewares.Auth, ArticleController.createArticle);
router.post('/:articleId/comments', Middlewares.Auth, ArticleController.createComment);
router.put('/:articleId/inappropriate', Middlewares.Auth, ArticleController.flagInappropriate);
router.put('/:articleId/comments/:commentId/inappropriate', Middlewares.Auth, ArticleController.flagCommentInappropriate);
router.put('/:articleId', Middlewares.Auth, ArticleController.updateArticle);
router.delete('/:articleId', Middlewares.Auth, ArticleController.deleteArticle);
router.delete('/:articleId/inappropriate', Middlewares.adminAuth, ArticleController.deleteInappropriateArticle);
router.delete('/:articleId/comments/:commentId/inappropriate',
  Middlewares.adminAuth, ArticleController.deleteInappropriateArticleComment);
router.get('/employee/:employeeId', Middlewares.Auth, ArticleController.getEmployeeArticles);
router.get('/', Middlewares.Auth, ArticleController.getArticles);
router.get('/:articleId', Middlewares.Auth, ArticleController.getArticleById);
router.get('/tag/:tag', Middlewares.Auth, ArticleController.getArticlesByTag);

export default router;
