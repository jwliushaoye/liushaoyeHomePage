

const merage = require('webpack-merge');
const prodEnv = require('./prod.env');

module.exports = merage(prodEnv , {
    NODE_ENV : '"development"'
});
