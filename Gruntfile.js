/* global require, process */
var timeGrunt = require( "time-grunt" );
var path = require( "path" );
var loadGruntConfig = require( "load-grunt-config" );

module.exports = function( grunt ) {
	"use strict";

	timeGrunt( grunt );

	let pluginVersion = "5.6";

	// Define project configuration
	var project = {
		pluginVersion: pluginVersion,
		pluginSlug: "wordpress-seo",
		pluginMainFile: "wp-seo.php",
		paths: {
			get config() {
				return this.grunt + "config/";
			},
			css: "css/dist/",
			sass: "css/src/",
			grunt: "grunt/",
			images: "images/",
			js: "js/src/",
			languages: "languages/",
			logs: "logs/",
		},
		files: {
			sass: [ "<%= paths.sass %>*.scss" ],
			css: [
				"css/dist/*.css",
				"!css/dist/*.min.css",
			],
			js: [
				"js/src/**/*.js",
			],
			php: [
				"*.php",
				"admin/**/*.php",
				"frontend/**/*.php",
				"inc/**/*.php",
			],
			pot: {
				yoastseojs: "<%= paths.languages %>yoast-seo-js.pot",
				yoastComponents: "<%= paths.languages %>yoast-components.pot",

				php: {
					yoastseojs: "<%= paths.languages %>yoast-seo-js.php",
					yoastComponents: "<%= paths.languages %>yoast-components.php",
				},
			},
			phptests: "tests/**/*.php",
			get config() {
				return project.paths.config + "*.js";
			},
			get changelog() {
				return project.paths.theme + "changelog.txt";
			},
			grunt: "Gruntfile.js",
		},
		pkg: grunt.file.readJSON( "package.json" ),
	};

	let versionParts = pluginVersion.split( "." );
	if ( versionParts.length === 2 ) {
		versionParts.push( 0 );
	}
	project.pluginVersionSlug = versionParts.join( "" );

	// Load Grunt configurations and tasks
	loadGruntConfig( grunt, {
		configPath: path.join( process.cwd(), project.paths.config ),
		data: project,
		jitGrunt: {
			staticMappings: {
				addtextdomain: "grunt-wp-i18n",
				makepot: "grunt-wp-i18n",
				glotpress_download: "grunt-glotpress",
				wpcss: "grunt-wp-css",
			},
			customTasksDir: "grunt/custom",
		},
	} );
};
