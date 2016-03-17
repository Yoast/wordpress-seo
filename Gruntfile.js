var path = require( "path" );
var loadGruntConfig = require( "load-grunt-config" );

module.exports = function( grunt ) {
	"use strict";

	// require('time-grunt')(grunt);

	// Define project configuration
	var project = {
		paths: {
			grunt: "grunt/",
			js: "js/",
			css: "css/",
			get config() {
				return this.grunt + "config/";
			}
		},
		files: {
			js: [
				"js/**/*.js",
				"grunt/config/*.js",
				"!js/config/*.js",
				"<%= files.grunt %>"
			],
			jsDontLint: [
				"!js/templates.js"
			],
			scss: "css/*.scss",
			templates: "templates/*.jst",
			jed: "node_modules/jed/jed.js",
			get config() {
				return project.paths.config + "*.js";
			},
			grunt: "Gruntfile.js"
		},
		pkg: grunt.file.readJSON( "package.json" )
	};

	// Load Grunt configurations and tasks
	loadGruntConfig( grunt, {
		configPath: path.join( process.cwd(), project.paths.config ),
		data: project
	} );
};
