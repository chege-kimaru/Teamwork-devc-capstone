import { Router } from 'express';
import AuthRoutes from './AuthRoutes';
import EmployeeRoutes from './EmployeeRoutes';
import GifRoutes from './GifRoutes';
import ArticleRoutes from './ArticleRoutes';

const router = Router();

router.use('/auth', AuthRoutes);
router.use('/employees', EmployeeRoutes);
router.use('/gifs', GifRoutes);
router.use('/articles', ArticleRoutes);

export default router;
