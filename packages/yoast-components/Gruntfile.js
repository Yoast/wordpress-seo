/* eslint-disable require-jsdoc */
const path = require( "path" );
const loadGruntConfig = require( "load-grunt-config" );

module.exports = function( grunt ) {
	// Define project configuration
	const project = {
		paths: {
			grunt: "grunt/",
			get config() {
				return this.grunt + "config/";
			},
		},
		files: {
			components: [
				"**/*.js",
				"*.js",
				"!node_modules/**",
				"!node_modules/*",
			],
			get config() {
				return project.paths.config + "*.js";
			},
			grunt: "Gruntfile.js",
		},
		pkg: grunt.file.readJSON( "package.json" ),
	};

	// Load Grunt configurations and tasks
	loadGruntConfig( grunt, {
		configPath: path.join( process.cwd(), project.paths.config ),
		data: project,
	} );
};
