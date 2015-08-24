 var gulp = require('gulp'),
    plumber = require('gulp-plumber'),
    eslint = require('gulp-eslint'),
    rename = require('gulp-rename'),
    sass = require('gulp-sass'),
    minifyCSS = require('gulp-minify-css'),
    //For mocha tests
    babel = require("mocha-babel"),
    //wrap = require('gulp-wrap'),
    uglify = require("gulp-uglify"),
    runSeq = require('run-sequence'),
    browserify = require('browserify'),
    source = require('vinyl-source-stream'),
    babelify = require('babelify'),
    mocha = require("gulp-mocha"),
    istanbul = require("gulp-istanbul"),
    isparta = require("isparta");

var js_client_path = './browser/**/*.js';
var js_out_file = "anansi.js"
var js_client_start_path = './browser/main.js';
var js_server_path = './server/**/*.js';
var game_files = "./browser/game/**/*.js";
var tests = "./test/**/*.spec.js";

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


gulp.task("gameCoverage:instrument", function () {
    return gulp.src(game_files)
            .pipe(istanbul({
                instrumenter: isparta.Instrumenter
            }))
            .pipe(istanbul.hookRequire());
});

gulp.task("gameCoverage:report", function (done) {
    return gulp.src(game_files, {read: false})
        .pipe(istanbul.writeReports());
});


gulp.task("testGame", function () {
        // return gulp.src(tests)
        //         .pipe(mocha({
        //             reporter: "nyan",
        //             compilers: {
        //                 js: babel
        //             }
        //         }));
});

gulp.task("testGame:coverage", function (done) {
    runSeq("gameCoverage:instrument", "testGame", "gameCoverage:report", done);
});

gulp.task('default', function(){
    gulp.start(["testGame", 'buildJS', 'buildCSS']);
    gulp.watch([js_client_start_path, js_client_path, js_server_path], ['lintJS']);
    gulp.watch([game_files], ["testGame"]);
    gulp.watch([js_client_start_path,js_client_path], function(){
        runSeq('buildJS');
    });
    gulp.watch('./browser/scss/*.scss', function(){
        runSeq('buildCSS');
    });
});

