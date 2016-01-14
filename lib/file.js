
"use strict";

var fs = require('fs');
var File = module.exports = function(){
    this.promise = Promise.resolve();
}

File.read = function(filePath){
    var file = new File();
    return file.read(filePath);
}

File.exist = function(filePath){
    var file = new File();
    return file.exist(filePath);
}

File.prototype.then = function(onFulfilled, onRejected){
    this.promise = this.promise.then(onFulfilled, onRejected);
    return this;
}

File.prototype["catch"] = function (onRejected) {
    this.promise = this.promise.catch(onRejected);
    return this;
}

File.prototype.read = function(fn){
    return this.then(function(str){
        !!str ? fn(fs.readFileSync(str,'utf-8')) : fn(str,new Error("file is not exist"));
    });
}

File.prototype.exist = function(filePath){
    var path = fs.existsSync(filePath) ? filePath : '';
    return this.then(function(){
        return path;
    })
}

File.prototype.write = function(filePath){
    return this.then(function(data){
        return fs.writeFileSync(filePath,data);
    })
}