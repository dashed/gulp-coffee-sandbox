/* gulpfile.js - https://github.com/wearefractal/gulp */

var EE = require('events').EventEmitter;

var es = require('event-stream');

var gulp = require('gulp');
var gutil = require('gulp-util');
var coffee = require('gulp-coffee');

var path = require('path');

var srcCoffeeDir = './coffee/';
var destDir = './src/';

var continueOnError = function(stream) {

    return stream
    .on('error', function() {})
    .on('newListener', function() {
       this.listeners('error').forEach(function(f) {
           if(f.name == 'onerror') this.removeListener('error', f);
       }, this);
    });
};

var gulpCoffee = function(target) {

    var coffeeStream = coffee({ bare: true });

    gulp.src(target)
        .on('data', function(file){
            file['original_file_path'] = file.path;
        })
        .pipe(continueOnError(coffeeStream))
            .on('error', gutil.log)
        .pipe(gulp.dest(destDir))
           .on('data', function(file) {



                var coffeeAbs = path.normalize(__dirname + '/' + srcCoffeeDir + '/');

                var relative_from = path.relative(coffeeAbs, file['original_file_path']);
                var relative_to = path.relative(coffeeAbs, file.path);

                var from = path.normalize(srcCoffeeDir + '/' + relative_from);
                var to = path.normalize(destDir + '/' + relative_to);

                gutil.log("Compiled '" + from + "' to '" + to + "'");

            });
};


// The default task (called when you run `gulp`)
gulp.task('default', function() {

    var target = path.normalize(srcCoffeeDir + '/**/*.coffee');

    // Process all coffee files.
    gulpCoffee(target);
    // gulpCoffee()

    // Watch coffeescript files and compile them if they change
    // gulp.watch(target, function(event) {
    //     gulpCoffee(event.path);
    // });

});
