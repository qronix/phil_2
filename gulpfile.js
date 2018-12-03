const gulp = require('gulp');
const livereload = require('gulp-livereload');

const SCRIPTS_PATH = 'public/js/**/*.js';
const CSS_PATH     = 'public/css/*.css';

gulp.task('reloadScripts',()=>{
    console.log('Starting scripts task');
    return gulp.src(SCRIPTS_PATH)
    .pipe(livereload());
});

gulp.task('reloadStyles',()=>{
    console.log('Starting styles task');
    return gulp.src(CSS_PATH)
    .pipe(livereload());
})

gulp.task('watch',()=>{
    console.log('Started gulp watch task');
    require('./server/server.js');
    livereload.listen();
    gulp.watch(SCRIPTS_PATH,['reloadScripts']);
    gulp.watch(CSS_PATH,['reloadStyles']);
});