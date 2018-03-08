const env = process.env;

module.exports = {
    port: env.PORT || 5000,
    host: env.HOST || '127.0.0.1',          // env.HOST is currently not existent but we can create it in our better-npm-run scripts and then input this config.HOST into our server/index.js file when we start the server with a HOST value
    get serverUrl() {
        return `http://${this.host}:${this.port}`;
    },

    apiPort: env.APIPORT || 3030,     // currently no in use (env.APIPORT is 3030 from better-npm-run tho)
    get apiUrl() {
        return `${this.serverUrl}/api`;
    },

    isProd: env.NODE_ENV === 'production',
    isDev: env.NODE_ENV === 'development',
    appName: 'Titan Global Tech',
    processName: env.name || 'mainapp',       // the name we designate to our pm2 process when we run our app with pm2 in production mode (we gave it this 'mainapp' name in our run script)

    // MongoDB
    /*mongodbUri: 'mongodb://localhost:27017',*/                     // URI for a localhost connection to your local mongodb server
    mongodbUri: 'mongodb://username:password@ds157818.mlab.com:57818',          // remote connection URI to MongoDB server on mLab.com.. enter as 'mongodb://[username]:[password]@hostname:port/database-name' which will be provided by mLab created database instance and set database in 'api/index.js'
};