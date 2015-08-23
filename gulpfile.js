 var gulp = require('gulp'),
    plumber = require('gulp-plumber'),
    eslint = require('gulp-eslint'),
    rename = require('gulp-rename'),
    sass = require('gulp-sass'),
    minifyCSS = require('gulp-minify-css'),
    babel = require('gulp-babel'),
    //wrap = require('gulp-wrap'),
    sourcemaps = require('gulp-sourcemaps'),
    uglify = require("gulp-uglify"),
    runSeq = require('run-sequence'),
    browserify = require('browserify'),
    source = require('vinyl-source-stream'),
    babelify = require('babelify');

var js_client_path = './browser/**/*.js';
var js_out_file = "anansi.js"
var js_client_start_path = './browser/main.js';
var js_server_path = './server/**/*.js';

gulp.task('lintJS', function(){
    return gulp.src([js_client_path, js_server_path])
        .pipe(eslint())
        .pipe(eslint.format())
        .pipe(eslint.failOnError());
});

gulp.task('buildJS', ["lintJS"], function () {

    var bundler = browserify({ debug: true });
    bundler.add('./browser/main.js');
    bundler.transform(babelify);
    bundler.bundle()
        .pipe(source('anansi.js'))
        .pipe(gulp.dest('./public'));

});

gulp.task('buildCSS', function () {
    return gulp.src(['./browser/scss/main.scss'])
        .pipe(sass({
            includePaths:require('node-normalize-scss').includePaths,
            errLogToConsole:true
        }))
        .pipe(rename('styles.css'))
        //.pipe(minifyCSS())
        .pipe(gulp.dest('./public'))
});

gulp.task('testBrowserJS', function (done) {
    karma.start({
        configFile: __dirname + '/tests/browser/karma.conf.js',
        singleRun: true
    }, done);
});


gulp.task('default', function(){

    gulp.start(['buildJS', 'buildCSS']);
    gulp.watch([js_client_start_path, js_client_path, js_server_path], ['lintJS']);
    gulp.watch([js_client_start_path,js_client_path], function(){
        runSeq('buildJS');
    });
    gulp.watch('./browser/scss/*.scss', function(){
        runSeq('buildCSS');
    });

});

