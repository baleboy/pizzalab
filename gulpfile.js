var gulp = require('gulp');
var browserSync = require('browser-sync').create();
var htmlmin = require('gulp-htmlmin');
var inlinesource = require('gulp-inline-source');
var del = require('del');

gulp.task('serve', function () {
  browserSync.init({
    server: {
      baseDir: "./app"
    }
  });
  gulp.watch(['app/*.html'], browserSync.reload);
  gulp.watch(['app/styles/*.css'], browserSync.reload);
  gulp.watch(['app/scripts/*.js'], browserSync.reload);
});

gulp.task('inline', function() {
  return gulp.src('app/*.html')
    .pipe(inlinesource({compress: false}))
    .pipe(htmlmin({collapseWhitespace: true, minifyJS: true, minifyCSS: true}))
    .pipe(gulp.dest('dist'));
});

gulp.task('clean', function() {
  del(['dist']);
})