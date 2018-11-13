var gulp = require('gulp');
var less = require('gulp-less');
var newer = require('gulp-newer');
var livereload = require('gulp-livereload');
var watch = require('gulp-watch');
var sourcemaps = require('gulp-sourcemaps');
var autoprefixer = require('gulp-autoprefixer');
var notify = require('gulp-notify');
var plumber = require('gulp-plumber');
var resize = require('gulp-image-resize');

function handleError(err) {
    console.log(err);
    this.emit('end');
}

gulp.task('clean', function(){

});

gulp.task('copy', function(){
    return gulp.src(['src/**/*.html', 'src/**/*.json', 'src/.htaccess'])
        .pipe(newer('dist'))
        .pipe(gulp.dest('dist'))
        .pipe(notify({message:'Files copied!', onLast:true}))
        .pipe(livereload());
});

//gulp.task('images', function(){
//    return gulp.src(['src/**/*.jpg', 'src/**/*.png'])
//        .pipe(newer('dist'))
//        .pipe(gulp.dest('dist'))
//        .pipe(notify({message:'Images copied!', onLast:true}))
//        .pipe(livereload());
//});

gulp.task('project-images', function(){
    return gulp.src(['src/img/*/*.png', 'src/img/*/*.jpg'])
        .pipe(newer({dest:'dist/img', ext:'.jpg'}))
        .pipe(resize({
            height: 500,
            quality: 0.8,
            format: 'jpg',
            imageMagick: true
        }))
        .pipe(gulp.dest('dist/img'))
        .pipe(notify({message:'Images copied!', onLast:true}))
        .pipe(livereload());
});

gulp.task('less', function(){
    return gulp.src(['src/**/*.less'])
        .pipe(plumber(handleError))
        .pipe(newer({dest:'dist', ext:'.css'}))
        .pipe(sourcemaps.init())
        .pipe(less())
        .pipe(autoprefixer())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('dist'))
        .pipe(notify({message:'Less processed!', onLast:true}))
        .pipe(livereload());
});

gulp.task('scripts', function(){
    return gulp.src(['src/**/*.js'])
        .pipe(newer('dist'))
        .pipe(gulp.dest('dist'))
        .pipe(notify({message:'Scripts processed!', onLast:true}))
        .pipe(livereload());
});

gulp.task('watch', function() {
    livereload.listen();
    watch(['src/**/*.js', '!src/lib/bower_components/**/*'], function(){ gulp.start('scripts')});
    watch(['src/**/*.less', '!src/lib/bower_components/**/*'], function(){ gulp.start('less')});
    watch(['src/**/*.html', 'src/**/*.json', '!src/lib/bower_components/**/*'], function(){ gulp.start('copy')});
    watch(['src/img/*/*.jpg', 'src/img/*/*.png', '!src/lib/bower_components/**/*'], function(){ gulp.start('project-images')});
});