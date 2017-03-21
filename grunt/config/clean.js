// https://github.com/gruntjs/grunt-contrib-clean
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
		"<%= paths.css %>/dist/*.css",
		"js/dist/*.js"
	],
	"before-rtlcss": [
		"css/dist/*.css",
		"css/dist/toggle-switch/*.css",
		"!css/dist/select2/*.min.css",
	],
	artifact: [
		"artifact",
	],
};
