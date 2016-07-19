/* global require, process */
module.exports = function(grunt) {
	'use strict';

	require('time-grunt')(grunt);

	// Define project configuration
	var project = {
		paths: {
			get config() {
				return this.grunt + 'config/';
			},
			grunt: 'grunt/',
			js: 'assets/js/',
			css: 'assets/css/',
			languages: 'languages/',
			logs: 'logs/'
		},
		files: {
			main: '../wp-seo-premium.php',
			js: [
				'assets/js/**/*.js',
				'!assets/js/**/*.min.js',
				'!assets/js/yoast-premium-social-preview-340.js'
			],
			css: [
				'assets/css/*.css',
				'!assets/css/*.min.css'
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
