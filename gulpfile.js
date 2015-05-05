var gulp = require('gulp');
var babel = require('babelify');
var browserify = require('browserify');
var watchify = require('watchify');
var source = require('vinyl-source-stream');



gulp.task('babel', function () {
    var bundler = watchify(browserify(watchify.args));
    return bundler.add('./example.js')
    .transform(babel)
    .bundle()
    .on("error", function (err) { console.log("Error : " + err.message); this.emit('end'); })
    .pipe(source('widget.js'))
    .pipe(gulp.dest('./Public/'))
});