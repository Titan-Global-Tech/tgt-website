let dev = process.env.NODE_ENV !== "production";
const webpack = require('webpack');
const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const nodeExternals = require('webpack-node-externals');


// ___________ SHARED LOADERS ____________
var sharedLoaders = [
    {
        test: /\.js?$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'babel-loader',
        query: {
            presets: ['react', 'es2015', 'stage-2'],
            plugins: [
                'react-html-attrs',
                'transform-class-properties',
                'transform-decorators-legacy',
                "transform-react-constant-elements",        // constant and inline-elements plugins are both used to optimize the transpiled code to make production javascript faster. The constant-elements plugin will treat React JSX elements as value types and hoist them to the highest scope for our transpiled bundle js. This optimizes the speed of the js
                "transform-react-inline-elements",           // makes it so transpiling replaces the React.createElement function with a function that is more optimized for production and in general
                "transform-react-remove-prop-types"         // removes all prop-types definitions when bundling to bundle.js or production
            ]
        }
    },
    { test: /\.json$/, loader: 'json-loader' },
];


// _____________ CLIENT SIDE _______________________________________
const browserConfig = {
    name: 'client-side',
    context: __dirname,
    cache: dev,                             // cache the build process when developing it, but do not cache when using for production since you will only need to build once usually
    devtool: dev ? "inline-sourcemap" : '',
    entry: dev ? [                    // use hot-loader if in dev mode
        "./src/client.js"
    ] : [
        "babel-polyfill",           // babel-polyfill is also needed to run transpiled App on Client in IE since Object.assign() is not supported in IE so a Symbol polyfill is required and we enable it to work here with 'babel-polyfill' to transpile it correctly and also it is needed if we use a library like 'isomorphic-fetch' which uses polyfills to make native calls with a global variable that is the same across the server and client. 'babel-polyfill' is needed to make the client code into a fully ES-6 environment for these polyfills to work, or else the isomorphic-fetch will not work on some browsers that do not support ES-6 yet. And it is only needed on the client since our server supports ES-6 and we are already transpiling that code into Node language for our express node server so that is already taken care of if we are using fetch()
        "./src/client.js"
    ],
    output: {
        path: __dirname + "/public/",
        filename: dev ? "bundle.js" : 'bundle.min.js',

        hotUpdateChunkFilename: 'hot/hot-update.js',    // controls the hot update json files that needlessly get outputted in public/
        hotUpdateMainFilename: 'hot/hot-update.json',

        publicPath: "public/"
    },
    module: {
        rules: sharedLoaders.concat([
            /*{
                test: /\.(woff|woff2)(\?v=\d+\.\d+\.\d+)?$/,
                loader: 'url-loader',
                query: {
                    limit: 10000,
                    mimetype: 'application/font-woff'
                }
            },
            {
                test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
                loader: 'url-loader',
                query: {
                    limit: '10000',
                    mimetype: 'application/octet-stream'
                }
            },
            {
                test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
                loader: 'file-loader'
            },
            {
                test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
                loader: 'svg-url-loader',
                query: {
                    limit: '10000',
                    mimetype: 'application/svg+xml'
                }
            },
            {
                test: /\.(png|jpg)$/,
                loader: 'url-loader',
                query: {
                    limit: 8192
                }
            },
            {
                test: /\.ico(\?v=\d+\.\d+\.\d+)?$/,
                loader: 'url-loader'
            },*/
            /*{
                test: /\.(png|jp(e*)g|svg|ico)$/,       // by having file-loader installed, it will be the default fallback for url-loader, and the 'file-loader' does not have to be declared since the 'query' options will be passed to it and it will have the same test as url-loader, and the file-loader is only used when the 'limit' is exceeded
                use: [
                    {
                        loader: "url-loader",               // url-loader is used for handling smaller images in our project (source directory) and converts images that are 8000 kilobytes and less into a base64 String (binary in a String format) and then inlines the Strings within the code where the images are imported/referenced at (such as in the 'src' attribute of an <img> tag rendered on the final html page code). It uses url-loader for the small images and file-loader for the large images so the image rendering in our app is optimized since url-loader converting the images to base64 will result in faster load times for small images, but will not be efficient for converting larger images over 8000kb, whereas the file-loader will be more efficient when converting images over 8000kb more than url-loader, but file-loader will not be as efficient for importing smaller images compared to url-loader that quickly converts them into base64 Strings and injects them directly into the code inline, which is much quicker than file-loader's process
                        options: {                          // can use 'options:' or 'query:'
                            limit: 8000,                        // gives a limit to the files the url-loader will handle, in which it will only convert files to base64 that are 8000 bytes (8kb) or less (the property is in kilobytes) and anything that is above that is not handled by the url-loader and will be handled instead by the file-loader
                            name: 'images/[name].[ext]',             // if any files are too big that pass the url-loader's 'limit', then the url-loader passes on the image to the file-loader to handle, and it also passes on all its options as well ('limit' only pertains to url-loader though), and the 'name' and 'publicPath' will be passed to file-loader to be used to print out the file in the 'public/images/theFile.png' and on the dev-server on the publicPath at '/images/theFile.png' since the publicPath removes '/public/' from its path
                            publicPath: url => url.replace(/public/, ""),      // files referenced on dev-server at path 'images/theFile.jpg' (no public/)
                            fallback: 'file-loader'                         // not necessary since 'file-loader' will be routed to by default if the limit is hit, but this fallback property could also be 'responsive-loader' or some other loader
                        }
                    }
                ]
            },*/
            {
                test: /\.(png|jp(e*)g|svg|ico)$/,
                use: [
                    {
                        loader: "file-loader",
                        options: {
                            name: 'images/[name].[ext]',
                            publicPath: url => url.replace(/public/, ""),
                        }
                    },
                    {
                        loader: 'image-webpack-loader',         // compresses the images imported into the dependency tree and uses file-loader after to load them into public/images/ (the images won't be able to be viewed until opened on the web
                        options: {
                            // Default optimizers       // disabled by giving it a enabled:false property
                            /*mozjpeg: {          // compress jpeg
                                progressive: true,
                                quality: 65
                            },*/
                            optipng: {          // compress png
                                enabled: false,
                            },
                            svgo: {         // compress svg  or use svgo-loader for specific svg usage
                                plugins: [{convertColors: {shorthex: false}}]
                            },
                            pngquant: {          // compress png
                                quality: '65-90',
                                speed: 4
                            },
                            gifsicle: {         // compress gif
                                interlaced: false,
                            },
                            // Only optional Optimizer      // enabled by simply putting them in the options like here
                            /*webp: {                 // compress jpg and png into WEBP
                                quality: 75           // WEBP compressed images only work for webkit browsers (Chrome)
                            }*/
                        }
                    }
                ]
            },
            {
                test: /\.(s*)css$/,
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: [
                        {
                            loader: 'css-loader',
                            options: {
                                url: false,     // file/url-loader handles url, not css-loader
                                minimize: true,
                                sourceMap: true
                            }
                        },
                        {
                            loader: 'postcss-loader',
                            options: {
                                plugins: function() {
                                    return [
                                        require('precss'),
                                        require('autoprefixer')
                                    ];
                                }
                            }
                        },
                        {
                            loader: 'sass-loader'
                        }
                    ]
                })
            },
        ])
    },
    devServer: {                                // the webpack-dev-server is ony used when you want to run the frontend React without the backend express server, but we can link it to the express server (if the express server is running on localhost:3000 by adding a proxy property configuration here to have the dev-server's localhost:8080 proxy to localhost:3000 for certain paths on each server
        contentBase: path.join(__dirname, 'public'),    // 'index.html' needed in public/index.html to be able to run the webpack-dev-server and proxy the url below.. however, when index.html is created and you can 'npm run frontend', this will be able to be used with 'npm start' so both backend server and frontend client is running on different ports. The backend server is an express server on port 3000 and wrapped by the nodemon wrapper, and the frontend on port 8080 is run on the webpack-dev-server and includes the React code including anywhere the proxy below takes the user
        port: 8080,
        historyApiFallback: true,
        hot: true,
        inline: true,
        headers: {
            'Access-Control-Allow-Origin': '*',     // necessary for hot module replacement. allows Cross-Origin Resource Sharing
        },
    },
    resolve: {
        alias: {
            jquery: "node_modules/jquery/dist/jquery.min.js"
        },
    },
    plugins: dev ? [    // DEV
        new webpack.optimize.OccurrenceOrderPlugin(),
        new webpack.NamedModulesPlugin(),
        new webpack.NoEmitOnErrorsPlugin(),         // plugins to support hot module replacement
        new webpack.HotModuleReplacementPlugin(),
        new ExtractTextPlugin({
            disable: process.env.NODE_ENV === 'development',
            allChunks: true
        }),

        /*new webpack.ProvidePlugin({       // this should load the bootstrap js, but it is having problems doing so in this project (so i will just load them in the html)
            $: 'jquery',
            jQuery: 'jquery',
            'window.jQuery': 'jquery',
            'window.$': 'jquery',
            Popper: ['popper.js', 'default'],
        }),*/

    ] : [   // PROD
        new webpack.optimize.OccurrenceOrderPlugin(),
        new webpack.optimize.UglifyJsPlugin({
            minimize: true,
            mangle: false,
            sourcemap: false,
            compress: {
                warnings: false
            }
        }),
        new ExtractTextPlugin({                 // enabled in prod and extract to styles.css
            filename: 'stylesheets/styles.css',
            allChunks: true
        }),

        /*new webpack.ProvidePlugin({       // this should load the bootstrap js, but it is having problems doing so in this project (so i will just load them in the html)
            $: 'jquery-slim',
            jQuery: 'jquery-slim',
            'window.jQuery': 'jquery-slim',     // tried 'jquery' as well but neither work in this config
            'window.$': 'jquery-slim',
            Popper: ['popper.js', 'default'],
        }),*/
    ]
};



