
// Here we will handle the user Log In

const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const ObjectId = require("mongodb").ObjectId;


module.exports = async (passport, dbs) => {


  const Users = dbs.collection("users")

  passport.use(new LocalStrategy({ usernameField: 'email' }, async (email, password, done) => {


    let user = await Users.findOne({ email: email })
    if (!user) { return done(null, false, { message: 'No User Found' }); }

    else {
      bcrypt.compare(password, user.password, (err, isMatch) => {
        if (err) throw err;
        if (isMatch) done(null, user)
        else return done(null, false, { message: 'Password Incorrect' })


      })
    }
  }));


  // It is going to serialize and de serialize the user ID and keep it as cookies for the browser to work

  passport.serializeUser((user, done) => done(null, new ObjectId(user._id)));
  passport.deserializeUser((id, done) => Users.findOne(new ObjectId(id), (err, user) => done(err, user)));



}