import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import configureStore from 'redux-mock-store'
import thunkMiddleware from 'redux-thunk'

import {
    sayHello,           // just testing 'sayHello()' here
    fetchContests,          // fetchContests would need asynchronous redux-thunk capabilities within the mock-store to be able to be tested
} from './mainActions'


const mockStore = configureStore([thunkMiddleware]);   // creates a stand-in store that has redux-thunk functionality so we can make asynchronous calls if we need to do the test for 'fetchContests()'. This 'redux-mock-store' is used in place of making axios calls so our store data is not actually effected and so our test can focus on the logic within the action 'sayHello()' and not on external variables

var mock = new MockAdapter(axios);      // creates the mock obj that we will use to intercept http requests (any type) with the functions 'onGet()', onPost(), onPut(), and onAny()
afterEach(() => {
    mock.restore()                 // after each test, the normal behavior of the mock obj is restored to keep each test balanced in their results and to remove the mocking behavior set with mock.onGet() and such. We can also reset the registered mock handlers with 'mock.reset()'
});

test('sayHello dispatch', () => {
    const initialState = {};
    const store = mockStore(initialState);           // creates mockStore with empty state to be used to dispatch 'sayHello()' action with a payload as the arg, which we will simply be dispatching and then using the store to getActions() and then test the sayHello action dispatched in the store to the action we originally dispatched with the 'actualPayload'

    const actualPayload = "Hello Test";
    store.dispatch(sayHello(actualPayload));        // dispatch sayHello() action to the mockStore which is simply just used as the holder for the action, which we will retrieve with getActions() to determine what the action looks like in the store compared to what we expected the outputted action to be {type:..., payload:...}

    const expectedPayload = "Hello Test";
    expect(store.getActions()).toEqual([{       // tests actualPayload found in our dispatched action here with store.getActions() and compare it against expectedPayload, which should both match up
        type: "SAY_HELLO",
        payload: expectedPayload
    }]);
});


describe('fetchContests Action Suite', () => {
    test('fetchContests success', (done) => {
        // Setup mock interceptor
        const myData = { contests: 'returned contest list' };
        mock.onGet('/api/contests').reply(200, myData);

        // Setup mock store
        const initialState = {};
        const store = mockStore(initialState);

        // Dispatch action
        store.dispatch(fetchContests());
        const expectedActions = store.getActions();

        // Test and Assert Results
        expect(expectedActions.length).toBe(1);                                 // it should be '2' actions with PENDING and FULFILLED, but here we just settle for asserting PENDING is a dispatched action here
        expect(expectedActions).toContainEqual({type: "FETCH_CONTESTS_PENDING"});

        /*const expectedPayload = myData.contests;
        expect(expectedActions).toContainEqual({        // this should be the second action that occurs in this test suite where PENDING is first and FULFILLED is second
            type: "FETCH_CONTESTS_FULFILLED",
            payload: {
                contests: expectedPayload,
            }
        });*/
        done();
    })
});