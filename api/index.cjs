const serverless = require('serverless-http');
const app = require('../dist/index.js');

// dist/index.js exports the app as default for ESM; handle both default and named
const expressApp = app && app.default ? app.default : app;

module.exports = serverless(expressApp);