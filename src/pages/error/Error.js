var React = require('react');
import Helmet from 'react-helmet';


module.exports = class extends React.Component {
    render() {
        return (
            <div>
                <Helmet title={"Page Not Found"} />


                <h5>404 Page Not Found</h5>
                <hr/>
                <h5>{this.props.error}</h5>
            </div>
        )
    }
};