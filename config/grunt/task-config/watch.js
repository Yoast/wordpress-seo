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
			"shell:yarn:lint:tooling",
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
			"packages/js/src/**/*.js",
		],
		tasks: [
			"build:js",
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
