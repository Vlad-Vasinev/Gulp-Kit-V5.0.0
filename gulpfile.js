//constants
import {src, dest, series, watch} from 'gulp'
import * as dartSass from 'sass'

import gulpSASS from 'gulp-sass'
import cleanCSS from 'gulp-clean-css'
import concat from 'gulp-concat'
import autoPrefixer from 'gulp-autoprefixer'
import uglify from 'gulp-uglify'
import gulpImage from 'gulp-image'
import svgMin from 'gulp-svgmin'
import gulppug from 'gulp-pug'
import notify from 'gulp-notify'

import browserSync from 'browser-sync'
import {deleteAsync} from 'del'

const mainSass = gulpSASS(dartSass)

const srcFolder = './src'
const buildFolder = './app'

//path to ./src folder
const path = {
  imgSrc: `${srcFolder}/img`,
  sassSrc: [ `${srcFolder}/css/**/*.sass`, `${srcFolder}/css/**/*.scss` ],
  jsSrc: [`${srcFolder}/js/**/*.js`, `${srcFolder}/js/*.js`],
  pugSrc: [`${srcFolder}/pages/**/*.pug`, `${srcFolder}/pug/components/**/*.pug`],
  resources: `${srcFolder}/resources`,
  api: `${srcFolder}/resources/api`,

  imgBuild: `${buildFolder}/img`,
  cssBuild: `${buildFolder}/css`,
  jsBuild: `${buildFolder}/js`,
  htmlBuild: `${buildFolder}`
}

//clean app folder
const cleanBuild = () => {
  return deleteAsync([buildFolder])
}

//images
function images() {
  return src(`${path.imgSrc}/**/**.{png,PNG,JPG,jpg,jpeg,svg,webp,webm,mp4,ico}`, {encoding: false})
    .pipe(gulpImage())
    .pipe(dest(path.imgBuild))
    .pipe(browserSync.stream())
}

//styles
function styles () {
  return src(path.sassSrc)
    .pipe(mainSass())
    .pipe(autoPrefixer({
      cascade: false
    }))
    .pipe(concat('main.css'))
    .pipe(dest(path.cssBuild))
    .pipe(concat('main.min.css'))
    .pipe(cleanCSS())
    .pipe(dest(path.cssBuild))
    .pipe(browserSync.stream())
}

//scripts
function scripts () {
  return src(path.jsSrc)
    .pipe(concat('main.js'))
    .pipe(dest(path.jsBuild))
    .pipe(concat('main.min.js'))
    .pipe(uglify())
    .pipe(dest(path.jsBuild))
    .pipe(browserSync.stream())
}
 
//html
function htmlPug () {
  return src(path.pugSrc)
    .pipe(gulppug())
    .pipe(dest(path.htmlBuild))
    .pipe(browserSync.stream())
}

//watch changes
function watchAfter () {

  browserSync.init({
    server: {
      baseDir: buildFolder
    }
  })

  watch(`${srcFolder}/css/**/*.sass`, styles)
  watch(`${srcFolder}/js/**/*.js`, scripts)
  watch(`${srcFolder}/**/*.pug`, htmlPug)
  watch(`${srcFolder}/img/**/**.{png,PNG,JPG,jpg,jpeg,svg,webp,webm,mp4,ico}`, images)
}

export default series(
  cleanBuild,
  styles,
  htmlPug,
  scripts,
  images,
  watchAfter,
)



//Todo list

//*posible gulp plugins:*// 
// 1) gulp-imagemin
// 2) gulp-tinypng
// 3) add gulp-svgmin
// 4) add gulp-notify
// 5) add gulp-plumber
// 6) add node-w3c-validator
// 7) add babel