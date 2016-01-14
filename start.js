
'use strict';

// 入口文件
var startFn = require('./index');
// 默认配置
var setting = require('./config').mock;
//获取端口
var args = process.argv.slice(2),
    port = (args[0] && /^\d+$/.test(args[0])) ? parseInt(args[0]) : setting.port;

startFn(port)
