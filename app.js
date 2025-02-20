const  createError = require('http-errors');
const  express = require('express');
const  path = require('path');
const  cookieParser = require('cookie-parser');
const  logger = require('morgan');
const  mongoose = require('mongoose');
const  session = require('express-session');
const FileStore = require('session-file-store')(session);
const  passport = require('passport');
const  app = express();
const  authenticate = require('./authenticate');
const url = 'mongodb://localhost:27017/conFusion';
const connect = mongoose.connect(url);

const  indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const  dishRouter = require('./routes/dishRouter');
const  promoRouter = require('./routes/promotionsRouter');
const  leaderRouter = require('./routes/leaderRouter');
const  uploadRouter = require('./routes/uploadRouter');





//const session = require('express-session');


connect.then((db) => {
  console.log('Connected correctly to server');
}, (err) => { console.log(err); });



// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// app.use(cookieParser('12345-67890-09876-54321'));
 

app.use(passport.initialize());

app.all('*', (req, res, next) => {
  if (req.secure) {
    return next();
  }
  else {
    res.redirect(307, 'https://' + req.hostname + ':' + app.get('secPort') + req.url);
  }
});
app.use('/', indexRouter);
app.use('/users', usersRouter);


app.use(express.static(path.join(__dirname, 'public')));

app.use('/dishes', dishRouter);
app.use('/promo', promoRouter);
app.use('/leader', leaderRouter);
app.use('/imageUpload',uploadRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
