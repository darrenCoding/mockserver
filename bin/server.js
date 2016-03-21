#!/usr/bin/env node

var serveStatic = require('serve-static');
var serveIndex = require('serve-index');
var colors = require('colors');
var exec = require('child_process').exec;
var spawn = require('child_process').spawn;
var util = require('../lib/util');
var argv = require("minimist")(process.argv.slice(2),{
  alias: {
    'brower': 'b',
    'port': 'p'
  },
  string: 'port',
  boolean: ['brower','help'],
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
  process.exit(0);
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
