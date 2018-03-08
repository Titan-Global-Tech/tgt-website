var React = require('react');
var { Switch, Route } = require('react-router-dom');
var { connect } = require('react-redux');

var Home = require('../../pages/home/Home');
var About = require('../../pages/about/About');
var HelloButton = require('../../pages/hello-button/HelloButton');
var Contests = require('../../pages/contests/Contests');
var Error = require('../../pages/error/Error');
var {
    HOME,
    ABOUT,
    HELLO_BUTTON,
    CONTESTS,
    endPointRoute,
} = require('../../pages/routes');


const ConnectedSwitch = connect(state => ({     // keeps the routes in sync with the store where the routerReducer has the location and history controlled completely
    location: state.location
}))(Switch);

module.exports = class extends React.Component {
    render() {

        return (
            <div>
                <ConnectedSwitch>
                    <Route exact path={HOME}
                           render={(props) => {
                               return <Home {...props} />
                           }}
                    />
                    <Route exact path={ABOUT}
                           render={(props) => {
                               return <About {...props} />
                           }}
                    />
                    <Route exact path={HELLO_BUTTON}
                           render={(props) => {
                               return <HelloButton {...props} />
                           }}
                    />
                    <Route exact path={CONTESTS}
                           render={(props) => {
                               return <Contests {...props} />
                           }}
                    />
                    <Route component={Error} />
                </ConnectedSwitch>
            </div>
        )
    }
};