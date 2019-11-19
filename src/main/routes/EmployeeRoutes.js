import { Router } from 'express';
import EmployeeController from '../controllers/EmployeeController';
import Middlewares from '../middlewares';

const router = Router();

router.post('/', Middlewares.adminAuth, EmployeeController.createEmployee);
router.get('/:employeeId/articles', Middlewares.Auth, EmployeeController.getEmployeeArticles);
router.get('/:employeeId/gifs', Middlewares.Auth, EmployeeController.getEmployeeGifs);

export default router;
