
'use strict';

var app = require('connect')();
var compress = require('compression');
var routes = require('./Routes')();
var logger = require('morgan');
var log4js = require('./config/log')
var server;

exports = module.exports = mainApp;

function mainApp(port){
	// 配置中间件
	app.use(logger('dev'));
	app.use(compress());
	app.use(routes.router);
	app.use(routes.pageErr);
	app.use(routes.serverErr);
	server = app.listen(port);
}

process.on('uncaughtException', function(err) {
	log4js.logger_e.error(err.stack);
	try{
		var killProcess = setTimeout(function(){
			killProcess.unref();
            process.exit(1);
        }, 3000);
	    server.close();
	}catch(e){
		log4js.logger_e.error(e.stack || e.toString());
	}
});

