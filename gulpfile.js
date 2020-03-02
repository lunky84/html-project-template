const gulp = require('gulp');
const imagemin = require('gulp-imagemin');
const uglify = require('gulp-uglify');
const sass = require('gulp-sass');
const concat = require('gulp-concat');
const babel = require('gulp-babel');
const nodemon = require('gulp-nodemon');
var browserSync = require('browser-sync').create();


gulp.task('start', function (done) {
    nodemon({
        script: 'server.js'
    , ext: 'js html'
    , env: { 'NODE_ENV': 'development' }
    , done: done
    })
})

gulp.task('sync', function() {
    browserSync.init({
      port: 3002, //this can be any port, it will show our app
      proxy: 'http://localhost:3001/', //this is the port where express server works
      ui: { port: 3003 }, //UI, can be any port
      reloadDelay: 1000 //Important, otherwise syncing will not work
    });
    
    gulp.watch('src/js/*.js', gulp.series('scripts'));
    gulp.watch('src/images/*', gulp.series('imageMin'));
    gulp.watch('src/sass/*.scss', gulp.series('sass'));
    gulp.watch('src/views/*.html', gulp.series('copyHtml'));
    gulp.watch(['dist/js/*.js', 'dist/*.html', 'dist/css/*.css']).on("change", browserSync.reload);
  });

// Copy all HTML files

gulp.task('copyHtml', () =>
    gulp.src('src/views/*.html')
    .pipe(gulp.dest('dist'))
);

// Otimise Images

gulp.task('imageMin', () =>
    gulp.src('src/images/*')
    .pipe(imagemin())
    .pipe(gulp.dest('dist/images'))
);

// Compile SASS

gulp.task('sass', () =>
    gulp.src('src/sass/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('dist/css'))
);

// Merge and Minify JS

gulp.task('scripts', () =>
    gulp.src('src/js/*.js')
    .pipe(babel({
        presets: ['@babel/env']
    }))
    .pipe(concat('main.js'))
    .pipe(uglify())
    .pipe(gulp.dest('dist/js'))
);

gulp.task('build',gulp.parallel(['copyHtml','imageMin', 'sass', 'scripts']));
gulp.task('default',gulp.parallel(['start', 'sync']));
