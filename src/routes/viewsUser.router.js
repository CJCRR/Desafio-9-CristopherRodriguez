import { Router } from "express";
import { isAuthenticated } from "../public/js/authMiddleware.js";

const router = Router();

// Ruta para el formulario de registro (pública)
router.get('/register', (req, res) => {
    if (req.session.user) {
        res.redirect('/profile');
    } else {
        res.render('register');
    }
});

// Ruta para el formulario de inicio de sesión (pública)
router.get('/login', (req, res) => {
    if (req.session.user) {
        res.redirect('/profile');
    } else {
        res.render('login');
    }
});

// Ruta para el perfil del usuario (privada, requiere estar autenticado)
router.get('/profile', isAuthenticated, (req, res) => {
    const userInfo = {
        first_name: req.session.user.first_name,
        last_name: req.session.user.last_name,
        email: req.session.user.email,
        age: req.session.user.age,
        cart: req.session.user.cart,
    };
    console.log(userInfo);
    res.render('profile', userInfo);
});

// Ruta para cerrar sesión (privada, requiere estar autenticado)
router.get('/logout', isAuthenticated, (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.log(err.message);
        }
        res.redirect('/login');
    });
});

export default router;