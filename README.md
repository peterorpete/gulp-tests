# Gulp instructions

## Install gulp

 1. install node.js
 2. npm -v to check node is installed correctly
 3. npm init to create you package.js
 4. Create a gulpfile.js file
 5. **npm install gulp --save-dev** to install gulp with a dev dependency.
 6. In gulpfile.js insert this:
 <pre>
/* =======================
Gulp configuration File
======================= */
'use strict';

/* =======================
Load Plugins
======================= */
var gulp = require('gulp');

/* =======================
The main task
======================= */
gulp.task('default', function() {
    console.log("Hello from gulp");
}); 
 </pre>
7. **Gulp** Will execute the default task (gulp)

## Install browser sync
1. **npm install browser-sync --save-dev**
2. Load plugin
<pre>
var gulp = require('gulp'),
    browser = require('browser-sync').create();
</pre>
3. Create a new regular task:
<pre>
/* =======================
Regular tasks
======================= */

// Create a server with BrowserSync and watch for file changes.

gulp.task('server', function() {
    browser.init({

        // Inject CSS changes without the page being reloaded
        injectChanges: true,

        // What to serve
        serve: {
            baseDir: 'dist'
        }

        // The port
        port: 1234
    });
});
</pre>
4. **gulp server**
    - Typing this into the terminal will open up browsersync server
5. Add the server task to the default gulp task
<pre>
/* =======================
The main task
======================= */

gulp.task('default', ['server']); 
</pre>

## Auto-reload browsersync when html changes

<pre>
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
});

// Copies HTML from src to dist.
gulp.task('html', function() {
    //take all html files from src and load them into the datastream, then task the datastream and pipe it through another plugin which is gulp.dest. Dest takes a datastream and writes in somewhere else e.g dist
    return gulp
        .src('src/*.html')
        .pipe(gulp.dest('dist'));
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

/* =======================
The main task
======================= */

gulp.task('default', ['server']); 
 
</pre>

## How to Compile Sass or LESS Files

1. npm install gulp-sass --save-dev
2. Load plugin
<pre>
/* =======================
Load Plugins
======================= */

var gulp = require('gulp'),
    browser = require('browser-sync').create();
    sass = require('gulp-sass');
</pre>
3. Create gulp sass task
<pre>
// Compiles sass to css
// 1. gets all scss from scss folder
// 2. Pushes it through sass plugin to css
// 3. Puts the created css in dist/css folder
// 4. Browser-sync reload
gulp.task('sass', function() {
    return gulp
        .src('src/scss/**/*.scss')
        .pipe(sass({
            outputStyle: 'nested' 
            //expanded, nested, compact, compressed,
        }))
        .pipe(gulp.dest('dist/css'))
        .pipe(browser.stream()); //browsersync reloads
});
</pre>

4. Watch inside server task to check the scss for changes.
<pre>
    // Watch for file changes
    gulp.watch('src/*.html', ['watch-html']);
    gulp.watch('src/scss/**/*.scss', ['sass']);
</pre>
5. Change the main gulp task
<pre>
gulp.task('default', ['html', 'sass', 'server']); 
</pre>
6. **Gulp** to test

## How to use an autoprefixer

1. Install gulp-autoprefixer
<pre>npm install gulp-autoprefixer --save-dev</pre>
2. Load plugin
<pre>
/* =======================
Load Plugins
======================= */

var gulp = require('gulp'),
    browser = require('browser-sync').create(),
    sass = require('gulp-sass'),
    autoprefixer = require('gulp-autoprefixer');
</pre>
3. Use sass function and pipe in the autoprefixer
<pre>
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
        .pipe(autoprefixer())
        .pipe(gulp.dest('dist/css'))
        .pipe(browser.stream());  //browsersync reloads
});

</pre>

## How to concatenate and minify javascript files

1. ***npm install gulp-uglify gulp-concat --save-dev***

2. Load plugins
<pre>
/* =======================
Load Plugins
======================= */

var gulp = require('gulp'),
    browser = require('browser-sync').create(),
    sass = require('gulp-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    inlineCss = require('gulp-inline-css'),
    minifyJS = require('gulp-uglify'),
    concatJS = require('gulp-concat');
</pre>

3. Add a js task to main gulp task
<pre>
gulp.task('default', ['html', 'sass', 'js', 'inlineCss', 'server']); 
</pre>

4. Make js task

<pre>
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
</pre>

5. Make a watch task to server gulp task
<pre>
    gulp.watch('src/js/lib/**/*.js', ['watch-js']);
</pre>

6. Create the watch task
<pre>
gulp.task('watch-js', ['js'], function(done) {
    browser.reload();
    done();
});
</pre>

7. **gulp** to test, make sure you have js files in src/lib to test.

## How to Check JavaScript Files for Errors

1. **npm install gulp-jshint --save-dev**
2. **npm install jshint --save-dev**
3. Load plugin
<pre>
var gulp = require('gulp'),
    browser = require('browser-sync').create(),
    sass = require('gulp-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    inlineCss = require('gulp-inline-css'),
    minifyJS = require('gulp-uglify'),
    concatJS = require('gulp-concat'),
    jshint = require('gulp-jshint');
</pre>
3. Make the exisiting Js gulp task wait on lint-js before starting
<pre>
gulp.task('js', ['lint-js'], function() {
</pre>
4. Make lint-js task
<pre>
// Check javascruipt for errors

gulp.task('lint-js', function() {
    return gulp
        .src('src/js/lib/**/*.js')
        .pipe(jshint());
});
</pre>
5. Install a node module to make error messages pretty **npm install jshint-stylish**
6. Adjust the lint-js task
<pre>
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
</pre>



## How to compress and optimize images

1. npm install gulp-imagemin --save-dev
2. Load plugin
<pre>
    imagemin = require('gulp-imagemin');
</pre>
3. Create gulp task
<pre>
// Compresses images
gulp.task('img', function() {
    return gulp
        .src('src/img/**/*.{png,jpg,gif,svg,ico}')
        .pipe(imagemin({
            verbose: true
        }))
        .pipe(gulp.dest('dist/img'));
});
</pre>
4. Amend task to exclude sprites folder


## How to Run Tasks in Sequence (Not Parallel)

1. **npm install run-sequence --save-dev**
2. Load plugin
<pre>
    sequence = require('run-sequence');
</pre>

## How to rename and delete files

1. **npm i gulp-rename gulp-clean --save-dev**
2. load plugins
<pre>
    clean = require('gulp-clean'),
    rename = require('gulp-rename');
</pre>
3. Create a task that will delete the dist folder so the build can start afresh.
4. Amend the default task to have reset as first procress
<pre>
// 1. launch default
// 2. run reset, then html and then sass and js in parallel, then run server once others finished
gulp.task('default', function(cb) {
    sequence('reset', 'html', ['sass', 'js'], 'server', cb); 
}); 
</pre>

## How to handle errors in gulp

1. **npm i gulp-plumber gulp-notify --save-dev**
2. load plugins
<pre>
    plumber = require('gulp-plumber'),
    notify = require('gulp-notify');
</pre>
3. Create task
<pre>
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
</pre>