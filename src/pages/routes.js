// Routes for Pages

var HOME = '/';
var ABOUT = '/about';
var HELLO_BUTTON = '/hello-button';
var CONTESTS = '/contests';
var ERROR = '/404';

var endPointRoute = (num) => `/endpoint/${num || ':num'}`;


const routes = [
    {
        label: 'Home',
        path: HOME,
        //component: require('./home/Home'),
        exact: true,
    },
    {
        label: 'About',
        path: ABOUT,
        //component: require('./about/About'),
        exact: true,
    },
    {
        label: 'Hello Button',
        path: HELLO_BUTTON,
        //component: require('./hello-button/HelloButton'),
        exact: true,
    },
    {
        label: 'Contests',
        path: CONTESTS,
        //component: require('./contests/Contests'),
        exact: true,
    },
    {
        label: 'End Point (420)',
        path: `/endpoint/420`,
    },
    {
        label: "Error Test",
        path: ERROR,
    }
];


module.exports = {
    HOME,
    ABOUT,
    HELLO_BUTTON,
    CONTESTS,
    ERROR,
    endPointRoute,
    routes,
};