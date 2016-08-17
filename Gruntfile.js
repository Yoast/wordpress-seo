var path = require( "path" );
var loadGruntConfig = require( "load-grunt-config" );

module.exports = function( grunt ) {
	"use strict";

	// Define project configuration
	var project = {
		paths: {
			grunt: "grunt/",
			get config() {
				return this.grunt + "config/";
			}
		},
		files: {
			components: [
				"forms/*.js",
				"a11y/*.js", 
				"onboarding-wizard/**/*.js",
				"!onboarding-wizard/tests/**/*.js",
				"!onboarding-wizard/config/**/*.js"
			],
			get config() {
				return project.paths.config + "*.js";
			},
			grunt: "Gruntfile.js"
		},
		pkg: grunt.file.readJSON( "package.json" ),
	};

	// Load Grunt configurations and tasks
	loadGruntConfig( grunt, {
		configPath: path.join( process.cwd(), project.paths.config ),
		data: project,
	} );
};
