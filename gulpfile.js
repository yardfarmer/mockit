var gulp = require('gulp');
var usemin = require('gulp-usemin');
var uglify = require('gulp-uglify');
var minifyHtml = require('gulp-minify-html');
var minifyCss = require('gulp-minify-css');
var rev = require('gulp-rev');
var clean = require('gulp-clean');


gulp.task('usemin', function () {
    return gulp.src('src/*.html')
        .pipe(clean())
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
    return gulp.src(['manifest.json'])
        .pipe(gulp.dest('build/'));
});

gulp.task('assets', function () {
    return gulp.src(['assets/*'])
        .pipe(gulp.dest('build/assets/'));
});
