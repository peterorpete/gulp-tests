/* =======================
Gulp configuration File
======================= */

'use strict';


/* =======================
Load Plugins
======================= */

var gulp = require('gulp'),
    browser = require('browser-sync').create(),
    sass = require('gulp-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    inlineCss = require('gulp-inline-css'),
    minifyJS = require('gulp-uglify'),
    concatJS = require('gulp-concat'),
    jshint = require('gulp-jshint'),
    imagemin = require('gulp-imagemin'),
    sequence = require('run-sequence'),
    clean = require('gulp-clean'),
    rename = require('gulp-rename'),
    plumber = require('gulp-plumber'),
    notify = require('gulp-notify');

/* =======================
Regular tasks
======================= */

// Create a server with BrowserSync and watch for file changes.

gulp.task('server', function() {
    browser.init({

        // Inject CSS changes without the page being reloaded
        injectChanges: true,

        // What to serve
        server: {
            baseDir: 'dist'
        },

        // The port
        port: 1234
    });

    // Watch for file changes
    gulp.watch('src/*.html', ['watch-html']);
    gulp.watch('src/scss/**/*.scss', ['sass']);
    gulp.watch('src/scss/**/*.scss', ['inlineCss']);
    gulp.watch('src/js/lib/**/*.js', ['watch-js']);
});

// Copies HTML from src to dist.
gulp.task('html', function() {
    //take all html files from src and load them into the datastream, then task the datastream and pipe it through another plugin which is gulp.dest. Dest takes a datastream and writes in somewhere else e.g dist
    return gulp
        .src('src/*.html')
        .pipe(gulp.dest('dist'));
});

// Compiles sass to css
// 1. gets all scss from scss folder
// 2. Displays error message
// 3. Pushes it through sass plugin to css
// 4. USes autoprefixer to change css to work in unsupported browsers
// 5. Puts the created css in dist/css folder
// 6. Browser-sync reload
gulp.task('sass', function() {
    return gulp
        .src('src/scss/**/*.scss')
        .pipe(plumber({
            errorHandler: notify.onError({
                title: 'Gulp error in the <%= error.plugin%>',
                message: '<%= error.message %>'
            })
        }))
        .pipe(sass({
            outputStyle: 'nested' 
            //expanded, nested, compact, compressed,
        }))
        .pipe(autoprefixer(['last 2 versions', 'ie 6-8']))
        .pipe(gulp.dest('dist/css'))
        .pipe(browser.stream());  //browsersync reloads
});


// Concatenate and minify JS.
// 1. grab all js files in every sub folder
// 2. add all js files together and make a single file called scripts.js
// 3. minify js
// 4. rename the new minified code to scripts.min.js
// 5. put new minified js file in dist js folder.
// 6. SHould create two files
gulp.task('js', function() {
    return gulp
        .src('src/js/lib/**/*.js')
        .pipe(concatJS('scripts.js'))
        .pipe(gulp.dest('dist/js'))
        .pipe(minifyJS())
        .pipe(rename('scripts.min.js'))
        .pipe(gulp.dest('dist/js'));

});

// Check javascruipt for errors
// 1. scan all js
// 2. Use jshint on it
// 3. COnvert the reporter to a nice clear reporter
// 4. End task
gulp.task('lint-js', function() {
    return gulp
        .src('src/js/lib/**/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter('jshint-stylish'))
        .pipe(jshint.reporter('fail')); //task fails on JSHINT error
});

// COmpresses images
gulp.task('img', function() {
    return gulp
        .src(['src/img/**/*.{png,jpg,JPG,gif,svg,ico}', '!src/img/sprites/**'])
        .pipe(imagemin({
            verbose: true
        }))
        .pipe(gulp.dest('dist/img'));

});

gulp.task('reset', function() {
    return gulp
        .src('dist')
        .pipe(clean());
})
/* =======================
Watch tasks
======================= */

// Watch task only triggers once html task is done
//
gulp.task('watch-html', ['html'], function(done) {
    browser.reload();
    done();
});
gulp.task('watch-js', ['js'], function(done) {
    browser.reload();
    done();
});

/* =======================
The main task
======================= */

// 1. laucnh default
// 2. run reset, then html and then sass and js in parallel, then run server once others finished
gulp.task('default', function(cb) {
    sequence('reset', 'html', ['sass', 'js'], 'server', cb); 
}); 

