#!/usr/bin/env node

var colors = require('colors');
var path = require('path');
var fs = require('fs');
var chokidar = require('chokidar');
var exec = require('child_process').exec;
var spawn = require('child_process').spawn;
var setting = require('../config');
var entry = require('../start');
var File = require('../lib/file');
var util = require('../lib/util');
var ufile = require('../Controls/mock');
var mockFile;
var argv = require("minimist")(process.argv.slice(2),{
  alias: {
    'brower': 'b',
    'port': 'p',
    'dir' : 'd',
    'watch' : 'w',
    'file' : 'f'
  },
  string: ['port','dir','file'],
  boolean: ['brower','help','watch'],
  unknown : function(){
    console.error(colors.magenta("[ERROR] the commander is illegal"));
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
  console.log(colors.red("  mockserver -f          the location of the configuration file"));
  process.exit(0);
}


var cwd = (argv.f && typeof argv.f === 'string') ? argv.f : process.cwd();
mockFile = path.resolve(cwd, 'mock.json');

if(fs.existsSync(mockFile)){
  try{
    global.lastConfig = util.mix(setting,JSON.parse(fs.readFileSync(mockFile,'utf-8')));
  }catch(e){
    console.error(colors.magenta("[ERROR] parse error"));
  }
}else{
  console.warn(colors.magenta('[WARN] mock file not found!'));
}

if(argv.w){
  var watcher = chokidar.watch(lastConfig.mock.jsonPath, {
    persistent: true
  });
  watcher.on("change",function(paths,stats){
    var fname = path.basename(paths,'.json'),
        direcPath;
    File.exist(paths).read(function(data,err){
      try{
        var jsonData = JSON.parse(data);
      }catch(err){
        log4js.logger_e.error(err.stack);
      }
      direcPath = path.resolve(__dirname,lastConfig.mock.apiPath,fname);
      jsonData["interfaces"].forEach(function(item,index,arr){
        ufile.updateFile(item['data'],direcPath,item['routes'],item['type']);
      });
    })
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