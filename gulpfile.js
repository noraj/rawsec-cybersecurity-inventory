var gulp = require('gulp'),
    pug = require('gulp-pug'),
    data = require('gulp-data'),
    merge = require('gulp-merge-json'),
    sass = require('gulp-sass'),
    fs = require('fs'),
    path = require('path'),
    del = require('del');

gulp.task('clean', function() {
  // You can use multiple globbing patterns as you would with `gulp.src`
  return del(['build']);
});

gulp.task('pug:data', ['clean'], function() {
    return gulp.src('data/**/*.json')
        .pipe(merge({
            fileName: 'data.json',
            edit: (json, file) => {
                // Extract the filename and strip the extension
                var filename = path.basename(file.path),
                    primaryKey = filename.replace(path.extname(filename), '');

                // Set the filename as the primary key for our JSON data
                var data = {};
                data[primaryKey] = json;

                return data;
            }
        }))
        .pipe(gulp.dest('temp/'));
});

gulp.task('pug:src', ['clean', 'pug:data'], function() {
    return gulp.src('pug/**/*.pug')
        .pipe(data(function() {
            return JSON.parse(fs.readFileSync('temp/data.json'))
        }))
        .pipe(pug({
            pretty: true,
        }))
        .pipe(gulp.dest('build/'));
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

gulp.task('sweetalert2', ['clean'], function(){
    return gulp.src('node_modules/sweetalert2/dist/sweetalert2.all.min.js')
        .pipe(gulp.dest('build/js/vendor/sweetalert2/'))
});

gulp.task('jquery', ['clean'], function(){
    return gulp.src('node_modules/jquery/dist/jquery.min.js')
        .pipe(gulp.dest('build/js/vendor/jquery/'))
});

gulp.task('js', ['clean'], function(){
    return gulp.src('js/**/*.js')
        .pipe(gulp.dest('build/js/'))
});

gulp.task('fontawesome', ['clean'], function(){
    return gulp.src(['node_modules/@fortawesome/fontawesome-free-webfonts/css/*',
    'node_modules/@fortawesome/fontawesome-free-webfonts/webfonts/*'],
    { base: 'node_modules/@fortawesome/fontawesome-free-webfonts/'}
    )
        .pipe(gulp.dest('build/css/vendor/fontawesome/'))
});

gulp.task('font-mfizz', ['clean'], function(){
    return gulp.src(['node_modules/font-mfizz/dist/*',
    '!node_modules/font-mfizz/dist/preview.html',
    ])
        .pipe(gulp.dest('build/css/vendor/font-mfizz/'))
});

gulp.task('images', ['clean'], function(){
    return gulp.src('img/**/*.*')
        .pipe(gulp.dest('build/img/'))
});

gulp.task('default', [ 'pug:src', 'bulma', 'tablefilter', 'sweetalert2', 'jquery', 'js', 'fontawesome', 'font-mfizz', 'images' ]);
