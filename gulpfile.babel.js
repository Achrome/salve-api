import gulp from 'gulp';
import loadPlugins from 'gulp-load-plugins';
import {spawn} from 'child_process';

const $ = loadPlugins();

gulp.task('dev:server', () => {
  return $.nodemon({
    script: 'bootstrap.js',
    watch: ['app/**/*.js', 'gulpfile.babel.js'],
    ignore: ['test/'],
    ext: 'js',
    stdout: false
  })
  .on('readable', function() {
    let bunyan = spawn('./node_modules/.bin/bunyan', ['-o', 'short'], {
      stdio: ['pipe', process.stdout, process.stderr]
    });
    this.stdout.pipe(bunyan.stdin);
    this.stderr.pipe(bunyan.stdin);
  });
});

gulp.task('js:lint', () => {
  return gulp.src('**/*.js')
          .pipe($.plumber())
          .pipe($.eslint())
          .pipe($.eslint.format())
          .pipe($.eslint.failOnError());
});

gulp.task('dev:test', () => {
  return gulp.src('./test/**/*.js')
          .pipe($.plumber())
          .pipe($.mocha({
            reporter: 'list',
            require: ['co-mocha'],
            timeout: 15000
          }));
});

gulp.task('dev:watch', () => {
  gulp.watch(['./app/**/*.js', './test/**/*.js'], ['dev:test']);
  gulp.watch(['./app/**/*.js', './test/**/*.js'], ['js:lint']);
});

gulp.task('default', ['dev:server', 'dev:watch']);
