
'use strict';

// 入口文件
var startFn = require('./index');
// 默认配置
var setting = require('./config').mock;

var start = module.exports = function(d,p,cb){
	var dir = d || process.cwd(),
		port = p || setting.port;
	startFn(dir,port,cb)
}

if(require.main){
	startFn(null,8011)
}
