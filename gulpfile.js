const gulp = require('gulp');
const imagemin = require('gulp-imagemin');
const uglify = require('gulp-uglify');
const sass = require('gulp-sass');
const concat = require('gulp-concat');
const babel = require('gulp-babel');
const sourcemaps = require('gulp-sourcemaps');
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
    // gulp.watch('views/*.html', gulp.series('copyHtml'));
    gulp.watch(['views/**/*.html', 'build/js/*.js', 'build/css/*.css']).on("change", browserSync.reload);
  });

// Copy all HTML files

// gulp.task('copyHtml', () =>
//     gulp.src('src/views/*.html')
//     .pipe(gulp.dest('build'))
// );

// Otimise Images

gulp.task('imageMin', () =>
    gulp.src('src/images/*')
    .pipe(imagemin())
    .pipe(gulp.dest('build/images'))
);

// Compile SASS

gulp.task('sass', () =>
    gulp.src('src/sass/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('build/css'))
);

// Merge and Minify JS

gulp.task('scripts', () =>
    gulp.src(['bower_components/jquery/dist/jquery.js', 'src/js/*.js'])
    .pipe(babel({
        presets: ['@babel/env']
    }))
    .pipe(concat('main.js'))
    .pipe(uglify())
    .pipe(gulp.dest('build/js'))
);

gulp.task('build',gulp.parallel(['imageMin', 'sass', 'scripts']));
gulp.task('default',gulp.parallel(['start', 'sync']));
