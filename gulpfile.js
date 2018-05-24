'use strict';
//константы и плагины
const gulp = require('gulp'),
      rimraf = require('rimraf'),
      scss = require('gulp-sass'),
      sourcemaps = require('gulp-sourcemaps'),
      browserSync = require('browser-sync'),
      reload = browserSync.reload,
      prefixer = require('gulp-autoprefixer');

//конфигурация путей в вашем проекте
var path = {
    build:{
        all:"build/",
        scss:"build/css/",
        html:"build/"
    },
    src:{
        html:"src/*.html",
        scss:"src/scss/**/*.*"
    },
    clean:"build/",
    watch:{
         html:"src/*.html",
         scss:"src/scss/**/*.*"
    }
},
config ={
        server:{
            baseDir:"./build"
        },
        tunnel:true,
        host:'localhost',
        port:7787,
        logPrefix:"WebDev"
}

//описание задач

//удалить все из папки 
gulp.task('clean',function(done){
    rimraf(path.clean,done);
});

//переместить html
gulp.task('mv:html',function(done){
    gulp.src(path.src.html)
        .pipe(gulp.dest(path.build.html))
        .pipe(reload({stream:true}));
    done();
});

gulp.task('build:scss',function(done){
    gulp.src(path.src.scss)
        .pipe(sourcemaps.init())
        .pipe(scss({
            outputStyle:"compressed",
            sourcemaps:false
        }))
        .pipe(prefixer({
            cascade:false,
            browsers:['last 5 versions'],
            remove:true
        }))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(path.build.scss))
        .pipe(reload({stream:true}));
    done();
});

gulp.task('webserver',function(done){
        browserSync(config);
    done();
});

//watcher
gulp.task('watch',function(done){
    gulp.watch(path.watch.html,gulp.series('mv:html'));
    gulp.watch(path.watch.scss,gulp.series('build:scss'));
    done();
})

//задача по умолчанию
gulp.task('default',gulp.series('clean',gulp.parallel('mv:html','build:scss'),'webserver','watch'));
