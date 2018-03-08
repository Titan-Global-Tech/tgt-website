var React = require('react');
import { appName } from '../../../server/config';
import Helmet from 'react-helmet';
import { NavLink } from 'react-router-dom';
import {
    HOME,
    ABOUT,
    HELLO_BUTTON,
    ERROR,
    routes,
} from '../../pages/routes';

import {connect} from 'react-redux';


@connect((store) => {
    return {
        pageTitle: store.main.pageTitle,
    }
})
class Header extends React.Component {

    handleNavLinkClick() {      // we add a handler for our NavLink so that our web and mobile site always collapse the expanded mobile navbar (on small and xs) and go to the top of the page when a new page is opened (which bootstrap usually does automatically but a certain type of phone may not work with)
        $('body').scrollTop(0);
        $('.js-navbar-collapse').collapse('hide');
    }

    render() {
        return (
            <div>
                <Helmet titleTemplate={`%s | ${appName}`} defaultTitle={appName} />
                <h1>{this.props.pageTitle}</h1>

                <nav class="navbar navbar-expand-md navbar-light">
                    <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#theNav" aria-controls="theNav" aria-expanded="false" aria-label="Toggle navigation">
                        <span class="navbar-toggler-icon"></span>
                    </button>
                    <ul class="nav nav-pills collapse navbar-collapse" id="theNav">
                        {routes.map(link => (
                            <li key={link.path} class="nav-item p-2">
                                <NavLink to={link.path} exact
                                         activeStyle={{color:'limegreen'}}
                                         onClick={this.handleNavLinkClick}
                                         class="nav-link">
                                    {link.label}
                                </NavLink>
                            </li>
                        ))}
                    </ul>
                </nav>

            </div>
        )
    }
}

module.exports = Header;