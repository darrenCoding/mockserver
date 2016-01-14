
'use strict';

var util = require('../lib/util');
var pathReg = require('path-to-regexp');
var setting = require('../config');
var mock = require('./mock');
var http = require('http');


var slice = Array.prototype.slice;

var conRoute = module.exports = (function(){
	function route(req,res,next){
		route.handle(req,res,next)
	};
	route.__proto__ = conRoute;
	return route;
}());

conRoute.handle = function(req,res,next){
	if(req.url !== '/favicon.ico'){
		util.parse(req);
		var mapIndex = 0,
			viaHeaders = [],
			mapLen = Object.keys(setting.mock.route).length,
			reg;
		util.each(setting.mockMap,function(i,host,go){
			if(util.getType(host) === 'object'){
				viaHeaders.push(host['host']);
				res.set('X-Forwarded-For',viaHeaders.join(","));
				var options = {
			        host : host['host'],   
			        method : req.method,
			        port : host['port'],
			        path : req.url
			    };

			    var istimeout = setTimeout(function(){
			    	return next(host['host'] + ":" + host['port'] + " timeout，please check your server");
			    },3000)
			    var pReq = http.request(options,function(cRes){
			    	clearTimeout(istimeout);
					if(cRes.statusCode <= 400){
						res.status(cRes.statusCode).set(cRes.headers);
						cRes.pipe(res);
					}else{
						go();
					}
				}).on('error',function(e){
					clearTimeout(istimeout);
					go();
				});
				pReq.end();
			}else{
				viaHeaders.push('mock');
				res.set('X-Forwarded-For',viaHeaders.join(","));
				for(var attr in setting.mock.route){
					reg = pathReg(attr);
					if (setting.mock.route.hasOwnProperty(attr)){
						if(reg.test(req.url)){
							mock[getFn(setting.mock.route[attr])](req,res,next,reg);
							return;
						}else{
							mapIndex++;
						}
					}
					if(mapIndex === mapLen){
						next('the url is invalid, please check your url');
					}
				}
			}
		})
	}
}

function getFn(val){
	return val.split(" ")[1];
}

