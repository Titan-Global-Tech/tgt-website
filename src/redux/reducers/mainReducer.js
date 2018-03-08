import Immutable from 'immutable';

const initialState = Immutable.fromJS({     // initialState is cloned and is only done to be used as the default initialState if needed. It needs to be Immutable clone so it can use merge() and marge with the 'partialState' passed into the store (initStore) upon serverRender and store initialization
    pageTitle: null,
    hello: null,
    contests: null,

    loading: false,
    fetching: false,
    fetched: false,
    error: null,
});

const reducer = function(state = initialState, action) {
    switch(action.type) {
        // fetchContests action
        case "FETCH_CONTESTS_PENDING": {
            return {
                ...state,
                fetching: true
            };
        }
        case "FETCH_CONTESTS_FULFILLED": {
            return {...state,
                contests: action.payload.contests,

                fetching: false,
                fetched: true,
            }
        }
        case "FETCH_CONTESTS_REJECTED": {
            return {...state,
                error: action.payload,
                fetching: false,
            }
        }
        // sayHello action
        case "SAY_HELLO": {
            return {
                ...state,
                hello: action.payload,
            }
        }
    }

    return state;
};

module.exports = reducer;