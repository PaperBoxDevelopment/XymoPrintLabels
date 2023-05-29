// Here you protect the access to the routes if the user is not logged in

module.exports = {
  ensureAuthenticated: (req, res, next) => {

    if (req.isAuthenticated()) { return next(); }
    req.flash("error_msg", "Not Authorized");
    res.redirect("/login");
  },

  ensureAdmin: (req, res, next) => {

    if (req.user.userRole == "Administrator") { return next(); }
    else {
      req.flash("error_msg", "Not Authorized, Need To Login As Administrator");
      res.redirect("/login");
    }
  }
};
