import React from 'react';
import ReactDOM from 'react-dom';
import config from '../server/config';
import { combineReducers, applyMiddleware, createStore, compose } from 'redux';
import main from './redux/reducers/mainReducer';
import { createLogger } from 'redux-logger';
import thunk from 'redux-thunk';
import { Provider } from 'react-redux';

import createHistory from 'history/createBrowserHistory';
import { routerReducer, ConnectedRouter, routerMiddleware, push } from 'react-router-redux';


import App from './App';

import './theme/styles.scss';
import './resources/favicon.ico';
//import './pages/home/large_size_image.jpg';     // Travis-CI does not like image-webpack-loader so compress the images here and then comment the lines out once ready to push the project to Github/TravisCI



const composeEnhancers = (config.isProd ? null : window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) || compose;

//var preloadedState = {main: {pageTitle: "Debugging"}};    // use for debugging client without SSR
let preloadedState = window.__PRELOADED_STATE__;
delete window.__PRELOADED_STATE__;                  // deletes global variable for security, to save memory, and to avoid conflicts with router functions



// Create browser history                 - (or history api of your choosing)
const history = createHistory();
const routerware = routerMiddleware(history);   // build the middleware using our chosen history api that will be used for intercepting and dispatching navigation actions


// Add routerReducer to our reducers
const allReducers = combineReducers({
    main: main,
    router: routerReducer,     // add the routerReducer on the 'router' key for it to route properly and add with the rest of our 'reducers' that we add together by passing them all into 'combineReducers' including our already combined reducers that we add in with ...reducers
});



const store = createStore(
    allReducers,
    { main: preloadedState.main },                     // adds the preloadedState received from the server rendering as the preloadedState for our client store so it matches up with the server store
    composeEnhancers(applyMiddleware(
        routerware,                             // add the routerMiddleware (with history configured) for the purpose of navigating
        thunk,
        config.isProd ? null : createLogger(),      // log only in dev
    ))
);

//store.dispatch(push('/about'));       // Now we can dispatch navigation actions from anywhere with react-router-redux enabled.. This should be done in <App/> though, otherwise if you do it here, it will only change the url but not push the location since ConnectedRouter is not setup yet



ReactDOM.hydrate(
    <Provider store={store}>
        <ConnectedRouter history={history}>
            <App />
        </ConnectedRouter>
    </Provider>
    , document.getElementById('root')
);