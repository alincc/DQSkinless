var gulp = require('gulp');
var gulpTsConfig = require('gulp-ts-config');
var argv = require('yargs').default('name', 'local').argv;
 
gulp.task('env', function () {
  gulp.src('endpoint.json')
  .pipe(gulpTsConfig('Endpoint',{ environment :  argv.name}))
  .pipe(gulp.dest('src/config/'))
});