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
			css: 'css/',
			grunt: 'grunt/',
			images: 'images/',
			js: 'js/src/',
			languages: 'languages/',
			logs: 'logs/'
		},
		files: {
			sass: [ 'css/src/*.scss' ],
			css: [
				'css/*.css',
				'!css/*.min.css'
			],
			js: [
				'js/src/*.js'
			],
			php: [
				'*.php',
				'admin/**/*.php',
				'frontend/**/*.php',
				'inc/**/*.php'
			],
			phptests: 'tests/**/*.php',
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
