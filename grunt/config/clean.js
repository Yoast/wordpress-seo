// See https://github.com/gruntjs/grunt-contrib-clean for details.
module.exports = {
	"po-files": [
		"<%= paths.languages %>*.po",
		"<%= paths.languages %><%= pkg.plugin.textdomain %>-temp.pot",
		"<%= paths.languages %>yoast-seo.json",

		"<%= files.pot.yoastComponents %>",
		"<%= paths.languages %>yoast-components.pot",
		"<%= paths.languages %>yoast-components.json",

		"<%= files.pot.yoastseojs %>",
	],
	"build-assets": [
		"<%= paths.css %>/*.css",
		"js/dist/*.js",
		"!js/dist/jquery.tablesorter.min.js"
	],
	"before-rtlcss": [
		"css/dist/*-rtl*",
		"css/dist/toggle-switch/*.css",
		"!css/dist/select2/*.min.css",
	],
	artifact: [
		"<%= files.artifact %>",
	],
	"composer-artifact": [
		"<%= files.artifactComposer %>",
	],
	"composer-files": [
		"<%= files.artifactComposer %>/vendor",
	],
};
