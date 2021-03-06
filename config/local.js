
'use strict';

//本地环境配置
module.exports = {
	"mock" : {
		"port" : 8011, //启动端口
		"apiPath" : "../mockfile", //mock文件存放目录
		"jsonPath" : "/Users/linfang/Documents/leju/mockserver/interface/", //接口配置文件存放目录
		"route" : { //路由配置
			"/api?mockData=:name" : "fn mockStart",
			"/api/:name/:file" : "fn getFile"
		}
	},
	"mockMap" : [
		/*{
			"host" : "10.207.28.123",
			"port" : "8033"
		},*/
		"mock"
	],
	'log' : '' //日志路径
}