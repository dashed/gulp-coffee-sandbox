/* gulpfile.js - https://github.com/wearefractal/gulp */

var gulp = require('gulp');
var gutil = require('gulp-util');
var coffee = require('gulp-coffee');

var path = require('path');

var srcCoffeeDir = './coffee/';
var destDir = './src/';

// Emulate coffee -b -w -c -o ./src/ ./coffee
var gulpCoffee = function(target) {

    gulp.src(target)
        .on('data', function(file){
            file['original_file_path'] = file.path;
        })
        .pipe(coffee({bare: true}))
            .on('error', gutil.log)
            .on('error', gutil.beep)
            .on('data', function(file){
                file['coffe_path'] = file.path;
            })
        .pipe(gulp.dest(destDir))
            .on('data', function(file) {

                var coffeeAbs = path.normalize(__dirname + '/' + srcCoffeeDir + '/');
                var relative = path.relative(coffeeAbs, file.path);
                var from = path.normalize(srcCoffeeDir + '/' + relative);
                var to = path.normalize(destDir + '/' + relative);

                gutil.log("Compiled '" + from + "' to '" + to + "'");

            });

};

// The default task (called when you run `gulp`)
gulp.task('default', function() {

    var target = path.normalize(srcCoffeeDir + '/**/*.coffee');

    // Process all coffee files.
    gulpCoffee(target);

    // Watch coffeescript files and compile them if they change
    gulp.watch(target, function(event) {
        gulpCoffee(event.path);
    });

});
