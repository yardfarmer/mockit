var gulp = require('gulp');
var usemin = require('gulp-usemin');
var uglify = require('gulp-uglify');
var minifyHtml = require('gulp-minify-html');
var minifyCss = require('gulp-minify-css');
var rev = require('gulp-rev');
var clean = require('gulp-clean');
var zip = require('gulp-zip');
var runSequence = require('run-sequence');


gulp.task('clean', function () {
    return gulp.src('build/*')
        .pipe(clean());
});

gulp.task('usemin', function () {
    return gulp.src('src/*.html')
        .pipe(usemin({
            css: [minifyCss, rev],
            html: [function () {
                return minifyHtml({empty: true});
            }],
            js: [uglify, rev]
        }))
        .pipe(gulp.dest('build/'));
});

gulp.task('manifest', function () {
    return gulp.src(['src/js/*'])
        .pipe(gulp.dest('build/src/js'));
});

gulp.task('manifest', function () {
    return gulp.src(['manifest.json'])
        .pipe(gulp.dest('build/'));
});

gulp.task('assets', function () {
    return gulp.src(['assets/*'])
        .pipe(gulp.dest('build/assets/'));
});

gulp.task('zip', function () {
    var version = require('./package.json').version;
    return gulp.src('build/**/*')
        .pipe(zip('mockit-' + version + '.zip'))
        .pipe(gulp.dest('release'));
});

//gulp.task('defaults', function (callback) {
//    runSequence('clean',
//        //['assets', 'manifest', 'usemin'],
//        'zip',
//        callback);
//});

gulp.task('default', [
    //'clean'
    'usemin',
     'manifest', 'assets', 'zip'
]);
