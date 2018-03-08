var React = require('react');
import { appName } from '../../../server/config';
import Helmet from 'react-helmet';

// Styled-Components Example                (a CSS in JS library to write styles on in the React file and then wrap the React elements with the CSS wrapper)
import styled from 'styled-components';         // the only downside of styled-components and the CSS in JS styling is that the CSS does not load in the <head> but it loads with the React Components so there is a good chance that there will be a flash of un-styled components before the styles are loaded

const Title = styled.h5`
    font-size: 1.5em;
    text-align: center;
    color: palevioletred;
`;                                      // creates a custom style from a <h5> element and uses all its styling and then overrides the styles listed as font-size, text-align, color, and it places all these in a String `` right after styled.h5``

const Wrapper = styled.section`
    padding: 4em;
    background: #444444;
`;                                      // same thing done except the base element here is a <section> element


// Basic Inline Style
const divStyle = {
    width: '500px',
    textAlign: 'center',
};


module.exports = class extends React.Component {

    render() {
        return (
            <div>
                {/* Dynamic Head tags for Home page */}
                <Helmet meta={[
                        { name: 'description', content: 'Full Stack Starter app that uses Redux, routing capabilities on the server and client side and an optimized configuration that enables optimal loading speeds and very flexible scaling.' },
                        { property: 'og:title', content: appName }
                    ]}
                />

                <Wrapper>
                    <Title>Home Page (open upon load of front page)</Title>  {/* this is a <h5> tag wrapped in our styled-component */}

                    <img class="mt-5" src="images/large_size_image.jpg" style={divStyle} />
                </Wrapper>
            </div>
        )
    }
};