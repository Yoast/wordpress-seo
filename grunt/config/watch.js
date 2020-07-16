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
			"check:php",
			"check:i18n",
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
			"<%= files.css %>",
		],
		tasks: [
			"build:css",
		],
	},
};
