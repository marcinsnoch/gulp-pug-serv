'use strict';

const {src, dest, task, watch, series, parallel} = require("gulp");

const autoprefixer = require("gulp-autoprefixer");
const sync = require("browser-sync").create();
const concat = require("gulp-concat");
const imagemin = require("gulp-imagemin");
const minify = require("gulp-minify");
const newer = require("gulp-newer");
const plumber = require("gulp-plumber");
const pug = require("gulp-pug");
const rename = require("gulp-rename");
const sass = require("gulp-sass");
const sourcemaps = require('gulp-sourcemaps');

// BrowserSync
function browserSync(done) {
    sync.init({
        server: {
            baseDir: "./dist"
        }
    });
    done();
}

// BrowserSync Reload
function syncReload(done) {
    sync.reload();
    done();
}

// CSS task
function sassToCss() {
    return src("./src/sass/*.*")
        .pipe(sourcemaps.init())
        .pipe(plumber())
        .pipe(
            sass({outputStyle: 'compressed'}).on('error', sass.logError)
        )
        .pipe(autoprefixer())
        .pipe(rename({
            suffix: ".min"
        }))
        .pipe(sourcemaps.write('./'))
        .pipe(dest("./dist/css/"))
        .pipe(sync.stream());
}

// JS Scripts
function concatJs() {
    return src("./src/js/**/*")
        .pipe(concat("application.js"))
        .pipe(dest("./dist/js/"))
        .pipe(sync.stream());
}

function compressJs() {
    return src("./dist/js/application.js")
        .pipe(
            minify({
                ext: {
                    min: ".min.js"
                },
                ignoreFiles: ["*min.js"]
            })
        )
        .pipe(dest("./dist/js/"))
        .pipe(sync.stream());
}

// Optimize Images
function images() {
    return src("./src/img/**/*")
        .pipe(newer("./dist/img"))
        .pipe(
            imagemin([
                imagemin.gifsicle({
                    interlaced: true
                }),
                imagemin.mozjpeg({
                    quality: 75,
                    progressive: true
                }),
                imagemin.optipng({
                    optimizationLevel: 5
                }),
                imagemin.svgo({
                    plugins: [
                        {
                            removeViewBox: false,
                            collapseGroups: true
                        }
                    ]
                })
            ])
        )
        .pipe(dest("./dist/img"));
}

// Compile pug files
function pugToHtml() {
    return src("./src/views/*.pug")
        .pipe(pug({"pretty": true}))
        .pipe(dest("./dist/"))
        .pipe(sync.stream());
}

function watchFiles() {
    watch("src/sass/**/*", sassToCss);
    watch("src/js/**/*", series(concatJs, compressJs));
    watch("src/img/**/*", images);
    watch("src/views/**/*", series(pugToHtml, syncReload));
}

task("browserSync", browserSync);
task("compressJs", compressJs);
task("concatJs", series(concatJs, compressJs));
task("css", sassToCss);
task("images", images);
task("pugToHtml", pugToHtml);

task("watch", parallel(watchFiles, browserSync));
task("default", parallel(sassToCss, images, concatJs, pugToHtml));

