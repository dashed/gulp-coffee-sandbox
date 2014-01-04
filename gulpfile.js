/* gulpfile.js - https://github.com/wearefractal/gulp */

var EE = require('events').EventEmitter;

var es = require('event-stream');


var gulp = require('gulp');
var gutil = require('gulp-util');
var coffee = require('gulp-coffee');

var path = require('path');

var srcCoffeeDir = './coffee/';
var destDir = './src/';

// Emulate coffee -b -w -c -o ./src/ ./coffee
var gulpCoffee = function(target) {

var _gulpCoffee = coffee({bare: true});



// clean stream of onerror
var cleaner = function(stream) {
    stream.listeners('error').forEach(function(item) {
        if(item.name == 'onerror') this.removeListener('error', item);
            // console.log('removed listener ('+ item.name +') for error');
    }, stream);
};


var continueOnErrorPipe  = function() {

    // backwards compatible passthrough??
    return es.through(function(data) {
        this.emit('data', data);
    })
    .on('error', gutil.log)
    .on('pipe', function(src) {
        cleaner(src);
    })

    .on('newListener', function() {
        cleaner(this);
    });

}

// decorator version
var continueOnError = function(stream) {
    return stream
    .on('error', function() {})
    .on('pipe', function(src) {
        cleaner(src);
    })

    .on('newListener', function() {
        cleaner(this);
    });
};

        gulp.src(target)
        .on('data', function(file){
            file['original_file_path'] = file.path;
        })

        .pipe(continueOnError(_gulpCoffee))

            .on('error', gutil.log)
            // .on('error', gutil.beep)

            // Another way to hook on error
            // _gulpCoffee.on('error', function dashed(err) {

            //     gutil.log(err);
            //     console.log('error listener count:' + EE.listenerCount(this, 'error'));

            //     // let's see current error listener
            //     console.log(this.listeners('error'));
            // })


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
