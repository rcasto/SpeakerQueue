var gulp = require('gulp'),
    babel = require('gulp-babel'),
    del = require('del'),
    runSequence = require('run-sequence');
    
var jsSources = ['source/scripts/**/*.js', 'source/scripts/*.js'];
var views = ['source/index.html', 'source/views/*.html', 'source/partial-views/*.html'];
var styles = ['source/styles/*.css'];
var images = ['source/images/*.png'];

var outputSources = ['dist/*.*', 'dist/*'];

gulp.task('scripts', function () {
    return gulp.src(jsSources, {
        base: 'source'
    }).pipe(babel({
        presets: ['es2015']
    })).pipe(gulp.dest('./dist'));
});

gulp.task('views', function () {
    return gulp.src(views, {
        base: 'source'
    }).pipe(gulp.dest('./dist'));
});

gulp.task('styles', function () {
    return gulp.src(styles, {
        base: 'source'
    }).pipe(gulp.dest('./dist'));
});

gulp.task('images', function () {
    return gulp.src(images, {
        base: 'source'
    }).pipe(gulp.dest('./dist'));
});

gulp.task('clean', function () {
    return del(outputSources);
});

gulp.task('watch', function () {
    gulp.watch(jsSources, ['scripts']);
});

// Task dependencies all fire at the same time unless
// they too explicitly have dependencies that must run first
gulp.task('default', function () {
    runSequence('clean', ['scripts', 'views', 'images', 'styles'])
});