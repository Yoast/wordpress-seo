var path = require( "path" );
var loadGruntConfig = require( "load-grunt-config" );

module.exports = function( grunt ) {
	// Define project configuration
	var project = {
		paths: {
			grunt: "grunt/",
			js: "js/",
			css: "css/",
			get config() {
				return this.grunt + "config/";
			},
		},
		files: {
			js: [
				"src/**/*.js",
				"grunt/config/*.js",
				"!src/config/*.js",
				"<%= files.grunt %>",
				"!js",
			],
			jsDontLint: [
				"!js/templates.js",
			],
			jsTests: [
				"spec/**/*.js",
			],
			scss: "css/*.scss",
			templates: "templates/*.jst",
			jed: "node_modules/jed/jed.js",
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
