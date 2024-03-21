import express from 'express';
import { __dirname } from './utils.js'
import handlebars from 'express-handlebars'
import { Server } from 'socket.io'
import connectToDB from "./config/dbConfig.js";

import routerProducts from './routes/products.js';
import routerCarts from './routes/carts.js';
import viewsRoutes from './routes/views.router.js'

import socketProducts from './listeners/socketProducts.js';
import socketChat from './listeners/socketChat.js';

import viewsUserRouter from "./routes/viewsUser.router.js"
import sessionsRouter from "./routes/sessions.router.js"
import session from "express-session"
import MongoStore from "connect-mongo"

import passport from 'passport'
import initializePassport from './config/passport.config.js'

const app = express();


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(`${__dirname}/public`));

// Handlebars configuracion
app.engine("handlebars", handlebars.engine());
app.set("view engine", "handlebars");
app.set("views",`${__dirname}/views`);

app.use(
  session({
    store: MongoStore.create({
      mongoUrl: 'mongodb+srv://cjcrr:cruz0606@cluster0606.qoy5tos.mongodb.net/ecommerce?retryWrites=true&w=majority',
      dbName: "ecommerce",
      mongoOptions: {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      },
      ttl: 200, // tiempo de visa de la sesión
    }),
    secret: "code",
    resave: true,
    saveUninitialized: true,
  })
);

// configuracion de passport
initializePassport();
app.use(passport.initialize());
app.use(passport.session());

app.use('/api/products', routerProducts);
app.use('/api/carts', routerCarts);
app.use("/", viewsRoutes);
app.use('/', viewsUserRouter);
app.use('/api/sessions', sessionsRouter);

app.use((req, res) => {
  res.render("404");
});

connectToDB()

const httpServer = app.listen(8080, () => {
  console.log("Escuchando puerto 8080");
});

const socketServer = new Server(httpServer)

socketProducts(socketServer)
socketChat(socketServer)
