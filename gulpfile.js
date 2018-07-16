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
    imagemin = require('gulp-imagemin');

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
// 2. Pushes it through sass plugin to css
// 3. USes autoprefixer to change css to work in unsupported browsers
// 4. Puts the created css in dist/css folder
// 5. Browser-sync reload
gulp.task('sass', function() {
    return gulp
        .src('src/scss/**/*.scss')
        .pipe(sass({
            outputStyle: 'nested' 
            //expanded, nested, compact, compressed,
        }))
        .pipe(autoprefixer(['last 2 versions', 'ie 6-8']))
        .pipe(gulp.dest('dist/css'))
        .pipe(browser.stream());  //browsersync reloads
});

// Inlines css
// gulp.task('inlineCss', ['sass'], function() {
//     return gulp
//         .src('src/*.html')
//         .pipe(inlineCss(
//             {
//                 applyLinkTags: true

//              }
//         ))
//         .pipe(gulp.dest('dist'))
//         .pipe(browser.stream());  //browsersync reloads
// });

// Concatenate and minify JS.
// 1. grab all js files in every sub folder
// 2. add all js files together and make a single file called scripts.js
// 3. minify js
// 4. put minified js in dist js folder. 
gulp.task('js', function() {
    return gulp
        .src('src/js/lib/**/*.js')
        .pipe(concatJS('scripts.js'))
        .pipe(minifyJS())
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

gulp.task('default', ['html', 'sass', 'js', 'img', 'server']); 
 