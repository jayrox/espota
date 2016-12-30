var express      = require('express');
var _            = require('lodash');
var readdir      = require('fs-readdir-promise');

var config = require(__dirname + '/lib/config');

var app = express();
app.set('config', config);
app.use(express.static(__dirname + '/public'));

/*
 * GET Binary
 * binaryname-version.bin
 */
app.get('/:app-:version.bin', function(req, res, next) {
  console.log("Requested:");
  console.log(req.params);
  
  var appName = req.params.app;

  readdir('./public/bin/')
  .then(function(files) {
    var versions = [];
    files.forEach(file => {
      if(file.indexOf(appName) > -1) {
        var regex = /-(\d*).bin$/
        var result = file.match(regex);
        var version =  parseInt(result[1], 10);
        versions.push({name: file, version: version});
      }
    });
    if (versions.length == 0) {
      res.send("Firmware not found.");
      return;
    }
    return versions;
  })
  .then(function (versions) {
    versions = _.sortBy(versions, 'version');
    versions.reverse();

    return versions[0];
  })
  .then(function (version) {
    if (req.params.version < version.version) {
      var fullUrl = req.protocol + '://' + req.get('host') + '/' + version.name;
      res.send(fullUrl);
    }else {
      res.send("No newer firmware available.");
    }
  })
});

module.exports = app;
