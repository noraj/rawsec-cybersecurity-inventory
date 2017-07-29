var gulp = require('gulp');
var pug = require('gulp-pug');
var sass = require('gulp-sass');
var del = require('del');

gulp.task('clean', function() {
  // You can use multiple globbing patterns as you would with `gulp.src`
  return del(['build']);
});

gulp.task('html', ['clean'], function(){
    return gulp.src('pug/*.pug')
        .pipe(pug({
            pretty: true
        }))
        .pipe(gulp.dest('build/'))
});

gulp.task('bulma', ['clean'], function(){
    return gulp.src('sass/bulma.sass')
        .pipe(sass())
        .pipe(gulp.dest('build/css/vendor/bulma/'))
});

gulp.task('tablefilter', ['clean'], function(){
    return gulp.src(['node_modules/tablefilter/dist/tablefilter/**/*',
        /* Remove unused themes */
        '!node_modules/tablefilter/dist/tablefilter/style/themes/[a-z]*/**'],
        { base: 'node_modules/tablefilter/dist/'}
    )
        .pipe(gulp.dest('build/js/vendor/'))
});

gulp.task('jquery', ['clean'], function(){
    return gulp.src('node_modules/jquery/dist/jquery.min.js')
        .pipe(gulp.dest('build/js/vendor/jquery/'))
});

gulp.task('js', ['clean'], function(){
    return gulp.src('js/**/*.js')
        .pipe(gulp.dest('build/js/'))
});

gulp.task('font-awesome', ['clean'], function(){
    return gulp.src(['node_modules/font-awesome/css/*',
    'node_modules/font-awesome/fonts/*'],
    { base: 'node_modules/font-awesome/'}
    )
        .pipe(gulp.dest('build/css/vendor/font-awesome/'))
});

gulp.task('font-mfizz', ['clean'], function(){
    return gulp.src(['node_modules/font-mfizz/dist/*',
    '!node_modules/font-mfizz/font/preview.html',
    ])
        .pipe(gulp.dest('build/css/vendor/font-mfizz/'))
});

gulp.task('default', [ 'html', 'bulma', 'tablefilter', 'jquery', 'js', 'font-awesome', 'font-mfizz' ]);
