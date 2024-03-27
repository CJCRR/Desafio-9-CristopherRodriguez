import { Router } from 'express';

import { isAuthenticated, isAdmin, hasAdminCredentials } from "../public/js/authMiddleware.js";
import { 
  readViewsProductsController, 
  readViewsRealTimeProductsController, 
  readViewsProductController,
  readViewsCartController,
  readViewsChats
} from "../controllers/views.controller.js";

const router = Router();


router.get('/home', isAuthenticated, readViewsProductsController);

router.get('/realtimeproducts', isAuthenticated, isAdmin, readViewsRealTimeProductsController);

router.get('/realtimeproducts/:cid', isAuthenticated, readViewsProductController);

router.get('/carts', isAuthenticated, readViewsCartController);

router.get('/chat', readViewsChats);
export default router;