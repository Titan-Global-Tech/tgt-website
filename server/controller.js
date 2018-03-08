// this is the business logic where the server side api calls are made to receive data for the app for the specific page rendered, or it is where we make certain calculations with returned data from our database fetched from the api, and retrieved from local resources on the server if any
var config = require('./config');
var axios = require('axios');

function homePage() {
    return {
        main: {                     // 'main' reducer   -   (will be more reducers with a bigger app such as 'contests' and 'names')
            pageTitle: "Home Page"      // pageTitle goes to Header and on every page
        }
    };
}

function aboutPage() {
    return {
        main: {
            pageTitle: "About Page"
        }
    }
}

function helloButtonPage() {
    return {
        main: {
            pageTitle: "Hello Button Page",
            hello: `Starting Message`,      // starts out as the 'hello' property on the page, until the sayHello button is pushed
        }
    }
}

// Sending Asynchronous Data from Server
function contestsPage() {
    return axios.get(`${config.apiUrl}/contests`).then(res => {     // have the controller function (for the page) send back a Promise that includes the data in the structure of the partialState so it fits our store/reducers tree, and then this data will Promise will have its callback triggered in 'routing.js' where we will send the data into the serverRender() function that is called within the callback in routing.js (this structure between the three files is how we send asynchronous calls dynamically to our serverRender(), whereas if we didn't do this, we would have to use matchPath() in serverRender, which is less structured than this way)
        return {
            main: {
                pageTitle: "Contests",
                contests: res.data.contests,
            }
        };
    });
}

function endPoint(num) {
    return {
        serverMessage: `Received ${num} (as param or internally from server)`
    }
}


module.exports = {
    homePage,
    aboutPage,
    helloButtonPage,
    contestsPage,
    endPoint,
};