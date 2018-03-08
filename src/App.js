import React from 'react';
import { Route } from 'react-router-dom';

var Header = require('./components/layout/Header');
var Main = require('./components/layout/Main');
var Footer = require('./components/layout/Footer');



class App extends React.Component {

    render() {
        return (
            <div class="container">
                <Route path='*'
                       render={(props) => {
                           return <Header {...props} />
                       }}
                />

                <Main />

                <Footer />
            </div>
        );
    }
}

module.exports = App;

