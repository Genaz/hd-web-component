var gulp = require('gulp'),
    sass = require('gulp-sass'),
    sourcemaps = require('gulp-sourcemaps'),
    webserver = require('gulp-webserver');

gulp.task('sass', function () {
  return gulp.src('src/styles/**/*.scss')
    .pipe(sourcemaps.init())
    .pipe(sass().on('error', sass.logError))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('dist/css'));
});

gulp.task('sass-component', function () {
    return gulp.src('src/components/**/*.scss')
      .pipe(sourcemaps.init())
      .pipe(sass().on('error', sass.logError))
      .pipe(sourcemaps.write())
      .pipe(gulp.dest('dist/css'));
});

gulp.task('watch', function() {
    gulp.watch(['src/styles/**/*'], ['sass']);
    gulp.watch(['src/components/**/*.scss'], ['sass-component']);
});

gulp.task('webserver', function() {
  gulp.src('dist/')
      .pipe(webserver({
          livereload: true,
          open: true
      }));
});

gulp.task('default', ['sass', 'sass-component', 'watch', 'webserver']);