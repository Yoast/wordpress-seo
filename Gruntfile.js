var path = require( "path" );
var loadGruntConfig = require( "load-grunt-config" );

module.exports = function( grunt ) {
	"use strict";

	// Define project configuration
	var project = {
		paths: {
			grunt: "grunt/",
			js: "js/",
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
