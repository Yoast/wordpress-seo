const { src, dest, parallel, watch } = require( "gulp" );
const gulp = require( "gulp" );
const postcss = require( "gulp-postcss" );
const autoprefixer = require( "autoprefixer" );
const rename = require( "gulp-rename" );
const sourcemaps = require( "gulp-sourcemaps" );
const importCSS = require( "postcss-import" );
const rtlcss = require( "gulp-rtlcss" );
const tailwind = require( "tailwindcss" );
const fs = require( "fs" );
const exec = require('child_process').exec
const del = require( "del" );

const cssFolder = "css/src/";
const cssDest = "csstest/";
const cssDestLive = "css/dist/";
const tailwindConfig = "tailwind.config.js";

const files = fs.readdirSync( "css/src" );
const json = JSON.parse( fs.readFileSync( "package.json" ) );

var css = [];

/**
 * Css task.
 * */
files.forEach( function( task ) {
	gulp.task( task, function() {
		return src( cssFolder + task )
			.pipe( sourcemaps.init() )
			.pipe( postcss() )
			.pipe( rename( {
				suffix: "-" + json.yoast.pluginVersion,
			} ) )
			.pipe( sourcemaps.write( "." ) )
			.pipe( dest( cssDest ) );
	} );

	css.push( task );

	gulp.task( task + "-rtl", function() {
		return src( cssFolder + task )
			.pipe( sourcemaps.init() )
			.pipe( postcss() )
			.pipe( rename( {
				suffix: "-" + json.yoast.pluginVersion + "-rtl",
			} ) )
			.pipe( rtlcss() )
			.pipe( sourcemaps.write( "." ) )
			.pipe( dest( cssDest ) );
	} );

	css.push( task + "-rtl" );
} );

/**
 * Setup the watcher.
 */
gulp.task( "watch", function() {
	files.forEach( function( task ) {
		gulp.watch( cssFolder + task, gulp.parallel( task ) );
		gulp.watch( cssFolder + task, gulp.parallel( task + "-rtl" ) );
	} );
} );

gulp.task( "clean", function() {
	return del(
		[ "js/dist", cssDestLive + "monorepo*.css" ]
	);
} );

gulp.task('shell-webpack', function (cb) {
	exec('cross-env NODE_ENV=development yarn run wp-scripts build --config config/webpack/webpack.config.js', function (err, stdout, stderr) {
	  console.log(stdout);
	  console.log(stderr);
	  cb(err);
	});
  })

gulp.task( "default", gulp.parallel( css ) );
