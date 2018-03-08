import {
    sayHello,
    fetchContests,
} from '../actions/mainActions'

import mainReducer from './mainReducer'

// This test covers all the different Actions so it hsa full 100% coverage

let mainState;

beforeEach(() => {
    let initialState = mainReducer(undefined, {});    // before every test, it restores the mainState as the mainReducer's initialState passed back from the first call to it when the 'state' 1st arg is 'undefined' reverting to use the default 'initialState' and with no action {} called either, it just passes back the default initialState to restore as 'mainState'
    mainState = initialState.toJS();                    // converts the initialState Immutable object into a JS object just as we do in our 'store.js' when the store is created and merged, and this way our data is consistent across the initialState's default variables and the mainState variables set by an action and its payload
});

// mainReducer's Default initialState
test('handle default', () => {                  // tests the default first call of mainReducer() that returns the default state 'initialState' which is comprised of starting values including a lot of null values
    expect(mainState.hello).toBe(null);
    expect(mainState.pageTitle).toBe(null);
    expect(mainState.contests).toBe(null);      // these are all the starting values of the initialState in our 'mainReducer'
    expect(mainState.loading).toBe(false);
    expect(mainState.fetching).toBe(false);
    expect(mainState.fetched).toBe(false);
    expect(mainState.error).toBe(null);
});


// SAY_HELLO Action Handler Test                        - from the 'sayHello()' action and tests the SAY_HELLO mainReducer handler by checking the state returned after the sayHello action
test('handle SAY_HELLO', () => {                                 // this time the 'sayHello()' action is tested against the mainReducer logic specifically the switch case where our sayHello action triggers the 'SAY_HELLO' action.type case in our reducer and we will test the resulting mainState.hello variable to our expected payload of "Hello Test"
    mainState = mainReducer(mainState, sayHello("Hello Test"));
    expect(mainState.hello).toBe("Hello Test");
    expect(mainState.pageTitle).toBe(null);
    expect(mainState.contests).toBe(null);      // the rest of these state values are not changed from the 'sayHello' action but can be tested against with other actions
    expect(mainState.loading).toBe(false);
    expect(mainState.fetching).toBe(false);
    expect(mainState.fetched).toBe(false);
    expect(mainState.error).toBe(null);
});


// FETCH_CONTESTS_PENDING Handler Test
test('handle FETCH_CONTESTS_PENDING', () => {
    mainState = mainReducer(mainState, {type: "FETCH_CONTESTS_PENDING"});   // we do not want to trigger the api axios call to the API ODM database so we instead test the asynchronous call one part at a time by passing in the action object itself rather than the whole asynchronous dispatch function
    expect(mainState.hello).toBe(null);
    expect(mainState.pageTitle).toBe(null);
    expect(mainState.contests).toBe(null);
    expect(mainState.loading).toBe(false);
    expect(mainState.fetching).toBe(true);      // fetching = true
    expect(mainState.fetched).toBe(false);
    expect(mainState.error).toBe(null);
});


// FETCH_CONTESTS_FULFILLED Handler Test                // tests the main operation of the asynchronous function aka the action that passes the store the retrieved API data, which we will need to create as mock data so we can control the test and only test the reducer logic, which is what really matters in this test rather than the effectiveness or accuracy of the API call in the fetchContests action
test('handle FETCH_CONTESTS_FULFILLED', () => {
    mainState = mainReducer(mainState, {
        type: "FETCH_CONTESTS_FULFILLED",
        payload: {
            contests: { testData: "Contest List" },
        }
    });
    expect(mainState.hello).toBe(null);
    expect(mainState.pageTitle).toBe(null);
    expect(mainState.contests).toEqual({ testData: "Contest List" });      // tests whether the mock list object inserted as the test action came out of the reducer in the expected output that was used for the payload
    expect(mainState.loading).toBe(false);
    expect(mainState.fetching).toBe(false);      // fetching = false
    expect(mainState.fetched).toBe(true);       // fetched = true
    expect(mainState.error).toBe(null);
});


// FETCH_CONTESTS_REJECTED Handler Test                // tests the main operation of the asynchronous function aka the action that passes the store the retrieved API data, which we will need to create as mock data so we can control the test and only test the reducer logic, which is what really matters in this test rather than the effectiveness or accuracy of the API call in the fetchContests action
test('handle FETCH_CONTESTS_REJECTED', () => {
    mainState = mainReducer(mainState, {
        type: "FETCH_CONTESTS_REJECTED",
        payload: new Error("Error Object Test")     // passes in an Error object as the payload with a mock String message so this 'message
    });
    expect(mainState.hello).toBe(null);
    expect(mainState.pageTitle).toBe(null);       // all other values remain default if an error is thrown
    expect(mainState.contests).toBe(null);
    expect(mainState.loading).toBe(false);
    expect(mainState.fetching).toBe(false);      // fetching = false
    expect(mainState.fetched).toBe(false);
    expect(mainState.error.message).toBe("Error Object Test");    // tests the message property of the returned Error object from the State from the REJECTED action
});