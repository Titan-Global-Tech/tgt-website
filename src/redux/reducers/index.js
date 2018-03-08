const { combineReducers } = require('redux');

const main = require('./mainReducer');

const reducers = combineReducers({
    main,
});

module.exports = { reducers };