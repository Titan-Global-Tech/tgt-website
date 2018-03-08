import api from '../../api';


function sayHello(message) {
    return {
        type: "SAY_HELLO",
        payload: message
    }
}

function fetchContests() {
    return function(dispatch) {
        dispatch({type: "FETCH_CONTESTS_PENDING"});

        api.fetchContests().then(contests => {
            dispatch({
                type: "FETCH_CONTESTS_FULFILLED",
                payload: {
                    contests: contests,
                }
            });
        }).catch(err => {
            dispatch({
                type: "FETCH_CONTESTS_REJECTED",
                payload: err
            });
        });
    };
}


module.exports = {
    sayHello,
    fetchContests,
};