## gulp sync processor

Sometime we need to use the data which other pipe emitted for processing into docs or other files by template.
But if downstream depend the files, in async may it will cause error. so we may need this library.

[![Build Status](https://travis-ci.org/morlay/gulp-sync-processor.svg?branch=master)](https://travis-ci.org/morlay/gulp-sync-processor)
[![Dependencies](https://david-dm.org/morlay/gulp-sync-processor.png)](https://david-dm.org/morlay/gulp-sync-processor)

## Usage

    var dataCache;

    gulp.src()
      .pipe()
      .pipe()
      .on('data',function(data){
          dataCache = data;
      })
      .pipe()
      .pipe(syncProcessor({
        files:[
          {
            src: 'src/dest.html.template',
            dest: 'src/dest.html',
            options:{

            }
          }
        ],
        options: {
          data: dataCache,
          isProcess: function(data){
            return true;
          },  
          processor: function(tplString, data){
            return _.template(tplString, data);
          }
        }
      }))
      .pipe(gulp.dest())


files' opts will merge with global.
