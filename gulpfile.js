const { src, dest, parallel, watch, series } = require( "gulp" );
const gulp = require( "gulp" );
const postcss = require( "gulp-postcss" );
const rename = require( "gulp-rename" );
const sourcemaps = require( "gulp-sourcemaps" );
const rtlcss = require( "gulp-rtlcss" );
const fs = require( "fs" );
const exec = require( "child_process" ).exec;
const spawn = require('cross-spawn');
const del = require( "del" );
const paths = require( "./config/webpack/paths" );


const cssFolder = "css/src/";
const cssDestLive = "css/dist/";
const vendorPrefixed = "vendor_prefixed/";

const files = fs.readdirSync( "css/src" );
const json = JSON.parse( fs.readFileSync( "package.json" ) );

const pluginVersion = paths.flattenVersionForFile( json.yoast.pluginVersion );

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
				suffix: "-" + pluginVersion,
			} ) )
			.pipe( sourcemaps.write( "." ) )
			.pipe( dest( cssDestLive ) );
	} );

	css.push( task );

	gulp.task( task + "-rtl", function() {
		return src( cssFolder + task )
			.pipe( sourcemaps.init() )
			.pipe( postcss() )
			.pipe( rename( {
				suffix: "-" + pluginVersion + "-rtl",
			} ) )
			.pipe( rtlcss() )
			.pipe( sourcemaps.write( "." ) )
			.pipe( dest( cssDestLive ) );
	} );

	css.push( task + "-rtl" );
} );

/**
 * Clean up the old css files.
 */
gulp.task( "clean:css", function() {
	return del(
		[ cssDestLive + "*.css*", "!" + cssDestLive + "monorepo*.css" ]
	);
} );

/**
 * Clean up the old js files.
 */
gulp.task( "clean:js", function() {
	return del(
		[ "js/dist", cssDestLive + "monorepo*.css" ]
	);
} );

/**
 * Clean up the old css files.
 */
gulp.task( "clean:vendor-prefixed", function() {
	return del(
		[ vendorPrefixed + "**", '!' + vendorPrefixed, "!" + vendorPrefixed + "*.gitignore" ]
	);
} );

/**
 * Run `composer install`.
 */
gulp.task( "shell:composer-install", function( cb ) {
	spawn( 'composer', [ 'install' ], { stdio: 'inherit' })
		.on('error', cb)
		.on('close', code => code ? cb(new Error(code)) : cb());
} );

/**
 * Build the js files through webpack.
 */
gulp.task( "shell:webpack", function( cb ) {
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

gulp.task( "build:js", gulp.series( "clean:js", "shell:webpack" ) );
gulp.task( "build:css", gulp.series( "clean:css", gulp.parallel( css ) ) );
gulp.task( "default", gulp.parallel( "build:js", "build:css" ) );
