const { src, dest, parallel, watch, series } = require( "gulp" );
const gulp = require( "gulp" );
const postcss = require( "gulp-postcss" );
const rename = require( "gulp-rename" );
const sourcemaps = require( "gulp-sourcemaps" );
const rtlcss = require( "gulp-rtlcss" );
const fs = require( "fs" );
const exec = require( "child_process" ).exec;
const del = require( "del" );

const cssFolder = "css/src/";
const cssDest = "csstest/";
const cssDestLive = "css/dist/";

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
 * Clean up the old js files.
 */
gulp.task( "clean", function() {
	return del(
		[ "js/dist", cssDestLive + "monorepo*.css" ]
	);
} );

/**
 * Build the js files through webpack.
 */
gulp.task( "shell-webpack", function( cb ) {
	exec( "yarn cross-env NODE_ENV=development", function( err, stdout, stderr ) {
		console.log( stdout );
		console.log( stderr );
		cb( err );
	} );
	exec( "yarn run wp-scripts build --config config/webpack/webpack.config.js", function( err, stdout, stderr ) {
		console.log( stdout );
		console.log( stderr );
		cb( err );
	} );
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

gulp.task( "default", gulp.parallel( css ) );
gulp.task( "build:js", gulp.series( "clean", "shell-webpack" ) );
