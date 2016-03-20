
'use strict';

var parseUrl = require('parseurl');
var os = require('os');
var qs = require('qs');

var objectRegExp = /^\[object (\S+)\]$/,
	slice = Array.prototype.slice,
	toString = Object.prototype.toString;

var getType = function(obj) {
  var type = typeof obj;
  if (type !== 'object') {
    return type;
  }
  return toString.call(obj)
    .replace(objectRegExp, '$1').toLowerCase();
}

exports.getType = getType;

exports.extend = function(obj1,obj2){
 	Object.keys(obj2).forEach(function(attr){
 		if(!(attr in obj1)){
 			obj1[attr] = _clone.call(exports,obj2[attr]);
 		}
 	})
 	return obj1;
}

exports.each = function(obj,fn,callback){
  var i = -1,
      objArr = [],
      len = obj.length;

  if(!len){
    len = Object.keys(obj).length;
    for(var attr in obj){
      objArr.push(attr);
    }
  }

  go();
  function go(){
    if(++i === len){
      return callback();
    };
    if(objArr.length > 0){
      fn.call(obj[objArr[i]], objArr[i], obj[objArr[i]], done);
    }else{
      fn.call(obj[i], i, obj[i], done);
    }
  }

  function done(err){
    if(err){
      return callback(err);
    }
    go();
  }
}

exports.mix =  function(a, b){
  if (a && b) {
    for (var key in b) {
      a[key] = b[key];
    }
  }
  return a;
};

exports.parse = function(req){
	var val = parseUrl(req).query;
	req.query = qs.parse(val);
}

exports.deps = function deps(o){
	if(getType(o) === 'object'){
		for(var i in o){
			if(o.hasOwnProperty(i)){
				deps(o[i],o,i)
			}
		}
	}else if(getType(o) == 'array'){
		for(var j=0,len = o.length; j < len ; j++){
			deps(o[j],o,j)
		}
	}else{
		if(/^\d+$/g.test(o)){
			arguments[1][arguments[2]] = Number(o)
		}
		if(/^true$/g.test(o)){
			arguments[1][arguments[2]] = Boolean(o)
		}
	}
	return o;
}	

exports.getLocalIp = function(){
  var narr = os.networkInterfaces(),
      ip = '';
  Object.keys(narr).forEach(function(ip){
    narr[ip].forEach(function (obj) {
      if (obj.family === 'IPv4' && !obj.internal) {
        return ip = obj.address;
      }
    })
  })
  return ip || "127.0.0.1";
}

function _clone(val){
    if(Array.isArray(val)){
        return val.slice();
    }else if(getType(val) === 'object'){
    	var o = {};
        for(var arr in val){
        	if(val.hasOwnProperty(arr)){
        		o[arr] = _clone(val[arr]);
        	}
        }
        return o;
    }else{
        return val;
    }
}

