var gulp = require('gulp'),
    concat = require('gulp-concat'),
    plumber = require('gulp-plumber'),
    eslint = require('gulp-eslint'),
    rename = require('gulp-rename'),
    sass = require('gulp-sass'),
    minifyCSS = require('gulp-minify-css'),
    babel = require('gulp-babel'),
    rjsOptimize = require('gulp-requirejs-optimize'),
    //wrap = require('gulp-wrap'),
    sourcemaps = require('gulp-sourcemaps'),
    runSeq = require('run-sequence');

var js_client_path = './browser/app/**/*.js';
var js_out_file = "spiderwars.js"
var js_client_start_path = './browser/main.js';
var js_server_path = './server/**/*.js';

gulp.task('lintJS', function(){
    return gulp.src([js_client_path, js_server_path])
        .pipe(eslint())
        .pipe(eslint.format())
        .pipe(eslint.failOnError());
});

gulp.task('buildJS', ['lintJS'], function(){
    return gulp.src(js_client_start_path)
        .pipe(rjsOptimize({
            optimize: "none", 
            out: js_out_file
        }))
        .pipe(plumber())
        .pipe(sourcemaps.init())
        //.pipe(wrap('(function(){\n"use strict";\n<%= contents %>\n})();'))
        .pipe(concat('spiderwars.js'))
        .pipe(babel())
        .pipe(sourcemaps.write())
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

