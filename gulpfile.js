var gulp = require('gulp');
var browserSync = require('browser-sync').create();
var htmlmin = require('gulp-htmlmin');
var inlinesource = require('gulp-inline-source');
var del = require('del');
var sass = require('gulp-sass');
 
gulp.task('serve', ['sass'], function () {
  browserSync.init({
    server: {
      baseDir: "./app"
    }
  });
  gulp.watch(['app/*.html'], browserSync.reload);
  gulp.watch("app/styles/*.scss", ['sass']);
  gulp.watch(['app/scripts/*.js'], browserSync.reload);
});

gulp.task('sass', function () {
  return gulp.src('app/styles/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('app/styles'))
    .pipe(browserSync.stream());
});

gulp.task('dist', ['sass'], function() {
  return gulp.src('app/*.html')
    .pipe(inlinesource({compress: false}))
    .pipe(htmlmin({collapseWhitespace: true, minifyJS: true, minifyCSS: true}))
    .pipe(gulp.dest('dist'));
});

gulp.task('clean', function() {
  del(['dist']);
})

gulp.task('default', ['clean','inline']);