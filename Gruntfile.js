module.exports = function( grunt ) {
	"use strict";

	//require('time-grunt')(grunt);

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
			scss: "css/analyzer.scss",
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
	require( "load-grunt-config" )( grunt, {
		configPath: require( "path" ).join( process.cwd(), project.paths.config ),
		data: project
	} );
};
