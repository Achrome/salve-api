import gulp from 'gulp';
import loadPlugins from 'gulp-load-plugins';
import {spawn} from 'child_process';
import sourcemapsReporter from 'jshint-sourcemap-reporter';

const $ = loadPlugins();

gulp.task('dev:server', () => {
  $.nodemon({
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
  gulp.src(['app/**/*.js', 'test/**/*.js'])
        .pipe($.plumber())
        .pipe($.eslint())
        .pipe($.eslint.format())
        .pipe($.eslint.failOnError());
});

gulp.task('dev:test', () => {
  gulp.src('./test/**/*.js')
        .pipe($.plumber())
        .pipe($.mocha({
          reporter: 'list',
          require: ['co-mocha'],
          timeout: 15000
        }));
});

gulp.task('dev:flow:babel', (cb) => {
  gulp.src('app/**/*.js')
        .pipe($.sourcemaps.init())
        .pipe($.babel({ blacklist: ['flow'] }))
        .on('error', $.notify.onError('<%= error.message %>'))
        .pipe($.sourcemaps.write('.'))
        .pipe(gulp.dest('tmp_flow/'))
        .on('end', cb);
});

gulp.task('dev:flow', ['dev:flow:babel'], () => {
  gulp.src('tmp_flow/**/*.js')
        .pipe($.flowtype({
          all: false,
          weak: false,
          killFlow: false,
          beep: true,
          abort: false,
          reporter: {
            reporter: (errors) => {
              return sourcemapsReporter.reporter(errors, { sourceRoot: '/app/'});
            }
          }
        }));
});

gulp.task('dev:watch', () => {
  gulp.watch(['./app/**/*.js', './test/**/*.js'], ['dev:test', 'js:lint']);
});

gulp.task('default', ['dev:server', 'dev:watch']);
