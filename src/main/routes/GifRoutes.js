import { Router } from 'express';
import GifController from '../controllers/GifController';
import Upload from '../middlewares/upload';
import Middlewares from '../middlewares';

const router = Router();

router.post('/', Middlewares.Auth, Upload.single('image'), GifController.createGif);
router.post('/:gifId/comments', Middlewares.Auth, GifController.createComment);
router.delete('/:gifId', Middlewares.Auth, GifController.deleteGif);
router.get('/employee/:employeeId', Middlewares.Auth, GifController.getEmployeeGifs);
router.get('/', Middlewares.Auth, GifController.getGifs);
router.get('/:gifId', Middlewares.Auth, GifController.getGifById);



export default router;
