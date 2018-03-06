// See https://github.com/gruntjs/grunt-contrib-watch for details.
module.exports = {
	options: {
		livereload: true,
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
			"phplint",
			"phpcs",
			"checktextdomain",
		],
	},
	js: {
		files: [
			"<%= files.js %>",
			"<%= paths.js %>/**/*.js",
		],
		tasks: [
			"build:js",
			"eslint:plugin",
		],
	},
	css: {
		files: [
			"css/*css",
			"!css/*.min.css",
		],
		tasks: [
			"build:css",
		],
	},
	sass: {
		files: "<%= paths.sass %>**/*.scss",
		tasks: [
			"build:sass",
		],
	},
};
