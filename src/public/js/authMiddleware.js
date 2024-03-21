// authMiddleware.js
const isAuthenticated = (req, res, next) => {
    if (req.session.user) {
        next();
    } else {
        res.redirect('/login');
    }
};

const isAdmin = (req, res, next) => {
    if (req.session.user && req.session.user.role === 'admin') {
        next();
    } else {
        res.status(403).json({ message: 'Acceso no autorizado.' });
    }
};

const hasAdminCredentials = (email, password) => {
    // Verificar si las credenciales coinciden con las del administrador
    return email === 'adminCJCRR@coder.com' && password === 'adminCJCRR123';
};

export { isAuthenticated, isAdmin, hasAdminCredentials };