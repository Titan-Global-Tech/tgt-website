var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var favicon = require('serve-favicon');
var compression = require('compression');
var config = require('./server/config');
var sourceMapSupport = require('source-map-support');    // allows for source-maps within our bundled server-side code so that our code is debuggable

var apiRouter = require('./api/index');


if(config.isDev) {           // if in dev
    sourceMapSupport.install();
}


var app = express();


app.use(compression());     // middleware that compresses response bodies for requests that traverse through middleware (can change 'options'). When writing to the client from the server with res.write() and such, use 'res.flush()' after writing each block/chunk with res.write() to buffer the output and send it smoothly to the client, and this will ensure server sent responses run smoothly


__dirname = path.resolve(path.dirname(''));         // need to re-define __dirname here since __dirname does not work by default when we bundle the entire server (this file included), so we re-define __dirname so it points to this file's location on the server (otherwise it is just '/')

app.use(favicon(path.join(__dirname, 'public', 'images', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));



// API
app.use('/api', apiRouter);         // API is routed to before the server side rending of the App so that any requests with '/api/' path will be sent to the API route





// Server Side Render
var routing = require('./server/routing');   // routing includes all the app.get() routes within the React Application that are all within the exported function, and all of these app.get() requests are still in the middleware pipeline and can send their thread back to the Error handling at the bottom of this page

routing(app);




// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;
