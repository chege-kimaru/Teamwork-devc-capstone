import { Router } from 'express';
import EmployeeController from '../controllers/EmployeeController';
import Middlewares from '../middlewares';

const router = Router();

router.post('/', Middlewares.adminAuth, EmployeeController.createEmployee);

export default router;
