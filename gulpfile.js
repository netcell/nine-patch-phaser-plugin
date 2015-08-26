var gulp        = require('gulp');
var clean       = require('gulp-clean');
var browserify  = require('browserify');
var source      = require('vinyl-source-stream');
var babelify    = require('babelify');
var uglify      = require('gulp-uglify');
var rename      = require('gulp-rename');
var runSequence = require('run-sequence');

gulp.task('copy:example', function() {
	return gulp.src('./build/*.js')
	.pipe(gulp.dest('./example/nine-patch-phaser-plugin'));
});

gulp.task('minify', function() {
	return gulp.src('./build/nine-patch-phaser-plugin.js')
	.pipe(rename('nine-patch-phaser-plugin.min.js'))
	.pipe(uglify())
	.pipe(gulp.dest('./build'));
});

gulp.task('browserify', function() {
	var bundler = browserify('./src/index.js', { extensions : ['.js', '.es6'] });
	bundler.transform( babelify.configure({ only : /es6/ }) );
	return bundler.bundle()
	.pipe(source('nine-patch-phaser-plugin.js'))
	.pipe(gulp.dest('./build'));
});

gulp.task('browserify:debug', function() {
	var bundler = browserify('./src/index.js', { extensions : ['.js', '.es6'], debug : true });
	bundler.transform( babelify.configure({ only : /es6/ }) );
	return bundler.bundle()
	.pipe(source('nine-patch-phaser-plugin.js'))
	.pipe(gulp.dest('./build'));
});

gulp.task('clean', function () {
	return gulp.src([ './build/**/*.*', ], {read: false}).pipe(clean({force: true}));
});

gulp.task('default', function(cb) {
	runSequence('clean', 'browserify', 'minify', 'copy:example', cb);
});

gulp.task('debug', function(cb) {
	runSequence('clean', 'browserify:debug', 'minify', 'copy:example', cb);
});