#!/usr/bin/env node

var colors = require('colors');
var path = require('path');
var chokidar = require('chokidar');
var setting = require('../config');
var exec = require('child_process').exec;
var spawn = require('child_process').spawn;
var entry = require('../start');
var argv = require("minimist")(process.argv.slice(2),{
  alias: {
    'brower': 'b',
    'port': 'p',
    'dir' : 'd',
    'watch' : 'w'
  },
  string: ['port','dir'],
  boolean: ['brower','help','watch'],
  unknown : function(){
    console.log(colors.magenta("error : the commander is illegal"));
  }
});

if(argv.help){
  console.log(colors.green("Usage:"));
  console.log(colors.red("  mockserver             start server, 8011 as default port"));
  console.log(colors.red("  mockserver --help      print help information"));
  console.log(colors.red("  mockserver -p 8000     8000 as port"));
  console.log(colors.red("  mockserver -b          don't open browser"));
  console.log(colors.red("  mockserver -d /user    user as root"));
  console.log(colors.red("  mockserver -w          if watch changes of files or folders"));
  process.exit(0);
}

if(argv.w){
  var watcher = chokidar.watch(setting.mock.jsonPath, {
    persistent: true
  });
  watcher.on("ready",function(){
  })
  watcher.on("error",function(){
  })
  watcher.on("change",function(path,stats){
    
  })
}

function openURL(url){
  switch (process.platform) {
    case "darwin":
      exec('open ' + url);
      break;
    case "win32":
      exec('start ' + url);
      break;
    default:
      spawn('xdg-open', [url]);
  }
};

var openfn = !argv.b ? openURL : function(){};
entry(argv.dir,argv.port,openfn)