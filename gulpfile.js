var gulp = require('gulp');
var browserSync = require('browser-sync').create();
var htmlmin = require('gulp-htmlmin');
var inlinesource = require('gulp-inline-source');
var del = require('del');
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');
var autoprefixer = require('gulp-autoprefixer');
var ts = require('gulp-typescript');
var tsProject = ts.createProject('src/scripts/tsconfig.json');
var browserify = require('browserify');
var source = require('vinyl-source-stream');

gulp.task('serve', ['sass', 'scripts'], function () {
  browserSync.init({
    server: {
      baseDir: "./src"
    }
  });
  gulp.watch(['src/*.html'], browserSync.reload);
  gulp.watch("src/styles/*.scss", ['sass']);
  gulp.watch(['src/scripts/*.ts'], ['scripts']);
});

gulp.task('scripts', function () {
  var tsResult = gulp.src('src/scripts/*.ts')
    .pipe(tsProject());
  tsResult.js
    .pipe(gulp.dest('src/scripts'));
  return browserify('src/scripts/app.js')
    .bundle()
    .pipe(source('bundle.js'))
    .pipe(gulp.dest('src/scripts'))
    .pipe(browserSync.stream());
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

gulp.task('dist', ['sass', 'scripts'], function() {
  return gulp.src('src/*.html')
    .pipe(inlinesource({compress: false}))
    .pipe(htmlmin({collapseWhitespace: true, minifyJS: true, minifyCSS: true}))
    .pipe(gulp.dest('dist'));
});

gulp.task('clean', function() {
  del(['dist']);
})

gulp.task('default', ['clean','inline']);
