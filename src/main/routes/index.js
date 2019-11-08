import { Router } from 'express';
import AuthRoutes from './AuthRoutes';
import EmployeeRoutes from './EmployeeRoutes';

const router = Router();

router.use('/auth', AuthRoutes);
router.use('/employees', EmployeeRoutes);

export default router;
