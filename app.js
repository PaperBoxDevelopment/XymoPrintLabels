require('dotenv').config();
const port = process.env.PORT || 5000;
const express = require('express');
const path = require('path');
const exphbs = require('express-handlebars');
const methodOverride = require('method-override');
const flash = require('connect-flash');
const session = require('express-session');
const bodyParser = require('body-parser');
const passport = require('passport');

const cookieParser = require('cookie-parser');
const logger = require('morgan');
const app = express();
const http = require('http').Server(app);
const { errorHandler } = require('./errors');
const { info } = require('./helperFunctions')
const initializeDatabases = require('./dbs');

const Labels = require('./Labels')
const Orders = require('./Orders')
const Users = require('./Users')



//////////////////////////////////////////// MONGODB CONNECTION ////////////////////////////////////////////



initializeDatabases().then(dbs => {


  require('./Passport')(passport, dbs);
  Labels(app, dbs),  // Initialize the application once database connections are ready.
    Orders(app, dbs),
    Users(app, dbs)

  // Handle Errors Here

  app.use(errorHandler);
  http.listen(port, () => console.log(`New Routes On Port ${port} Last Port Mentioned`))


}).catch(err => {
  console.error('Failed to make all database connections!')
  console.error(err)
  process.exit(1)

})



////////////////////////////////////////////// ALL MIDDLEWARE //////////////////////////////////////////////


app.engine('handlebars', exphbs.engine({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(methodOverride('_method'));
app.use(session({ secret: 'secret', resave: true, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use(express.static(path.join(__dirname, 'public')));
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());


app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  res.locals.user = req.user || null;
  res.locals.session = req.session
  next();
});

global.info = info



module.exports = app;






