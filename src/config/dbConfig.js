import mongoose from "mongoose"
import config from "./config";

const mongoURL = config.mongoURL;

const URI= mongoURL

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