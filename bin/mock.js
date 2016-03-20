#!/usr/bin/env node

var serveStatic = require('serve-static');
var serveIndex = require('serve-index');
var args = require("minimist");
var exec = require('child_process').exec;
var spawn = require('child_process').spawn;

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

