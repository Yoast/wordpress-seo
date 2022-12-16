const { src, dest } = require( "gulp" );
const gulp = require( "gulp" );
const postcss = require( "gulp-postcss" );
const rename = require( "gulp-rename" );
const zip = require( "gulp-zip" );
const sourcemaps = require( "gulp-sourcemaps" );
const rtlcss = require( "gulp-rtlcss" );
const fs = require( "fs" );
const imagemin = require( "gulp-imagemin" );
const spawn = require( "cross-spawn" );
const del = require( "del" );
const paths = require( "./config/webpack/paths" );


const pluginSlug = "wordpress-seo";
const cssFolder = "css/src/";
const cssDestLive = "css/dist/";
const vendorPrefixed = "vendor_prefixed/";

const artifactFiles = [
	"admin/**",
	"css/dist/**/*.css",
	"css/main-sitemap.xsl",
	"deprecated/**",
	"frontend/**",
	"images/**",
	"packages/js/images/**",
	"inc/**",
	"js/**/*.js",
	"languages/**",
	"src/**",
	"lib/**",
	"vendor/**",
	"vendor_prefixed/**/*.php",
	"vendor_prefixed/wordproof/wordpress-sdk/build/**/*.js",
	"index.php",
	"license.txt",
	"readme.txt",
	"wp-seo.php",
	"wp-seo-main.php",
	"wpml-config.xml",
	"!vendor/bin/**",
	"!vendor/composer/installed.json",
	"!vendor/composer/installers/**",
	"!vendor/yoast/i18n-module/LICENSE",
	"!vendor/yoast/license-manager/samples/**",
	"!vendor/yoast/license-manager/class-theme-*",
	"!**/composer.json",
	"!**/README.md",
];
const artifactFolder = "artifact/";
const artifactCompressed = "artifact.zip";
const artifactCompressedDest = "./";

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
gulp.task( "clean:build-assets-css", function() {
	return del(
		[ cssDestLive + "*.css*", "!" + cssDestLive + "monorepo*.css" ]
	);
} );

/**
 * Clean up the old js files.
 */
gulp.task( "clean:build-assets-js", function() {
	return del(
		[ "js/dist", cssDestLive + "monorepo*.css" ]
	);
} );

gulp.task( "clean:build-assets", gulp.parallel( "clean:build-assets-js", "clean:build-assets-css" ) );

/**
 * Clean up the old css files.
 */
gulp.task( "clean:vendor-prefixed", function() {
	return del(
		[ vendorPrefixed + "**", "!" + vendorPrefixed, "!" + vendorPrefixed + "*.gitignore" ]
	);
} );

/**
 * Run `composer install`.
 */
gulp.task( "shell:composer-install", function( cb ) {
	spawn( "composer", [ "install" ], { stdio: "inherit" } )
		.on( "error", cb )
		.on( "close", code => code ? cb( new Error( code ) ) : cb() );
} );

/**
 * Run `composer compile-di`.
 */
gulp.task( "shell:compile-dependency-injection-container", function( cb ) {
	spawn( "composer", [ "compile-di" ], { stdio: "inherit" } )
		.on( "error", cb )
		.on( "close", code => code ? cb( new Error( code ) ) : cb() );
} );

/**
 * Run `rm ./src/generated/container.php.meta`.
 */
gulp.task( "remove-dependency-injection-meta", function() {
	return del( [ "./src/generated/container.php.meta" ] );
} );

/**
 * Run `composer install --prefer-dist --optimize-autoloader --no-dev --no-scripts`.
 */
gulp.task( "shell:composer-install-production", function( cb ) {
	spawn( "composer", [ "install", "--prefer-dist", "--optimize-autoloader", "--no-dev", "--no-scripts" ], { stdio: "inherit" } )
		.on( "error", cb )
		.on( "close", code => code ? cb( new Error( code ) ) : cb() );
} );

/**
 * Build the js files through webpack.
 */
gulp.task( "shell:webpack", function( cb ) {
	spawn.sync( "yarn", [ "cross-env", "NODE_ENV=development" ], { stdio: "inherit" } );
	spawn( "yarn", [ "run", "wp-scripts", "build", "--config", "config/webpack/webpack.config.js" ], { stdio: "inherit" } )
		.on( "error", cb )
		.on( "close", code => code ? cb( new Error( code ) ) : cb() );
} );

/**
 * Build the production js files through webpack.
 */
gulp.task( "shell:webpack-prod", function( cb ) {
	spawn( "yarn", [ "run", "wp-scripts", "build", "--config", "config/webpack/webpack.config.js" ], { stdio: "inherit" } )
		.on( "error", cb )
		.on( "close", code => code ? cb( new Error( code ) ) : cb() );
} );

/**
 * Build the schema blocks package.
 */
gulp.task( "shell:install-schema-blocks", function( cb ) {
	spawn.sync( "yarn", [ "install" ], { cwd: "packages/schema-blocks", stdio: "inherit" } );
	spawn( "yarn", [ "build" ], { cwd: "packages/schema-blocks", stdio: "inherit" } )
		.on( "error", cb )
		.on( "close", code => code ? cb( new Error( code ) ) : cb() );
} );

