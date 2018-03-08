import { applyMiddleware, createStore } from 'redux';
import Immutable from 'immutable';                  // Immutable should be used instead of {...state} syntax because Immutable will actually copy the object and all the various levels of inner objects and children so that the ENTIRE state is cloned

const mainReducer = require('./reducers/mainReducer');
const { reducers } = require('./reducers/index');     // combineReducers which includes only 'main' in its data tree (mainReducer)

// Middleware Plugins
import { createLogger } from 'redux-logger';
import thunk from 'redux-thunk';

const middleware = applyMiddleware(thunk, createLogger());


function initStore(partialState) {      // passes in the partialState produced by the controller.js routed pages (their business logic such as making axios calls for data to send to their page and then shaping them according to the structure of our store/reducers aka {main: ... } )
    const preloadedState = (partialState) ? {} : undefined;     // will create the preloadedState from scratch, in which it will start as a blank object {} if we have pre-generated data sent to initStore in 'partialState' from our controller.js route, but if we do not even have {main: ...} structure or a blank {} obj sent to initStore as the partialState, then we will make preloadedState undefined as well so the store is initialized with no preloadedState and will just start with the initialState from mainReducer.js that is already preconfigured inside it along with adding the mainReducer in our combinedReducers that gives it the structure {main: {...}}

    if(partialState && partialState.main) {                      // will configure the preloadedState if we are given a 'main' property in our partialState signifying our controller sent something to be set in the mainReducer

        // Merge starting data with default init state
        preloadedState.main = mainReducer(undefined, {})        // get initialState of mainReducer by calling mainReducer and passing it an undefined state (which will pass in its default initialState), and then passing it a blank obj {} as its 'action' param so that there is no action.type and will skip the switch statement, and this will pass back its default 'initialState' that has all the starting values within store.main
            .merge(Immutable.fromJS(partialState.main));         // partialState props merge and override props from mainReducer returned 'initialState'  -   merges the controller's starting data 'partialState' with the initialState properties from mainReducer, and these both merge into the '.main' property within 'preloadedState', which pre-configures the mainReducer's data in the store  (the partialState is cloned so we do not directly mutate the data of partialState, which is how redux operates with its states aka we may we to time travel and retrieve the partialState at some point in development)

        preloadedState.main = preloadedState.main.toJS();       // convert object back to javascript object literal from the immutable object (we cloned it as an immutable object to ensure all the inner objects would all be cloned too, but unless the entire store uses immutable objects, we need to convert it back to JS for it to work with the other object literals in store)
    }

    return createStore(reducers, preloadedState, middleware);       // if a partialState (starting data) was sent to initStore, we createStore with our merged preloadedState, however if no partialState was passed in, we create our store with no 'preloadedState' and then mainReducer's initialState will be used as the starting state values for it (the main: branch of the store tree) once mainReducers first has an action dispatched to it in the App (that will be where the store's state starts for that pathway, whereas if we give it a preloadedState that will be the store's first state upon initialization of store)
}

module.exports = { initStore };