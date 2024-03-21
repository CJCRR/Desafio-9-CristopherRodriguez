import { Router } from 'express';
//import  ProductManager from "../dao/mongooseManager/products.dao.js";
//import CartManager from '../dao/mongooseManager/carts.dao.js';
import  productsModel  from '../dao/models/products.model.js';
import  cartModel  from '../dao/models/carts.model.js';

//const pm = new ProductManager()
//const cm = new CartManager()

const router = Router();


router.get('/home', async (req, res) => {
  try {
    //const products = await ProductModel.find().lean().exec();
    let pageNum = parseInt(req.query.page) || 1;
    let itemsPorPage = parseInt(req.query.limit) || 10;
    const products = await productsModel.paginate({}, { page: pageNum , limit: itemsPorPage , lean:true });

    products.prevLink = products.hasPrevPage ? `/home?limit=${itemsPorPage}&page=${products.prevPage}` : '';
    products.nextLink = products.hasNextPage ? `/home?limit=${itemsPorPage}&page=${products.nextPage}` : '';
    

    console.log(products);
    
    res.render('home', products);
  } catch (error) {
    console.log('Error al leer los productos:', error);
    res.status(500).json({ error: 'Error al leer los productos' });
  }
  
});

router.get("/realtimeproducts", (req, res) => {
    res.render("realtimeproducts")
})

router.get("/realtimeproducts/:cid", async (req, res) => {
  try {
    const id = req.params.cid
    const result = await productsModel.findById(id).lean().exec();
    if (result === null) {
      return res.status(404).json({ status: 'error', error: 'Product not found' });
    }
    res.render('product', result);
  } catch (error) {
    res.status(500).json({ error: 'Error al leer los productos' });
  }
});

router.get('/carts/:cid', async (req, res) => {
  try {
    const id = req.params.cid
    const result = await cartModel.findById(id).lean().exec();
    if (result === null) {
      return res.status(404).json({ status: 'error', error: 'Cart not found' });
    }
    res.render('carts', { cid: result._id, products: result.products });
  } catch (error) {
    res.status(500).json({ status: 'error', error: error.message });
  }
});

router.get("/chat",(req,res)=>{
  res.render("chat")
})


export default router;