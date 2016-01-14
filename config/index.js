
'use strict';

var path = require('path');

var env = process.env.NODE_ENV || 'local';
env = env.toLowerCase();

var file = path.resolve(__dirname, env);

var config = module.exports = require(file);