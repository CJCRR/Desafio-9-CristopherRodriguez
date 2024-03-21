import  productsModel  from "../models/products.model.js"

export default class ProductManager {

    categories = async () => {
        try {
            const categories = await productsModel.aggregate([
                {
                    $group: {
                        _id: null,
                        categories: { $addToSet: "$category" }
                    }
                }
            ])

            return categories[0].categories

        }
        catch (err) {
            console.log(err);
            return err
        }

    }

    getProductsView = async () => {
        try {
            return await productsModel.find().lean();

        } catch (err) {
            return err
        }
    };

    getProducts = async (filter, options) => {
        try {
            return await productsModel.paginate(filter, options);
        } catch (err) {
            return err
        }
    }



    getProductById = async (id) => {
        try {
          const product = await productsModel.findById(id).lean()
          if (product) {
            product._id = product._id.toString()
            return product
          } else {
            return null
          }
        } catch (error) {
          console.log("cannot update user on mongo: " + error)
        }
      }

    addProduct = async (product) => {
        try {
            await productsModel.create(product);
            return await productsModel.findOne({ title: product.title })
        }
        catch(error){
            console.log("cannot update user on mongo: "+ error);
        }

    }

    updateProduct = async (id, product) => {
        try {
            return await productsModel.findByIdAndUpdate(id, { $set: product });
        } catch(error){
            console.log("cannot update user on mongo: "+ error);
        }

    }

    deleteProduct = async (id) => {
        try {
            return await productsModel.findByIdAndDelete(id);
        } catch(error){
            console.log("cannot update user on mongo: "+ error);
        }
    }

}