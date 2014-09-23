var assert = require('assert');
var syncProcessor = require('../.');

var fs = require('fs');
var path = require('path');
var _ = require('lodash');
var gulp = require('gulp');
var map = require('map-stream')

describe('gulp sync processor', function() {
  var dataObj, tplString;

  beforeEach(function() {
    dataObj = {
      key: 123
    }
    tplString = '<%= key %>';
    fs.writeFileSync(__dirname + '/tpl.txt.ejs', tplString)
  })

  afterEach(function() {
    fs.unlinkSync(__dirname + '/tpl.txt.ejs');
  })

  it('sync processor should do the processing', function(done) {

    var resultString = _.template(tplString, dataObj);

    gulp.src(path.join(__dirname, '/tpl.txt.ejs'))
      .pipe(syncProcessor({
        options: {
          data: dataObj,
          isProcess: function() {
            return true;
          }
        },
        files: [{
          src: path.join(__dirname, '/tpl.txt.ejs')
        }]
      }))
      .pipe(assertResult(resultString))
      .pipe(gulp.dest(__dirname))
      .on('end', function() {
        fs.unlinkSync(__dirname + '/tpl.txt');
        done();
      });
  });

  it('processor should be changed', function(done) {

    var resultString = _.template(tplString + 'pu', dataObj);

    gulp.src(path.join(__dirname, '/tpl.txt.ejs'))
      .pipe(syncProcessor({
        options: {
          data: dataObj,
          isProcess: function() {
            return true;
          },
          processor: function(tplString, dataObj) {
            return _.template(tplString + 'pu', dataObj)
          }
        },
        files: [{
          src: path.join(__dirname, '/tpl.txt.ejs')
        }]
      }))
      .pipe(assertResult(resultString))
      .pipe(gulp.dest(__dirname))
      .on('end', function() {
        fs.unlinkSync(__dirname + '/tpl.txt');
        done();
      });
  });

  it('dest of fileObj should be changed', function(done) {

    var resultString = _.template(tplString + 'pu', dataObj);

    gulp.src(path.join(__dirname, '/tpl.txt.ejs'))
      .pipe(syncProcessor({
        options: {
          data: dataObj,
          isProcess: function() {
            return true;
          },
          processor: function(tplString, dataObj) {
            return _.template(tplString + 'pu', dataObj)
          }
        },
        files: [{
          src: path.join(__dirname, '/tpl.txt.ejs'),
          dest: 'tpl1234.txt'
        }]
      }))
      .pipe(assertResult(resultString))
      .pipe(gulp.dest(__dirname))
      .on('end', function() {
        fs.unlinkSync(__dirname + '/tpl.txt');
        fs.unlinkSync(__dirname + '/tpl1234.txt');
        done();
      });

  });

});

function assertResult(resultString) {
  return map(function(file, callback) {
    if (path.extname(file.path) === '.txt') {
      assert.equal(resultString, String(file.contents))
    }
    callback(null, file)
  })
}
