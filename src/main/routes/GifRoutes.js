import {Router} from 'express';
import GifController from '../controllers/GifController';
import Upload from '../middlewares/upload';
import Middlewares from '../middlewares';

const router = Router();

router.post('/', Middlewares.Auth, Upload.single('image'), GifController.createGif);
router.post('/:gifId/comments', Middlewares.Auth, GifController.createComment);
router.put('/:gifId/inappropriate', Middlewares.Auth, GifController.flagInappropriate);
router.put('/:gifId/comments/:commentId/inappropriate', Middlewares.Auth, GifController.flagCommentInappropriate);
router.delete('/:gifId', Middlewares.Auth, GifController.deleteGif);
router.delete('/:gifId/inappropriate', Middlewares.adminAuth, GifController.deleteInappropriateGif);
router.delete('/:gifId/comments/:commentId/inappropriate',
  Middlewares.adminAuth, GifController.deleteInappropriateGifComment);
router.get('/', Middlewares.Auth, GifController.getGifs);
router.get('/:gifId', Middlewares.Auth, GifController.getGifById);


export default router;
