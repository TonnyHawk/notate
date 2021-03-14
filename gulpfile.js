let {gulp, src, dest, parallel, series, watch} = require('gulp'),
   sass = require('gulp-sass'),
   browserSync = require('browser-sync').create(),
   autoprefixer = require('gulp-autoprefixer'),
   gcmq = require('gulp-group-css-media-queries'),
   rename       = require('gulp-rename'),
   cleanCSS = require('gulp-clean-css');

let projFold = './src';
let distFold = './public';

function startBrowser(){
   browserSync.init({
      server: {
          baseDir: distFold
      },
      notify: false
   });
}

function css(){
   return src(projFold + '/styles/main.scss')
         .pipe(sass())
         .pipe(gcmq())
         .pipe(autoprefixer())
         .pipe(cleanCSS())
         .pipe(rename("app-style.min.css"))
         .pipe(dest(distFold + '/css/'))
         .pipe(browserSync.stream())
}

function watcher(){
   watch(projFold+'/styles/**/*.scss', css)
   watch(distFold+'/index.html').on('change', browserSync.reload)
}

let develop = parallel(series(css, watcher), startBrowser)
let build = series(css)
let wStyles = series(watcher)

exports.default = develop;
exports.build = build;
exports.watch = wStyles;