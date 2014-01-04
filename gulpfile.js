/* gulpfile.js - https://github.com/wearefractal/gulp */

var EE = require('events').EventEmitter;


var gulp = require('gulp');
var gutil = require('gulp-util');
var coffee = require('gulp-coffee');

var path = require('path');

var srcCoffeeDir = './coffee/';
var destDir = './src/';

// Emulate coffee -b -w -c -o ./src/ ./coffee
var gulpCoffee = function(target) {

var src = gulp.src(target);
var _gulpCoffee = coffee({bare: true});

_gulpCoffee.on('pipe', function(src) {

    this.listeners('error').forEach(function(item) {
        if(item.name == 'onerror') this.removeListener('error', item);
    }, this);

    // this.removeAllListeners('error');

    console.log('removed all onerror on pipe');
});

_gulpCoffee.on("newListener", function (ev, fn) {

    console.log('new listener ('+ fn.name +') for ' + ev);

    this.listeners('error').forEach(function(item) {
        if(item.name == 'onerror') this.removeListener('error', item),
            console.log('removed listener ('+ item.name +') for error');
    }, this);

    if(fn.name == 'dashed') {
        console.log('error listener count:' + EE.listenerCount(this, 'error'));
    }

    return;

});

// One way to hook on error
// _gulpCoffee.on('error', function dashed(err) {

//     gutil.log(err);
//     console.log('error listener count:' + EE.listenerCount(this, 'error'));

//     // let's see current error listener
//     console.log(this.listeners('error'));
// });


        src
        .on('data', function(file){
            file['original_file_path'] = file.path;
            console.log(file.path);
        })
        .pipe(_gulpCoffee)
            // .on('error', gutil.log)
            // .on('error', gutil.beep)

            // Another way to hook on error
            _gulpCoffee.on('error', function dashed(err) {

                gutil.log(err);
                console.log('error listener count:' + EE.listenerCount(this, 'error'));

                // let's see current error listener
                console.log(this.listeners('error'));
            })


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

    // Watch coffeescript files and compile them if they change
    // gulp.watch(target, function(event) {
    //     gulpCoffee(event.path);
    // });

});
