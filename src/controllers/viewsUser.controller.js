export const viewsUserRegisterController = (req, res) => {
    if (req.session.user) {
        // Si el usuario ya está autenticado, redireccionar al perfil
        res.redirect('/profile');
    } else {
        res.render('register');
    }
}

export const viewsUserLoginController = (req, res) => {
    if (req.session.user) {
        res.redirect('/profile');
    } else {
        res.render('login');
    }
}

export const viewsUserProfileController = (req, res) => {
    // Obtener la información del usuario desde la sesión
    const userInfo = {
        first_name: req.session.user.first_name,
        last_name: req.session.user.last_name,
        email: req.session.user.email,
        age: req.session.user.age,
        cart: req.session.user.cart,
    };
    //console.log(userInfo);
    res.render('profile', userInfo);
}

export const viewsUserLogoutController = (req, res) => {
    // Destruir la sesión actual del usuario
    req.session.destroy((err) => {
        if (err) {
            console.log(err.message);
        }
        res.redirect('/login');
    });
}