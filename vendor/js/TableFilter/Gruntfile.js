module.exports = function (grunt) {
    var webpackConfig = require('./webpack.config.js');
    var webpackDevConfig = require('./webpack.dev.config.js');
    var webpackTestConfig = require('./webpack.test.config.js');
    var fs = require('fs');
    var path = require('path');
    var testDir = 'test';
    var testHost = 'http://localhost:8000/';
    var pkg = grunt.file.readJSON('package.json');
    var repo = 'github.com/koalyptus/TableFilter';
    var styleDirDist = 'dist/tablefilter/style/';

    grunt.initConfig({

        eslint: {
            options: {
                configFile: '.eslintrc'
            },
            target: [
                'Gruntfile.js',
                'webpack.config.js',
                'webpack.dev.config.js',
                'webpack.test.config.js',
                'src/**/*.js',
                'test/*.js'
            ]
        },

        qunit: {
            options: {
                '--web-security': 'no',
                coverage: {
                    disposeCollector: true,
                    src: ['dist/tablefilter/*.js'],
                    instrumentedFiles: 'temp/',
                    htmlReport: 'report/coverage',
                    coberturaReport: 'report/',
                    lcovReport: 'report/',
                    jsonReport: 'report',
                    linesThresholdPct: 80
                }
            },
            all: {
                options: {
                    urls: getTestFiles(testDir, testHost)
                }
            },
            only: {
                options: {
                    urls: []
                }
            }
        },

        connect: {
            server: {
                options: {
                    port: 8000,
                    base: '.'
                }
            }
        },

        copy: {
            dist: {
                src: [
                    '**',
                    '!**/*.styl',
                    '!**/extensions/**',
                    '!**/mixins/**'
                ],
                cwd: 'static/style',
                dest: 'dist/tablefilter/style',
                expand: true
            },
            templates: {
                src: ['**'],
                cwd: 'static/templates',
                dest: 'demos',
                expand: true
            },
            assets: {
                src: ['**'],
                cwd: 'static/demos-assets',
                dest: 'demos/assets',
                expand: true
            },
            starter: {
                src: ['demos/starter.html'],
                dest: 'dist/starter.html'
            }
        },

        'string-replace': {
            demos: {
                files: { 'demos/': 'demos/*.html' },
                options: {
                    replacements: [
                        {
                            pattern: /{NAME}/ig,
                            replacement: pkg.name
                        }, {
                            pattern: /{VERSION}/ig,
                            replacement: pkg.version
                        }, {
                            pattern: /{EZEDITTABLE_LINK}/ig,
                            replacement: '<a href="http://edittable.free.fr/' +
                            'zip.php?f=ezEditTable.zip&amp;p=1"' +
                            'target="_blank" title="ezEditTable is a ' +
                            'javascript code aimed at enhancing regular ' +
                            'HTML tables by adding features such as ' +
                            'inline editing components, advanced ' +
                            'selection and keyboard navigation ' +
                            '- Developed by ' + pkg.author.name + '">' +
                            'ezEditTable</a>'
                        }, {
                            pattern: /<!-- @import (.*?) -->/ig,
                            replacement: function (match, p1) {
                                return grunt.file.read('static/' + p1);
                            }
                        }
                    ]
                }
            }
        },

        clean: ['demos/starter.html'],

        'webpack-dev-server': {
            options: {
                webpack: webpackDevConfig,
                publicPath: '/dist/'
            },
            start: {
                webpack: {
                    devtool: 'eval'
                }
            }
        },

        webpack: {
            build: webpackConfig,
            dev: webpackDevConfig,
            test: webpackTestConfig
        },

        watch: {
            app: {
                files: ['src/**/*', 'static/style/**/*'],
                tasks: ['dev'],
                options: {
                    spawn: false
                }
            },
            templates: {
                files: ['static/templates/**/*', 'static/partials/**/*'],
                tasks: ['build-demos'],
                options: {
                    spawn: false
                }
            }
        },

        babel: {
            options: {
                sourceMap: true,
                modules: 'amd',
                compact: false,
                presets: ['es2015']
            },
            dist: {
                files: [{
                    expand: true,
                    cwd: 'src',
                    src: ['**/*.js'],
                    dest: 'dist/tablefilter'
                }]
            }
        },

        esdoc: {
            dist: {
                options: {
                    source: 'src',
                    destination: 'docs/docs',
                    title: pkg.name + ' v' + pkg.version
                }
            }
        },

        stylus: {
            compile: {
                options: {
                    banner: '/** \n' +
                    ' *\t ' + pkg.name + ' v' + pkg.version +
                    ' by ' + pkg.author.name + ' \n' +
                    ' *\t build date: ' + new Date().toISOString() + ' \n' +
                    ' *\t MIT License  \n' +
                    ' */ \n'
                },
                files: [
                    {
                        src: ['static/style/*.styl'],
                        dest: styleDirDist + 'tablefilter.css'
                    }, {
                        src: ['static/style/extensions/colsVisibility.styl'],
                        dest: styleDirDist + 'colsVisibility.css'
                    }, {
                        src: ['static/style/extensions/filtersVisibility.styl'],
                        dest: styleDirDist + 'filtersVisibility.css'
                    }, {
                        src: ['static/style/themes/default/*.styl'],
                        dest: styleDirDist + 'themes/default/default.css'
                    }, {
                        src: ['static/style/themes/mytheme/*.styl'],
                        dest: styleDirDist + 'themes/mytheme/mytheme.css'
                    }, {
                        src: ['static/style/themes/skyblue/*.styl'],
                        dest: styleDirDist + 'themes/skyblue/skyblue.css'
                    }, {
                        src: ['static/style/themes/transparent/*.styl'],
                        dest:
                            styleDirDist + 'themes/transparent/transparent.css'
                    }
                ]
            }
        },

        'gh-pages': {
            options: {
                branch: 'gh-pages',
                add: true
            },
            'publish-lib': {
                options: {
                    base: 'dist',
                    repo: 'https://' + repo,
                    message: 'publish TableFilter lib to gh-pages (cli)'
                },
                src: ['**/*']
            },
            'publish-readme': {
                options: {
                    base: './',
                    repo: 'https://' + repo,
                    message: 'publish README and LICENSE to gh-pages (cli)'
                },
                src: ['README.md', 'LICENSE']
            },
            'publish-docs': {
                options: {
                    base: 'docs',
                    repo: 'https://' + repo,
                    message: 'publish Docs to gh-pages (cli)'
                },
                src: ['**/*']
            },
            'deploy-lib': {
                options: {
                    user: {
                        name: 'koalyptus'
                    },
                    base: 'dist',
                    repo: 'https://' + process.env.GH_TOKEN + '@' + repo,
                    message: 'publish TableFilter to gh-pages (auto)' +
                    getDeployMessage(),
                    silent: true
                },
                src: ['**/*']
            },
            'deploy-readme': {
                options: {
                    user: {
                        name: 'koalyptus'
                    },
                    base: './',
                    repo: 'https://' + process.env.GH_TOKEN + '@' + repo,
                    message: 'publish README to gh-pages (auto)' +
                    getDeployMessage(),
                    silent: true
                },
                src: ['README.md', 'LICENSE']
            },
            'deploy-docs': {
                options: {
                    user: {
                        name: 'koalyptus'
                    },
                    base: 'docs',
                    repo: 'https://' + process.env.GH_TOKEN + '@' + repo,
                    message: 'publish Docs to gh-pages (auto)' +
                    getDeployMessage(),
                    silent: true
                },
                src: ['**/*']
            }
        }

    });

    grunt.loadNpmTasks('grunt-eslint');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-string-replace');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-webpack');
    grunt.loadNpmTasks('grunt-babel');
    grunt.loadNpmTasks('grunt-esdoc');
    grunt.loadNpmTasks('grunt-qunit-istanbul');
    grunt.loadNpmTasks('grunt-contrib-stylus');
    grunt.loadNpmTasks('grunt-gh-pages');

    grunt.registerTask('default', ['test', 'build', 'build-demos']);

    // Development server
    grunt.registerTask('server', ['webpack-dev-server:start']);

    // Dev dev/build/watch cycle
    grunt.registerTask('dev',
        ['eslint', 'webpack:dev', 'copy:dist', 'stylus:compile', 'watch:app']);

    // Production build
    grunt.registerTask('build',
        ['eslint', 'webpack:build', 'copy:dist', 'stylus:compile']);

    // Build demos
    grunt.registerTask('dev-demos', ['build-demos', 'watch:templates']);
    grunt.registerTask('build-demos', ['copy:templates', 'copy:assets',
        'string-replace:demos', 'copy:starter', 'clean']);

    // Build tests
    grunt.registerTask('build-test',
        ['eslint', 'webpack:test', 'copy:dist', 'stylus:compile']);

    // Transpile with Babel
    grunt.registerTask('dev-modules', ['babel', 'copy:dist']);

    // Tests with coverage
    grunt.registerTask('test', ['build-test', 'connect', 'qunit:all']);

    // Publish to gh-pages
    grunt.registerTask('publish', 'Publish from CLI', [
        'build', 'build-demos', 'esdoc', 'gh-pages:publish-lib',
        'gh-pages:publish-readme', 'gh-pages:publish-docs'
    ]);

    // Deploy to gh-pages
    grunt.registerTask('deploy', 'Publish from Travis', [
        'build', 'esdoc', 'check-deploy'
    ]);

    // Custom task running QUnit tests for specified files.
    // Usage example: grunt test-only:test.html,test-help.html
    grunt.registerTask('test-only',
        'A task that runs only specified tests.',
        function (tests) {
            if (!tests) {
                return;
            }
            tests = tests.split(',');
            var res = [];

            tests.forEach(function (itm) {
                var filePath = path.resolve(testDir, itm);
                var parts = filePath.split(path.sep);
                res.push(buildTestUrl(testHost, testDir, parts));
            });

            grunt.task.run('connect');
            grunt.config('qunit.only.options.urls', res);
            grunt.task.run('qunit:only');
        }
    );

    function isTestFile(pth) {
        var allowedExts = ['.html', '.htm'];
        for (var i = 0, len = allowedExts.length; i < len; i++) {
            var ext = allowedExts[i];
            if (pth.indexOf(ext) !== -1) {
                return true;
            }
        }
        return false;
    }

    function buildTestUrl(host, testDir, parts) {
        var idx = parts.indexOf(testDir);
        var fileIdx = parts.length;
        var relParts = parts.slice(idx, fileIdx);
        return host.concat(relParts.join('/'));
    }

    // Returns the list of test files from the test folder for qunit task
    function getTestFiles(testDir, host) {
        var getFiles = function (dir, host) {
            var res = [];
            var items = fs.readdirSync(dir);

            items.forEach(function (itm) {
                var fileOrDir = path.resolve(dir, itm);
                if (isTestFile(fileOrDir)) {
                    var parts = fileOrDir.split(path.sep);
                    res.push(buildTestUrl(host, testDir, parts));
                } else {
                    if (fs.lstatSync(fileOrDir).isDirectory()) {
                        res = res.concat(getFiles(fileOrDir, host));
                    }
                }
            });

            return res;
        };

        return getFiles(testDir, host);
    }

    grunt.registerTask('check-deploy', function () {
        var env = process.env;
        // need this
        this.requires(['build', 'esdoc']);

        // only deploy under these conditions
        if (env.TRAVIS === 'true' &&
            env.TRAVIS_SECURE_ENV_VARS === 'true' &&
            env.TRAVIS_PULL_REQUEST === 'false') {
            grunt.log.writeln('executing deployment');
            // queue deploy
            grunt.task.run([
                'gh-pages:deploy-lib',
                'gh-pages:deploy-readme',
                'gh-pages:deploy-docs'
            ]);
        } else {
            grunt.log.writeln('skipped deployment');
        }
    });

    // Get a formatted commit message to review changes from the commit log
    // github will turn some of these into clickable links
    function getDeployMessage() {
        var ret = '\n\n';
        var env = process.env;
        if (env.TRAVIS !== 'true') {
            ret += 'missing env vars for travis-ci';
            return ret;
        }
        ret += 'branch:       ' + env.TRAVIS_BRANCH + '\n';
        ret += 'SHA:          ' + env.TRAVIS_COMMIT + '\n';
        ret += 'range SHA:    ' + env.TRAVIS_COMMIT_RANGE + '\n';
        ret += 'build id:     ' + env.TRAVIS_BUILD_ID + '\n';
        ret += 'build number: ' + env.TRAVIS_BUILD_NUMBER + '\n';
        return ret;
    }

};
