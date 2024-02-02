// See https://github.com/gruntjs/grunt-contrib-watch for details.
module.exports = {
	options: {
		livereload: {
			port: 45678,
		},
	},
	grunt: {
		options: {
			reload: true,
		},
		files: [
			"<%= files.grunt %>",
			"<%= files.config %>",
		],
		tasks: [
			"eslint:grunt",
		],
	},
	php: {
		files: [
			"<%= files.php %>",
		],
		tasks: [
			"check:php",
		],
	},
	js: {
		files: [
			"<%= files.js %>",
			"<%= paths.js %>/**/*.js",
			"packages/ui-library/src/**/*.js",
		],
		tasks: [
			"build:packages",
			"build:js",
			"eslint:plugin",
		],
	},
	jsTests: {
		files: [
			"<%= files.jsTests %>",
		],
		tasks: [
			"eslint:tests",
		],
	},
	css: {
		files: [
			"<%= files.css %>",
			"packages/ui-library/src/**/*.css",
		],
		tasks: [
			"build:packages",
			"build:css",
		],
	},
};