//_________________ SERVER SIDE _______________________________________
const serverConfig = {
    name: 'server-side',
    context: __dirname,
    entry: "./middleware.js",     // entry is our file with the RenderDOMServer.renderToString() function in it
    target: 'node',                         // tells webpack that the entry point is being targeted as Node.js so our .js files are transpiled into Node (and not plain javascript). Node uses syntax like 'require' instead of 'import' and 'module.exports' instead of 'export default' and this syntax is what is not allowed on the node server and what babel is used to transpile
    externals: [nodeExternals()],       // stops the server-side config from bundling all the dependencies in node_modules and the built-in node core modules so that we end up with a bundle that only consists of our source code
    output: {
        path: __dirname + '/',
        filename: "middleware.bundle.js",

        publicPath: "public/",          // only necessary if you want to test/dev 'serverRender.js' and its dependencies on the dev-server without the express server being run/listening
        libraryTarget: "commonjs2"      // commonjs2 is Node's module system that is used to output the server-side code to transpile the jsx into Node js (instead of plain javascript, which will not work on our node server)
    },
    module: {
        rules: sharedLoaders
    },
    plugins: dev ? [

    ] : [
        new webpack.optimize.OccurrenceOrderPlugin(),
        new webpack.optimize.UglifyJsPlugin({
            minimize: true,
            mangle: false,
            sourcemap: false,
            compress: {
                warnings: false
            }
        }),
    ]
};


module.exports = [browserConfig, serverConfig];