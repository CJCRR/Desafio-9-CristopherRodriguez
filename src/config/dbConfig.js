import mongoose from "mongoose"

const URI="mongodb+srv://cjcrr:cruz0606@cluster0606.qoy5tos.mongodb.net/ecommerce?retryWrites=true&w=majority"

const connectToDB = () => {
    try {
        mongoose.connect(URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
          })
        console.log('Base de datos ecommerce conectada')
    } catch (error) {
        console.log(error);
    }
};

export default connectToDB