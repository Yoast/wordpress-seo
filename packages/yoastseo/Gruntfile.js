var path = require( "path" );
var loadGruntConfig = require( "load-grunt-config" );

module.exports = function( grunt ) {
	// Define project configuration
	var project = {
		paths: {
			grunt: "grunt/",
			js: "src/",
			css: "css/",
			/**
			 * Gets the path to the grunt config.
			 *
			 * @returns {string} The config path.
			 */
			get config() {
				return this.grunt + "config/";
			},
		},
		files: {
			js: [
				"src/**/*.js",
				"vendor/**/*.js",
				"grunt/config/*.js",
				"!src/config/*.js",
				"<%= files.grunt %>",
				"!js",
			],
			jsTests: [
				"spec/**/*.js",
			],
			scss: "css/*.scss",
			jed: "node_modules/jed/jed.js",
			/**
			 * Gets the wildcard to get the grunt config files.
			 *
			 * @returns {string} The wildcard.
			 */
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
		jitGrunt: {
			customTasksDir: "grunt/custom",
		},
	} );
};