/**
 * Build the schema blocks package.
 */
gulp.task( "shell:build-ui-library", function( cb ) {
	spawn( "yarn", [ "build" ], { cwd: "packages/ui-library", stdio: "inherit" } )
		.on( "error", cb )
		.on( "close", code => code ? cb( new Error( code ) ) : cb() );
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

/**
 * Imagemin configuration and tasks.
 */

const svgoOptions = {
	plugins: [
		{ removeTitle: true },
		{ removeDesc: true },
		{ removeUnknownsAndDefaults:
			{
				keepRoleAttr: true,
				keepAriaAttrs: true,
			},
		},
		{ addAttributesToSVGElement:
			{
				attributes: [
					{ role: "img" },
					{ "aria-hidden": "true" },
					{ focusable: "false" },
				],
			},
		},
	],
};

gulp.task( "imagemin:images", function() {
	return gulp.src( "images/*" )
		.pipe( imagemin(
			[
				imagemin.gifsicle(),
				imagemin.mozjpeg(),
				imagemin.optipng(),
				imagemin.svgo( svgoOptions ),
			]
		) )
		.pipe( gulp.dest( "images" ) );
} );

gulp.task( "imagemin:assets", function() {
	return gulp.src( "svn-assets/*" )
		.pipe( imagemin(
			[
				imagemin.gifsicle(),
				imagemin.mozjpeg(),
				imagemin.optipng(),
				imagemin.svgo( svgoOptions ),
			]
		) )
		.pipe( gulp.dest( "svn-assets" ) );
} );

gulp.task( "build:images", gulp.parallel( "imagemin:images", "imagemin:assets" ) );


/**
 * Clean artifact preparation folder and compressed artifact.
 */
gulp.task( "clean:artifact", function() {
	return del(
		[
			artifactFolder + "**",
			artifactFolder,
			artifactCompressedDest + artifactCompressed,
		]
	);
} );

/**
 * Copy all files that need to be included in artifact.
 */
gulp.task( "copy:artifact", function() {
	del(
		[ artifactFolder + "**", artifactFolder ]
	);
	return gulp.src( artifactFiles, { base: "." } )
		.pipe( gulp.dest( artifactFolder ) );
} );

/**
 * Compress all files included in artifact folder.
 */
gulp.task( "compress:artifact", function() {
	del(
		[ artifactCompressedDest + artifactCompressed ]
	);
	return gulp.src( artifactFolder + "**" )
		.pipe( rename( function( path ) {
			path.dirname = pluginSlug + "/" + path.dirname;
		} ) )
		.pipe( zip( artifactCompressed ) )
		.pipe( gulp.dest( artifactCompressedDest ) );
} );

/**
 * Set the environment as "production".
 */
gulp.task( "set-env-prod", function( done ) {
	process.env.NODE_ENV = "production";
	done();
} );

/**
 * Set the environment as "development".
 */
gulp.task( "set-env-dev", function( done ) {
	process.env.NODE_ENV = "development";
	done();
} );

gulp.task( "postcss-process", gulp.parallel( css ) );

gulp.task( "build:js", gulp.series( "clean:build-assets-js", "shell:webpack" ) );
gulp.task( "build:css", gulp.series( "clean:build-assets-css", "set-env-dev", "postcss-process" ) );
gulp.task( "default", gulp.parallel( "build:js", "build:css" ) );
gulp.task( "build:ts", gulp.parallel( "shell:install-schema-blocks" ) );
gulp.task( "build:packages", gulp.parallel( "shell:build-ui-library" ) );

gulp.task( "build:dev", gulp.parallel( "build:ts", "build:packages", "build:js", "build:css" ) );
gulp.task( "build", gulp.parallel( "build:dev", "build:images" ) );
gulp.task( "build-watch", gulp.series( "clean:vendor-prefixed", "shell:composer-install", "build:js", "build:css", "watch" ) );

gulp.task( "release:ts", gulp.parallel( "shell:install-schema-blocks" ) );
gulp.task( "release:packages", gulp.parallel( "shell:build-ui-library" ) );
gulp.task( "release:js", gulp.parallel( "shell:webpack-prod" ) );
gulp.task( "release:css", gulp.series( "clean:build-assets-css", "set-env-prod", "postcss-process" ) );

gulp.task( "release",  gulp.series(
	"clean:build-assets",
	gulp.parallel(
		"build:images",
		"release:ts",
		"release:packages"
	),
	gulp.parallel(
		"release:js",
		"release:css"
	)
) );

gulp.task( "artifact", gulp.series(
	"clean:vendor-prefixed",
	"shell:composer-install",
	"shell:compile-dependency-injection-container",
	"remove-dependency-injection-meta",
	"shell:composer-install-production",
	"release",
	"clean:artifact",
	"copy:artifact",
	"compress:artifact"
) );
