var gulp = require('gulp'),
    pug = require('gulp-pug'),
    data = require('gulp-data'),
    merge = require('gulp-merge-json'),
    sass = require('gulp-sass'),
    exec = require('child_process').exec,
    fs = require('fs'),
    path = require('path'),
    del = require('del');

gulp.task('clean', function() {
  // You can use multiple globbing patterns as you would with `gulp.src`
  return del(['build']);
});

// aggregate different JSON files into one database
gulp.task('pug:data', ['clean'], function() {
    return gulp.src('data/**/*.json')
        .pipe(merge({
            fileName: 'data.json',
            edit: (json, file) => {
                // Extract the filename and strip the extension
                var filename = path.basename(file.path),
                    parentFolder = path.basename(path.dirname(file.path)),
                    filenameStrip = filename.replace(path.extname(filename), '');
                var primaryKey = parentFolder + '_' + filenameStrip;

                // Keep the tree structure
                var data = {};
                if(typeof data[parentFolder] === 'undefined') {
                    data[parentFolder] = {};
                }
                data[parentFolder][filenameStrip] = json;

                return data;
            },
            jsonSpace: '  '
        }))
        .pipe(gulp.dest('temp/'));
});

// compile pug templates into HTML and pass data in argument
gulp.task('pug:src', ['clean', 'pug:data'], function() {
    return gulp.src('pug/*.pug')
        .pipe(data(function() {
            return JSON.parse(fs.readFileSync('temp/data.json'))
        }))
        .pipe(pug({
            pretty: true,
        }))
        .pipe(gulp.dest('build/'));
});

// build the static JSON API via an external script, I didn't find a cleaner way to do it with gulp
gulp.task('api:build', ['api:clean', 'pug:data'], function(cb){
    exec('node make-scripts/static-json-api.js', function (err, stdout, stderr) {
        //console.log(stdout);
        //console.log(stderr);
        cb(err);
    });
});

gulp.task('api:copy', ['clean', 'api:build'], function(cb){
    return gulp.src('temp/api/**/*.json')
    .pipe(gulp.dest('build/api/'))
});

gulp.task('api:clean', function(cb){
    return del('temp/api');
});

// build the customized bulma CSS
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

// copy personal (non-vendor) scripts
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

gulp.task('default', [ 'pug:src', 'api:copy', 'bulma', 'tablefilter', 'sweetalert2', 'jquery', 'js', 'fontawesome', 'font-mfizz', 'images' ]);
