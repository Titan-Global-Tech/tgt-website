var React = require('react');
import Helmet from 'react-helmet';


const title = 'About Page';     // 'title' value that we use for both setting the 'title' attr in Helmet to replace our 'defaultTitle' in Header's <Helmet/> with the 'titleTemplate' that requires a 'title' attr to use in place of '%s', and then 'title' will also go into a section of one of our meta tags

module.exports = class extends React.Component {
    render() {

        return (
            <div>
                <Helmet
                    title={title}     // adding the 'title' will allow our string value 'About Page' to be used in the 'titleTemplate' attr, which will be used instead of the 'defaultTitle' now that 'title' is set to place the string in for '%s' and it will look like "About Page | Titan Global Tech"  (this is totally unrelated to where 'title' fits in in meta, which will just change the meta String and that is it)
                    meta={[
                        { name: 'description', content: 'About the company and members.' },
                        { property: 'og:title', content: title }
                    ]}
                />

                <h5>About Page</h5>


                <div id="carouselExampleIndicators" class="carousel slide mt-5 mb-5" data-ride="carousel">
                    <ol class="carousel-indicators">
                        <li data-target="#carouselExampleIndicators" data-slide-to="0" class="active"></li>
                        <li data-target="#carouselExampleIndicators" data-slide-to="1"></li>
                        <li data-target="#carouselExampleIndicators" data-slide-to="2"></li>
                    </ol>
                    <div class="carousel-inner">
                        <div class="carousel-item active">
                            <img class="d-block w-100" src="images/large_size_image.jpg" alt="First slide" height='577' />
                        </div>
                        <div class="carousel-item">
                            <img class="d-block w-100" alt="Second slide" height='577' />
                        </div>
                        <div class="carousel-item">
                            <img class="d-block w-100" alt="Third slide" height='577' />
                        </div>
                    </div>
                    <a class="carousel-control-prev" href="#carouselExampleIndicators" role="button" data-slide="prev">
                        <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                        <span class="sr-only">Previous</span>
                    </a>
                    <a class="carousel-control-next" href="#carouselExampleIndicators" role="button" data-slide="next">
                        <span class="carousel-control-next-icon" aria-hidden="true"></span>
                        <span class="sr-only">Next</span>
                    </a>
                </div>
            </div>
        )
    }
};