import passport from 'passport';
import Cart from '../dao/models/carts.model.js'

export const createUserController = async (req, res, next) => {
  passport.authenticate('register', async (err, user, info) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to register' });
    }
    if (!user) {
      return res.status(400).json({ error: 'Failed to register' });
    }
    try {
      // Crear un nuevo carrito para el usuario
      const newCart = await Cart.create({ products: [] });

      // Asociar el ID del nuevo carrito al campo "cart" del usuario
      user.cart = newCart._id;
      await user.save();

      // Iniciar sesión después del registro
      req.login(user, (err) => {
          if (err) {
              return next(err);
          }
          return res.status(200).json({ message: 'Registration and login successful' });
      });
  } catch (error) {
      return res.status(500).json({ error: 'Failed to register' });
  }
  })(req, res, next);
}

export const failCreateUserController = (req, res) => {
    res.send({ error: 'Failed to register' })
}

export const loginUserController = async (req, res) => {
    req.session.user = req.user;
    res.status(200).json({ message: 'Login successful' });
}
export const errorLoginUserController = (err) => {
    console.error("Error en la autenticación:", err);
    res.status(500).send({ error: 'Error de servidor' });
}

export const failLoginUserController = (req, res) => {
    res.send({ error: 'Failed to login' })
}

export const githubLoginUserController = async (req, res) => {

}

export const githubCallbackLoginUserController = async (req, res) => {
    console.log('Callback: ', req.user)
    req.session.user = req.user;
    console.log('User session: ', req.session.user)
    res.redirect('/');
}

export const readInfoUserController = (req, res) => {
  if (req.isAuthenticated()) {
    // Si el usuario está autenticado, devuelve los detalles del usuario actual
    const user = {
      _id: req.user._id,
      first_name: req.user.first_name,
      last_name: req.user.last_name,
      email: req.user.email,
      age: req.user.age,
      cart: req.user.cart,
      role: req.user.role
    };
    console.log('User: ', user)
    res.status(200).json(user);
  } else {
    // Si el usuario no está autenticado, devuelve un error 401 (No autorizado)
    res.status(401).json({ error: 'No autorizado' });
  }
}