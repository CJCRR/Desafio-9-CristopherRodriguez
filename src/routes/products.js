import { Router } from 'express';
//import ProductManager from "../dao/mongooseManager/products.dao.js"
import productModel from '../dao/models/products.model.js';

//const pm = new ProductManager()

const Product = productModel();
const filePathProducts = './src/productos.json';

const router = Router();

// Ruta raíz GET /api/products - Listar todos los productos

router.get('/', async (req, res) => {
  console.log('¡Solicitud recibida!');
  
  try {
    const limit = req.query.limit || 10
    const page = req.query.page || 1
    const filterOptions = {}

    if (req.query.stock) filterOptions.stock = req.query.stock
    if (req.query.category) filterOptions.category = req.query.category
    const paginateOptions = { limit, page }
    if (req.query.sort === 'asc') paginateOptions.sort = { price: 1 }
    if (req.query.sort === 'desc') paginateOptions.sort = { price: -1 }
    const result = await productModel.paginate(filterOptions, paginateOptions)
    res.status(200).json({
      status: 'success',
      payload: result.docs,
      totalPages: result.totalPages,
      prevPage: result.prevPage,
      nextPage: result.nextPage,
      page: result.page,
      hasPrevPage: result.hasPrevPage,
      hasNextPage: result.hasNextPage,
      prevLink: result.hasPrevPage ? `/api/products?limit=${limit}&page=${result.prevPage}` : null,
      nextLink: result.hasNextPage ? `/api/products?limit=${limit}&page=${result.nextPage}` : null,
    });

  } catch (error) {
    console.log('Error al leer el archivo:', error);
    res.status(500).json({ error: 'Error al leer el archivo' });
  }
});


// Ruta GET /api/products/:pid - Traer sólo el producto con el id proporcionado
router.get("/:pid", async (req, res) => {
  const id = req.params.pid;
  try {
    const product = await productModel.findById(id).lean().exec();
    if (product) {
      res.status(200).json(product);
    } else {
      res.status(404).json({ error: 'Producto no encontrado' });
    }
  } catch (error) {
    console.log('Error al leer el producto:', error);
    res.status(500).json({ error: 'Error al leer el producto' });
  }
});

// Ruta raíz POST /api/products - Agregar un nuevo producto
router.post("/", async (req, res) => {
  try {
    const product = req.body
    const result = await productModel.create(product);
    const products = await productModel.find().lean().exec();
    req.io.emit('productList', products); // emite el evento updatedProducts con la lista de productos
    res.status(201).json({ status: 'success', payload: result });
  } catch (error) {
    res.status(500).json({ status: 'error', error: error.message });
  }
});

// Ruta PUT /api/products/:pid - Actualizar un producto
router.put("/:pid", async (req, res) => {
  try {
    const productId = req.params.pid;
    const updatedFields = req.body;

    const updatedProduct = await productModel.findByIdAndUpdate(productId, updatedFields, {
      new: true // Para devolver el documento actualizado
    }).lean().exec();

    if (!updatedProduct) {
      res.status(404).json({ error: 'Producto no encontrado' });
      return;
    }

    const products = await productModel.find().lean().exec();

    req.io.emit('productList', products);

    res.status(200).json(updatedProduct);
  } catch (error) {
    console.log('Error al actualizar el producto:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
});

// Ruta DELETE /api/products/:pid - Eliminar un producto
router.delete("/:pid", async (req, res) => {
  try {
    const productId = req.params.pid;

    const deletedProduct = await productModel.findByIdAndDelete(productId).lean().exec();

    if (!deletedProduct) {
      res.status(404).json({ error: 'Producto no encontrado' });
      return;
    }

    const products = await productModel.find().lean().exec();

    req.io.emit('productList', products);

    res.status(200).json({ message: 'Producto eliminado' });
  } catch (error) {
    console.log('Error al eliminar el producto:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
});


export default router;