var {
    homePage,
    aboutPage,
    helloButtonPage,
    contestsPage,
    endPoint,
} = require('./controller');

var {
    HOME,
    ABOUT,
    HELLO_BUTTON,
    CONTESTS,
    endPointRoute,
} = require('../src/pages/routes');

var serverRender = require('./serverRender');   // import the transpiled serverRender, which will be used to render all the diff pages in the React App that the server routes to depending on the GET request


module.exports = (app) => {     // includes all routes within the React App and is a part of the express middleware pipeline, by having the express 'app' sent to it which has the functionality of using 'next' to pipe back to the routes in middleware.js

    //      '/'
    app.get(HOME, (req, res, next) => {                 // we setup each page (section of our app) here in routing, where every page has its own app.get() route where we just use 'res.send()' to send the rendered html on the server to the express server response and this is done by calling serverRender(), passing the request url (req.url) and the partialState returned by our controller.js corresponding function (homePage()) into the serverRender(), where the req.url will be used in StaticRouter to direct the user to the right page in our Route components in app, and then the 'homePage()' in controller will have the data we retrieve on the server structured into the store/reducers data structure and passed in as an object literal as 'partialState' to be used to initialize the store and then have the Store, StaticRouter, and App all used to render the String static html for our app, that will be passed into the html prebuilt doctype html container structure we have and then have it all passed back to us here in routing, where we will send the whole String html to the server directly as a String
        res.send(serverRender(req.url, homePage()));
    });

    //     '/about'
    app.get(ABOUT, (req, res, next) => {
        res.send(serverRender(req.url, aboutPage()));
    });

    //     '/hello-button'
    app.get(HELLO_BUTTON, (req, res, next) => {
        res.send(serverRender(req.url, helloButtonPage()));
    });

    //     '/contests'
    app.get(CONTESTS, (req, res, next) => {
        contestsPage().then(partialState => {               // to get the data/partialState from 'contestsPage()'s Promise, we need to trigger the promise callback here to access the data and then make the 'res.send()' express response call within the callback and send in the callback's partialState data into 'serverRender()' so that data is accessed and sent to the server to be passed into the store for the server then the client
            res.send(serverRender(req.url, partialState));
        });
    });

    //     '/endpoint/:num'
    app.get(endPointRoute(), (req, res, next) => {      // when a static call is made to the /endpoint/:num it will return the 'serverMessage' json generated in the controller in function 'endPoint()' and will simply just return a String along with the value of the request param (420 or :num).. However, this will not work if you direct to it from a NavLink and such unless we make the NavLink open it as a full page reload instead of as a component, which it isn't (it's just a json response)
        res.json(endPoint(req.params.num));
    });


    // Errors
    app.get('/500', () => {
        throw Error('Fake Internal Server Error')
    });

    app.get('*', (req, res, next) => {
        res.status(404).send(serverRender(req.url));
    });

    app.use((err, req, res, next) => {          // handles the /500 route that catches the 500 errors that we manually send to '/500' url path, and then just sends back a simple error message instead of rendering a page like 'Error' aka /404 which sends its error to the Route with path /404.. We could also create a Route for '/500' path and use serverRender to send our errors there though
        console.error(err.stack);
        res.status(500).send('Error: ' + err.message);
    });
};

