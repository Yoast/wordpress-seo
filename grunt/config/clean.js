// https://github.com/gruntjs/grunt-contrib-clean
module.exports = {
	"po-files": [
		"<%= paths.languages %>*.po",
		"<%= paths.languages %><%= pkg.plugin.textdomain %>-temp.pot",
		"<%= paths.languages %>yoast-seo.json",

		"<%= paths.languages %>yoast-components.pot",
		"<%= paths.languages %>yoast-components.json",
	],
	"release-css": [
		"css/src/**",
		"css/*.css",
		"!css/*.min.css",
	],
	"before-rtlcss": [
		"css/dist/*.css",
		"css/dist/toggle-switch/*.css",
		"!css/dist/select2/*.min.css",
	],
	"release-js": [
		"js/src/**",
		"js/dist/*.js",
		"!js/dist/*.min.js",
	],
	"release-misc": [
		"changelog.txt",
		"CONTRIBUTING.md",
		"ISSUE_TEMPLATE.md",
		"phpdoc.xml",
		"README.md",
	],
};
