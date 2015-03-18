gulp = require 'gulp'
coffee = require 'gulp-coffee'
path = './src/*.coffee'

gulp.task 'coffee', (done) ->
  gulp.src(path)
    .pipe coffee bare: true 
    .pipe gulp.dest './dest'

gulp.task 'default', ['coffee']