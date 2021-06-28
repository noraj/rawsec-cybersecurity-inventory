// Load plugins
const { series, parallel, src, dest, task } = require('gulp');
const { exec } = require('child_process');
const pug = require('gulp-pug');
const data = require('gulp-data');
const merge = require('gulp-merge-json');
const sass = require('gulp-sass')(require('sass'));
var connect = require('gulp-connect');
const fs = require('fs');
const path = require('path');
const del = require('del');

// ES6 modules (imports and exports) as they are not yet supported natively in Node
// so I'm using gulp.task instead of commonJs exports.aTaskName = aFunc
task(clean);
clean.description = 'Clean the build directory';
task('server', webserver);
task('server').description = 'Local dev web server';
task('build',
    series(
        series(pug_data, pug_src),
        series(api_clean, api_build, api_copy),
        parallel(
            bulma, bulmajs, tablefilter, sweetalert2, jquery, minisearch, js,
            fontawesome, font_mfizz, images, css
)));
task('build').description = 'Build the static website';
task('default', series('clean', 'build'));
task('default').description = 'clean + build';

function clean() {
    // You can use multiple globbing patterns as you would with `gulp.src`
    return del(['build']);
};

// aggregate different JSON files into one database
function pug_data() {
    return src('data/**/*.json')
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
        .pipe(dest('temp/'));
};

// compile pug templates into HTML and pass data in argument
function pug_src() {
    return src('pug/*.pug')
        .pipe(data(function() {
            return JSON.parse(fs.readFileSync('temp/data.json'));
        }))
        .pipe(pug({
            pretty: true,
        }))
        .pipe(dest('build/'));
};

function api_clean() {
    return del('temp/api');
};

// build the static JSON API via an external script, I didn't find a cleaner way to do it with gulp
// also require 'pug:data' to be run before
function api_build() {
    return exec('node make-scripts/static-json-api.js');
};

function api_copy(cb) {
    return src('temp/api/**/*.json')
        .pipe(dest('build/api/'))
};

// build the customized bulma CSS
function bulma() {
    return src('sass/bulma.sass')
        .pipe(sass())
        .pipe(dest('build/css/vendor/bulma/'));
};

function bulmajs() {
    return src('node_modules/@vizuaalog/bulmajs/dist/navbar.js')
        .pipe(dest('build/js/vendor/bulmajs/'));
  };

function tablefilter() {
    return src('node_modules/tablefilter/dist/tablefilter/**/*',
        { base: 'node_modules/tablefilter/dist/'}
    )
        .pipe(dest('build/js/vendor/'));
};

function sweetalert2() {
    return src('node_modules/sweetalert2/dist/sweetalert2.all.min.js')
        .pipe(dest('build/js/vendor/sweetalert2/'));
};

function jquery() {
    return src('node_modules/jquery/dist/jquery.min.js')
        .pipe(dest('build/js/vendor/jquery/'));
};

function minisearch() {
    return src('node_modules/minisearch/dist/umd/index.js')
        .pipe(dest('build/js/vendor/minisearch/'));
};

// copy personal (non-vendor) scripts
function js() {
    return src('js/**/*.js')
        .pipe(dest('build/js/'));
};

// build personal (non-vendor) css
function css() {
    return src('sass/site.sass')
        .pipe(sass())
        .pipe(dest('build/css/'));
};

function fontawesome() {
    return src(['node_modules/@fortawesome/fontawesome-free/css/*',
    'node_modules/@fortawesome/fontawesome-free/webfonts/*'],
    { base: 'node_modules/@fortawesome/fontawesome-free/'}
    )
        .pipe(dest('build/css/vendor/fontawesome/'));
};

function font_mfizz() {
    return src(['node_modules/font-mfizz/dist/*',
    '!node_modules/font-mfizz/dist/preview.html',
    ])
        .pipe(dest('build/css/vendor/font-mfizz/'));
};

function images() {
    return src('img/**/*.*')
        .pipe(dest('build/img/'));
};

function webserver() {
  connect.server({
    root: 'build',
    port: 3000
  });
};
