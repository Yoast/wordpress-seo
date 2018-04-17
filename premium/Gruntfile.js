/* global require, process */
const { flattenVersionForFile } = require( "./grunt/modules/version.js" );

module.exports = function(grunt) {

	require('time-grunt')(grunt);

	const pkg = grunt.file.readJSON( "package.json" );
	const pluginVersion = pkg.yoast.pluginVersion;

	// Define project configuration
	var project = {
		pluginVersion: pluginVersion,
		paths: {
			get config() {
				return this.grunt + 'config/';
			},
			grunt: 'grunt/',
			js: 'assets/js/',
			css: 'assets/css/dist/',
			languages: 'languages/',
			logs: 'logs/'
		},
		files: {
			main: '../wp-seo-premium.php',
			js: [
				'assets/js/src/**/*.js'
			],
			css: [
				'assets/css/dist/*.css',
				'!assets/css/dist/*.min.css'
			],
			php: [
				'*.php',
				'../wp-seo-premium.php',
				'classes/**/*.php'
			],
			phptests: '../tests/premium/**/*.php',
			get config() {
				return project.paths.config + '*.js';
			},
			get changelog() {
				return project.paths.theme + 'changelog.txt';
			},
			grunt: 'Gruntfile.js'
		},
		pkg: grunt.file.readJSON( 'package.json' )
	};

	project.pluginVersionSlug = flattenVersionForFile( pluginVersion );

	// Load Grunt configurations and tasks
	require( 'load-grunt-config' )(grunt, {
		configPath: require( 'path' ).join( process.cwd(), project.paths.config ),
		data: project,
		jitGrunt: {
			staticMappings: {
				addtextdomain: 'grunt-wp-i18n',
				makepot: 'grunt-wp-i18n',
				glotpress_download: 'grunt-glotpress',
				wpcss: 'grunt-wp-css'
			},
			customTasksDir: 'grunt/custom'
		}
	});
};
