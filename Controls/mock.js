
'use strict';

var Mock = require('mockjs');
var fs = require("fs");
var iconv = require('iconv-lite');
var util = require('../lib/util');
var path = require('path');
var File = require('../lib/file');
var setting = require('../config/');
var log4js = require('../config/log');
var version = {};

exports.mockStart = function(req,res,next) {
	var jsonPath = path.resolve(__dirname,setting.mock.jsonPath + req.query.mockData);
	File.exist(jsonPath + ".json").read(function(data,err){
		if(!err){
			try{
				var jsonData = JSON.parse(data);
			}catch(err){
				log4js.logger_e.error(err.stack);
				return next('The data of file must be JSON format')
			}
			var direcPath = path.resolve(__dirname,setting.mock.apiPath,req.query.mockData);
			File.exist(direcPath).then(function(path){
				var id = req.query.id,
					data = req.query.mockData;
				if(!path){
					fs.mkdir(direcPath,function(err){
						if(!err){
							version[req.query.mockData] = "";
							startRequest(req,res,id,data,direcPath,jsonData,next);
						}else{
							log4js.logger_e.error(err.toString());
							return next('fail to create directory');
						}
					})
				}else{
					startRequest(req,res,id,data,direcPath,jsonData,next);
				}
			})
		}else{
			log4js.logger_e.error(err.message)
			return next(err.message);
		}
	})
}

exports.getFile = function(req,res,next,reg){
	var realFile = req.url.match(reg)[1],
		realRoute = req.url.match(reg)[2].split("?")[0],
		callback = req.query.callback,
		method = req.method.toLowerCase(),
		dicPath = path.join(setting.mock.apiPath,realFile,realRoute + "_" + method + '.json'),
		realPath = path.resolve(__dirname,dicPath);
	File.exist(realPath).then(function(path){
		if(path){
			endRequest(req,res,realPath,callback);
		}else{
			return next();
		}
	})
}

function startRequest(req,res,id,project,direcPath,data,next){
	if(!(version[project] === data['version'])){
		version[project] = data['version'];
		switch(util.getType(id)){
			case 'string' :
				var index = 0,
					api = data["interfaces"],
					len = api.length;
				for(;index < len ; index++){
					if(api[index]['id'] === id){
						updateFile(api[index]['data'],direcPath,api[index]['routes'],api[index]['type']);
						res.status(200).send({
							"status" : true,
							"message" : "The file has been updated"
						});
						log4js.logger_c.info(req.url + "has been updated");
					}
				}
				if(index === len){
					log4js.logger_e.error(req.url + "Invalid id");
					return next('Invalid id');
				}
				break;
			case 'array' : 
				var index = 0,
					api = data["interfaces"],
					len = api.length;
				for(;index < len ; index++){
					if(id.indexOf(api[index]['id']) >= 0){
						updateFile(api[index]['data'],direcPath,api[index]['routes'],api[index]['type']);
						if(index === id.length - 1){
							res.status(200).send({
								"status" : true,
								"message" : "The file has been updated"
							})
							log4js.logger_c.info(req.url + "has been updated");
						}
					}else{
						log4js.logger_e.error(req.url + "Invalid id");
						return next('Invalid id');
					}
				}
				break;
			case 'undefined' :
				data["interfaces"].forEach(function(item,index,arr){
					updateFile(item['data'],direcPath,item['routes'],item['type']);
					if(index === data["interfaces"].length - 1){
						res.status(200).send({
							"status" : true,
							"message" : "files has been writed"
						})
						log4js.logger_c.info(req.url + "has been updated");
					}
				});
		}
	}else{
		res.status(200).send({
			status : false,
			message : "version has not update"
		})
	}
}

function endRequest(req,res,filePath,callback){
	var rs  = fs.createReadStream(filePath),
		chunks = [],
		size = 0,
		str;
	rs.on("data",function(chunk){
		chunks.push(chunk);
		size += chunk.length
	})
	rs.on("end",function(){
		var buf = Buffer.concat(chunks,size);
		str = iconv.decode(buf,'utf8');
		callback ? res.status(200)
				   .set("Content-Type","application/javascript")
				   .send(callback + '(' + str + ')') : res.status(200).send(JSON.parse(str));
	})
}

function updateFile(data,directorPath,routes,type){
	var inf = util.deps(data),
		filePath = path.join(directorPath,'/',routes + "_" + type +'.json');	
	fs.writeFileSync(filePath,JSON.stringify(Mock.mock(inf),null,4));
}