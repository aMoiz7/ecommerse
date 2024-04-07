import { Router } from "express";
import { upload } from "../middlewares/multer.js";
import { newProduct , allproduct , latestProduct , allCategories , adminallproduct, singleProduct , updateProduct ,deleteProduct} from "../controllers/productController.js";

const router = Router();


router.route('/new').post(upload.single("photo") , newProduct )
router.route('/all').get(allproduct)
router.route('/latest').get(latestProduct)
router.route('/categories').get(allCategories)
router.route('/admin-products').get(adminallproduct)
router.route('/:id').get(singleProduct).put(upload.single("photo"),updateProduct ).delete(deleteProduct)


export default router