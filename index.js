'use strict';

var path = require('path');
var gutil = require('gulp-util');
var template = require('lodash.template');
var R = require('ramda');
var fs = require('fs');
var Stream = require('stream');

var PLUGIN_NAME = 'gulp-sync-processor';

var defaultConfig = {
  files: [],
  options: {
    data: {},
    isProcess: function (data) {
      return false;
    },
    processor: function (tplString, data) {
      return template(tplString)(data);
    }
  }
};

module.exports = function (config) {

  var stream = Stream.PassThrough({
    objectMode: true
  });

  stream._transform = function (file, unused, cb) {
    this.push(file);
    cb();
  };

  stream._flush = function (cb) {

    config = {
      files: config.files,
      options: R.merge(defaultConfig.options, config.options)
    };

    R.forEach(function (fileObj) {

      var fileOptions = R.merge(config.options, fileObj.options);

      if (fileOptions.isProcess(fileOptions.data)) {
        try {
          var srcFileBuffer = fs.readFileSync(fileObj.src);
          var contents = fileOptions.processor(String(srcFileBuffer),
            fileOptions.data);

          var file = new gutil.File({
            contents: new Buffer(contents),
            cwd: process.cwd(),
            path: !!fileObj.dest ? fileObj.dest : path.join(process.cwd(),
              path.basename(fileObj.src, path.extname(fileObj.src))
            )
          });
          stream.push(file);
        } catch (e) {
          stream.emit('error', e);
        }
      }

    })(config.files);

    cb();

  };

  return stream;
};
