module.exports = (app, dbs) => {


    const bcrypt = require('bcryptjs');
    const passport = require('passport');
    const Users = dbs.collection("users")

    // User Login & Register Routes
    app.get('/login', (req, res) => res.render('users/login'));
    app.get('/register', (req, res) => res.render('users/register'));


    // Register Form POST
    app.post('/register', async (req, res, next) => {

        try {


            let errors = [];

            if (req.body.password != req.body.password2) errors.push({ text: 'Passwords do not match' })
            if (req.body.password.length < 4) errors.push({ text: 'Password must be at least 4 characters' })
            if (errors.length > 0) {
                res.render('users/register', {
                    // Variables 
                    errors: errors,
                    name: req.body.name,
                    email: req.body.email,
                    password: req.body.password,
                    password2: req.body.password2
                });


            } else {

                let existingUser = await Users.findOne({ email: req.body.email })
                if (existingUser) {
                    req.flash('error_msg', 'Email Already Registered')
                    res.redirect('/register');
                }
                else {
                    const newUser = {
                        name: req.body.name,
                        email: req.body.email,
                        password: req.body.password,
                        userRole: 'user'
                    }

                    bcrypt.genSalt(10, (err, salt) => {
                        bcrypt.hash(newUser.password, salt, (err, hash) => {
                            if (err) throw err
                            newUser.password = hash;
                            Users.insertOne(newUser).then(user => {
                                req.flash('success_msg', "You are now registered!")
                                res.redirect('/');
                            }).catch((err) => {
                                req.flash('error_msg', 'There Was a Database Problem Please Contact your Administrator')
                                res.redirect('/register');
                            });
                        })
                    })
                }
            }

        } catch (err) { next(err) }

    });




    // Login Form POST
    app.post('/login', (req, res, next) => {

        try {

            passport.authenticate('local',
                {
                    successRedirect: '/',
                    failureRedirect: '/login',
                    failureFlash: true
                }

            )(req, res, next);

        } catch (err) { next(err) }



    });





    // Logout User
    app.get('/logout', async (req, res, next) => {

        try {

            req.logout(err => {
                if (err) { return next(err) }
                req.flash('success_msg', 'You are logged out');
                res.redirect('/login');
            })


        } catch (err) { next(err) }



    });


}
