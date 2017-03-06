var gulp = require('gulp');
var browserSync = require('browser-sync').create();
var htmlmin = require('gulp-htmlmin');
var inlinesource = require('gulp-inline-source');
var del = require('del');
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');
var autoprefixer = require('gulp-autoprefixer');

gulp.task('serve', ['sass'], function () {
  browserSync.init({
    server: {
      baseDir: "./src"
    }
  });
  gulp.watch(['src/*.html'], browserSync.reload);
  gulp.watch("src/styles/*.scss", ['sass']);
  gulp.watch(['src/scripts/*.js'], browserSync.reload);
});

gulp.task('sass', function () {
  return gulp.src('src/styles/*.scss')
    .pipe(sourcemaps.init())
    .pipe(sass().on('error', sass.logError))
    .pipe(sourcemaps.write())
    .pipe(autoprefixer())
    .pipe(gulp.dest('src/styles'))
    .pipe(browserSync.stream());
});

gulp.task('dist', ['sass'], function() {
  return gulp.src('src/*.html')
    .pipe(inlinesource({compress: false}))
    .pipe(htmlmin({collapseWhitespace: true, minifyJS: true, minifyCSS: true}))
    .pipe(gulp.dest('dist'));
});

gulp.task('clean', function() {
  del(['dist']);
})

gulp.task('default', ['clean','inline']);
