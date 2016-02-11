var gulp = require('gulp');
var browserSync = require('browser-sync').create();

// Static server
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