var gulp = require('gulp'),
    uglify = require('gulp-uglify'),
    concat = require('gulp-concat');

gulp.task('default', function() {
  // place code for your default task here
});

gulp.task('minify', function () {
    return gulp.src('public/scripts/**/*.js')
        .pipe(uglify())
        .pipe(concat('app.js'))
        .pipe(gulp.dest('public/dist'));
});
