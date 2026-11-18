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
			"packages/**/src/**/*.js",
		],
		tasks: [
			"shell:yarn:build",
			"shell:yarn:lint:packages",
		],
	},
	jsTests: {
		files: [
			"<%= files.jsTests %>",
		],
		tasks: [
			"shell:yarn:lint:packages --scope @yoast/wordpress-seo",
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
