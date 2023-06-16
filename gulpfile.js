//variables
import gulp from "gulp"
import {deleteAsync, deleteSync} from "del"
import pug from "gulp-pug"
import * as dartSass from "sass"
import gulpSass from "gulp-sass"
import autoprefixer from "gulp-autoprefixer"
import sourcemaps from "gulp-sourcemaps"
import plumber from "gulp-plumber"
import notify from "gulp-notify"
import uglify from 'gulp-uglify'
import concat from 'gulp-concat'
import rename from 'gulp-rename'

const sass = gulpSass(dartSass)

// compile pug to html
gulp.task('pug', function () {
    return gulp.src('./src/pug/pages/**/*.pug', {allowEmpty: true})
        .pipe(plumber({
            errorHandler: notify.onError(function (err) {
                return {
                    title: 'Html',
                    message: err.message
                }
            })
        }))
        .pipe(pug({pretty: true}))
        .pipe(gulp.dest('./dist/html/'))
})

// compile scss into css
gulp.task('scss', function () {
    return gulp.src('./src/scss/*.scss', {allowEmpty: true})
        .pipe(plumber({
            errorHandler: notify.onError(function (err) {
                return {
                    title: 'Style_scss',
                    message: err.message
                }
            })
        }))
        .pipe(sourcemaps.init())
        .pipe(sass())
        .pipe(autoprefixer({overrideBrowserslist: ['last 3 versions'], cascade: false}))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('./dist/css/'))
})

// copy work files in to build folder

gulp.task('js', function () {
    return gulp.src('./src/js/**/*.js')
        .pipe(sourcemaps.init())
        .pipe(concat('app.js'))
        .pipe(rename({suffix: '.min'}))
        .pipe(uglify())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('./dist/js'))
})

gulp.task('libs', function () {
    return gulp.src('./src/libs/**/*.*')
        .pipe(gulp.dest('./dist/libs'))
})

gulp.task('imgs', function () {
    return gulp.src('./src/img/**/*.*')
        .pipe(gulp.dest('./dist/img'))
})

gulp.task('build', gulp.series('imgs', 'libs', 'pug', 'js', 'scss'))
gulp.task('watch', gulp.series('build', function () {
    gulp.watch('./src/pug/**/*.pug', gulp.series('pug'))
    gulp.watch('./src/scss/**/*.scss', gulp.series('scss'))
    gulp.watch('./src/js/**/*.js', gulp.series('js'))
    gulp.watch('./src/libs/**/*', gulp.series('libs'))
    gulp.watch('./src/imgs/**/*', gulp.series('imgs'))
}))