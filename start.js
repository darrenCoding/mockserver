
'use strict';

// 入口文件
var startFn = require('./index');
// 默认配置
var setting = require('./config').mock;

var args = process.argv.slice(2),
	port = (args[1] && /^\d+$/.test(args[0])) ? parseInt(args[0]) : 8011;

var start = module.exports = function(d,p,cb){
	var dir = d || process.cwd(),
		port = p || setting.port;
	startFn(dir,port,cb)
}

if(require.main.filename === __filename){
	startFn(null,port)
}