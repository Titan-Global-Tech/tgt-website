const React = require('react');
const ReactDOMServer = require('react-dom/server');
const { Provider } = require('react-redux');
const { StaticRouter } = require('react-router-dom');
const { isProd } = require('./config');
const serialize = require('serialize-javascript');
import Helmet from 'react-helmet';

const App = require('../src/App');
const { initStore } = require('../src/redux/store');



const serverRender = function(location, partialState, routerContext = {}) {     // location (req.url) passed in to be used in StaticRouter to direct page to right Route in App, partialState passed in to initialize the store with our pre-calculated data we determine in our controller functions, and then routerContext is used by default as a blank object {} and passed into our StaticRouter like this, and then it is used when our App renders and routes to the location to populate with our App current context, which we could then use to determine stuff like Redirects and help the Router determine where the page will go on a redirect. More info can be found here: <https://reacttraining.com/react-router/web/guides/server-rendering>

    const store = initStore(partialState);                              // initialize store with 'partialState' passed to us from our 'controller' business logic in the data structure of our store/reducers tree, in which this pre-calculated data will be merged with the default initial State in our mainReducer (or whatever other reducers we have in our project), and then the full data (preloadedState) will be used to initialize the store with our additional mainReducer/combineReducers and middleware arguments

    const app = ReactDOMServer.renderToString(                           // render our App as a String by utilizing both the Store (in Provider wrapper) and our server's StaticRouter which statically renders the pages one at a time, so if you want to navigate between pages once our client ConnectedRouter takes over, you will want to call fetch/axios calls to get the data for each page if the server does not send it to them (in which the server only renders and sends the data if the page is called as a GET request as the users first call to the app or if they reload it)
        <Provider store={store}>
            <StaticRouter location={location} context={routerContext}>
                <App />
            </StaticRouter>
        </Provider>
    );

    const head = Helmet.rewind();       // this rewind() function is very important to call so it will pull out the data from our rendered app so the <Helmet/> components will render inside the <head> or else if rewind() is not called, the Helmet components will cause errors. Also this Helmet.rewind() must go after the renderToString() function so that the Helmet library has a rendered app to pull the data from.. The 'head' that returns from our rewind() call, will be used inside our <head> tags in the doctype string below, in which the two places we use them for ${head.title} and ${head.meta} will determine where our <Helmet/> components on our React pages will be placed in our <head> element and in what order or if nested in something else, etc... The 'head.title' will pertain to our <Helmet/> component attributes as 'titleTemplate' for how our title will render if given a 'title' variable on the page, and then 'defaultTitle' for the default way the title will render ("Titan Global Tech" aka appName), and then 'head.meta' refers to our 'meta' attribute in our <Helmet/> components that will usually give an array of meta objects that will all output to our <head> element as <meta> individual elements such as { name='description', content='Full Stack ....' } which will output to <meta data-react-helmet="true" name="description" content="Full Stack ....."> followed by the next meta tag if there is another one within the array... The Helmet component doesn't render anything (not with our renderToString or hydrate) but it injects head tags into our document which can be noticed if you see the elements tree in Inspect flash right after loading the page, it shows the Helmet library injecting the title and meta tags. The benefit of this is that the Helmet tags actually change when we navigate links and not just when we refresh the page like the other Server Side Rendering works. And these Helmet tags will stay placed if you refresh the page as well so they work very solid. Other properties we can use with Helmet are <link>, <noscript>, <script>, <style>, <html>, <body>, ${Helmet.htmlAttributes.toString() or .toComponent()}, ${Helmet.bodyAttributes}, and <base> and you can also use .map() on an array of values to output multiple meta, link, etc. tags and use other javascript to manage and modify the head dynamically

    const preloadedState = store.getState();     // gets clone of state of the store that we just initialized, which we will pass into the html so it can be retrieved by the client and used to create the client's store with the same properties that match the server side rendering
    return (
        `<!doctype html>
        <html>
            <head>
                ${head.title}
                ${head.meta}
                <link rel='stylesheet' href="/stylesheets/styles.css">
            </head>
            <body>
                <div id="root">${app}</div>
               
                <script>
                    window.__PRELOADED_STATE__ = ${serialize(preloadedState)};
                </script>
                
                <!-- Bootstrap JS Imports -->
                <script src="https://code.jquery.com/jquery-3.2.1.slim.min.js" integrity="sha384-KJ3o2DKtIkvYIK3UENzmM7KCkRr/rE9/Qpg6aAZGJwFDMVNA/GpGFF93hXpG5KkN" crossorigin="anonymous"></script>
                <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.12.9/umd/popper.min.js" integrity="sha384-ApNbgh9B+Y1QKtv3Rn7W3mgPxhU9K/ScQsAP7hUibX39j7fakFPskvXusvfa0b4Q" crossorigin="anonymous"></script>
                <script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/js/bootstrap.min.js" integrity="sha384-JZR6Spejh4U02d8jOt6vLEHfe/JQGiRRSQQxSfFWpi1MquVdAyjUar5+76PVCmYl" crossorigin="anonymous"></script>    
                
                <!-- Bootstrap Material Design JS -->
                <!-- SnackbarJS plugin (extension to Bootstrap Material Design --><!--
                <script src="https://cdn.rawgit.com/FezVrasta/snackbarjs/1.1.0/dist/snackbar.min.js"></script>
                <script src="https://unpkg.com/bootstrap-material-design@4.1.1/dist/js/bootstrap-material-design.js" integrity="sha384-CauSuKpEqAFajSpkdjv3z9t8E7RlpJ1UP0lKM/+NdtSarroVKu069AlsRPKkFBz9" crossorigin="anonymous"></script>
                <script>$(document).ready(function() { $('body').bootstrapMaterialDesign(); });</script>
                -->

                <script src="${isProd ? `/bundle.min.js` : `/bundle.js`}"></script>
            </body>
        </html>`
    )


    /*// FOR USING PUG TEMPLATES
    return {
        initialMarkup: ReactDOMServer.renderToString(
            <Provider store={store}>
                <StaticRouter location={location} context={routerContext}>
                    <App />
                </StaticRouter>
            </Provider>
        ),
        initialState: store.getState()
    }*/
}

module.exports = serverRender;