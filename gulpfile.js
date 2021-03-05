let {gulp, src, dest, parallel, series, watch} = require('gulp'),
   sass = require('gulp-sass'),
   browserSync = require('browser-sync').create();

let projFold = './src';
let distFold = './public'

function startBrowser(){
   browserSync.init({
      server: {
          baseDir: distFold
      }
   });
}

function css(){
   return src(projFold + '/styles/main.scss')
         .pipe(sass())
         .pipe(dest(distFold + '/css/'))
         .pipe(browserSync.stream())
}

function watcher(){
   watch(projFold+'/styles/**/*.scss', css)
}

let build = parallel(series(css, watcher), startBrowser)

exports.default = build;