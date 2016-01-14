
'use strict';

var res = require('../lib/response');
var control = require('../Controls/controller');
var util = require('../lib/util');
var fs = require("fs");
var path = require('path');
var log4js = require('../config/log');

var args,slice = Array.prototype.slice;
var middleware = {};

var router = module.exports = function(){
	return util.mix(router,middleware)
}

middleware.router = function(){
	args = slice.call(arguments);
	res = util.extend(args[1],res);
	res.set({
		'Access-Control-Allow-Origin' : "*",
		'Access-Control-Allow-Headers' : '*',
		'X-Powered-By' : 'node/4.0.0',
		'Access-Control-Allow-Methods' : 'PUT,POST,GET,DELETE,OPTIONS'
	})
	control.call(this,args[0],res,args[2]);
}

middleware.pageErr = function(){
	var err ='File is Not Found';
	log4js.logger_e.error(err);
    return res.status(404).end(err);
}

middleware.serverErr = function(err){
	var err = err || 'The request is invalid';
	log4js.logger_e.error(err);
    return res.status(500).end(err);
}

