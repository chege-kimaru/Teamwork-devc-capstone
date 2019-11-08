import { Router } from 'express';
import AuthRoutes from './AuthRoutes';
import EmployeeRoutes from './EmployeeRoutes';
import GifRoutes from './GifRoutes';

const router = Router();

router.use('/auth', AuthRoutes);
router.use('/employees', EmployeeRoutes);
router.use('/gifs', GifRoutes);

export default router;
