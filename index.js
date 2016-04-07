
'use strict';

var app = require('connect')();
var compress = require('compression');
var logger = require('morgan');
var serveStatic = require('serve-static');
var serveIndex = require('serve-index');
var routes = require('./Routes')();
var util = require('./lib/util');
var log4js = require('./config/log')
var server;

exports = module.exports = mainApp;

function mainApp(dir,port,fn){
	// 配置中间件
	dir && app.use(serveStatic(dir,{'index': ['index.html']}));
	dir && app.use(serveIndex(dir, {'icons': true}));
	app.use(logger('dev'));
	app.use(compress());
	app.use(routes.router);
	app.use(routes.pageErr);
	app.use(routes.serverErr);
	server = app.listen(port,function(){
		if(fn){
			port = (port != '80' ? ':' + port : '');
			var url = "http://" + util.getLocalIp() + port + '/';
			fn(url)
		}
	});
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

