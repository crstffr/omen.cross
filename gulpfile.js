// Use of Gulp Help requires passing Gulp to the
// gulp-help plugin.  This is also where we
// specify the global Gulp Help options.

var gulp = require('gulp-help')(require('gulp'), {
    hideEmpty: true,
    hideDepsMessage: true
});

var settings = require('./settings');
var sequence = require('run-sequence');

/***********************
 * PATHS
 ***********************/

var root = __dirname + '/';
var dist = root + 'dist/';
var core = root + 'public/';
var docs = root + 'gh-pages/';
var app  = core + 'app/';

var paths = {

    config: {
        npm: root + 'package.json',
        jspm: core + 'jspm_packages/',
        system: core + 'config.js',
        bundle: root + 'bundle.config.js'
    },

    core: {
        all: core + 'all.js',
        css: core + 'style/css/',
        sass: core + 'style/scss/',
        modules: app + 'modules/',
        bundles: app + 'bundles/',
        components: app + 'components/'
    }
};

/***********************
 * GLOBS
 ***********************/

var globs = {

    core: {
        js: [core + '**/!(*spec).js'],
        sass: {
            main: [

                // Files that are watched and then rebuilt into
                // core.min.css when they are modified.

                paths.core.sass + 'main.scss',
                paths.core.sass + 'components/*.scss',
                paths.core.sass + '_settings.scss'
            ],
            comp: [

                // Files that are watched and then rebuilt into
                // their own respective folders when modified.

                paths.core.components + '**/*.scss',
                paths.core.modules + '**/*.scss',
                paths.core.sass + '_settings.scss'
            ],
            vendor: [

                // Files that are watched and then rebuilt into
                // vendor.min.css when they are modified.

                paths.core.sass + 'vendor.scss',
                paths.core.sass + '_settings.scss',
                paths.core.sass + 'vendor/**/*.scss'
            ]
        }
    }
};


/***********************
 * MAIN TASKS
 ***********************/

gulp.task('default', ['help']);

gulp.task('clean', 'Remove all static build files', function (done) {
    sequence(
        'clean-css',
        'clean-bundles',
        'unbundle',
        done
    );
});

gulp.task('build', 'Build the application from source', function (done) {
    sequence(
        'build-main-css',
        'build-comp-css',
        'build-vendor-css',
        done
    );
});

gulp.task('dist', 'Prepare app for distribution', function(done) {
    sequence(
        'clean',
        'build',
        'bundle',
        done
    );
});

gulp.task('server', 'Start simple server, reload source files on change', function (done) {
    sequence(
        'build',
        'build:watch',
        'build:server',
        done
    );
});


/***********************
 * CLEAN
 ***********************/

gulp.task('clean-css', function () {
    var del = require('del');
    return del([
        core + '**/*.min.css',
        core + '**/*.min.css.map'
    ]);
});

gulp.task('clean-bundles', function () {
    var del = require('del');
    return del(paths.core.bundles + '**/*');
});

/***********************
 * BUILD CORE
 ***********************/

gulp.task('build-main-css', function () {

    var sass = require('gulp-sass');
    var rename = require('gulp-rename');
    var minifyCSS = require('gulp-clean-css');
    var sourcemaps = require('gulp-sourcemaps');
    var sassJspm = require('sass-jspm-importer');

    return gulp.src(paths.core.sass + 'main.scss')
        .pipe(sourcemaps.init())
        .pipe(sass({
            errLogToConsole: true,
            includePaths: [paths.core.sass],
            functions: sassJspm.resolve_function(paths.config.jspm),
            importer: sassJspm.importer
        }).on('error', sass.logError))
        .pipe(rename({suffix: '.min'}))
        .pipe(minifyCSS())
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest(paths.core.css));
});

gulp.task('build-comp-css', function () {

    var sass = require('gulp-sass');
    var rename = require('gulp-rename');
    var minifyCSS = require('gulp-clean-css');
    var sourcemaps = require('gulp-sourcemaps');
    var sassJspm = require('sass-jspm-importer');

    return gulp.src(globs.core.sass.comp, {base: './'})
        .pipe(sourcemaps.init())
        .pipe(sass({
            errLogToConsole: true,
            includePaths: [paths.core.sass],
            functions: sassJspm.resolve_function(paths.config.jspm),
            importer: sassJspm.importer
        }).on('error', sass.logError))
        .pipe(minifyCSS())
        .pipe(rename({suffix: '.min'}))
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest('./'));
});

gulp.task('build-vendor-css', function () {

    var sass = require('gulp-sass');
    var rename = require('gulp-rename');
    var minifyCSS = require('gulp-clean-css');
    var sourcemaps = require('gulp-sourcemaps');
    var sassJspm = require('sass-jspm-importer');

    return gulp.src(paths.core.sass + 'vendor.scss')
        .pipe(sourcemaps.init())
        .pipe(sass({
            errLogToConsole: true,
            includePaths: [paths.core.sass],
            functions: sassJspm.resolve_function(paths.config.jspm),
            importer: sassJspm.importer
        }).on('error', sass.logError))
        .pipe(rename({suffix: '.min'}))
        .pipe(minifyCSS())
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest(paths.core.css));
});


/***********************
 * BUNDLE
 ***********************/

gulp.task('bundle', 'Compile static bundles, takes optional -g argument', function () {
    var minimist = require('minimist');
    var options = minimist(process.argv.slice(2));
    var config = require(paths.config.bundle);
    var jspm = require('jspm');
    var Bundler = require('jspm-bundler');
    var bundler = new Bundler(config);
    return bundler.bundle(options.g).catch(function (e) {
        throw e;
    });
});

gulp.task('unbundle', 'Removes static bundles, takes optional -g argument', function () {
    var minimist = require('minimist');
    var options = minimist(process.argv.slice(2));
    var config = require(paths.config.bundle);
    var Bundler = require('jspm-bundler');
    var bundler = new Bundler(config);
    return bundler.unbundle(options.g).catch(function (e) {
        throw e;
    });
});

/***********************
 * BROWSER SYNC
 ***********************/

gulp.task('build:watch', function () {

    // Watch Core SASS files for changes, rebuild as needed

    gulp.watch(globs.core.sass.main, ['build-main-css']);
    gulp.watch(globs.core.sass.comp, ['build-comp-css']);
    gulp.watch(globs.core.sass.vendor, ['build-vendor-css']);
    
});

gulp.task('build:server', function (done) {

    var ip = require('ip');
    var opn = require('opn');

    // Starts a BrowserSync server that watches both
    // Core and Docs and reloads on changes.

    var port = 8100;
    var browserSync = require('browser-sync');

    browserSync.create().init({
        port: port,
        open: false,
        ui: { port: port + 1 },
        server: core,
        notify: false,
        logLevel: 'info',
        ghostMode: false,
        timestamps: false,
        logFileChanges: false,
        files: [
            core + '**/*.html',
            core + '**/*.css',
            core + '**/!(*spec).js'
        ]
    });

    opn('http://' + settings.server.ip + ':' + port);
    done();
});

