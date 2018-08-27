// See https://github.com/gruntjs/grunt-contrib-clean for details.
module.exports = {
	"language-files": [
		"<%= paths.languages %>*",
		"!<%= paths.languages %>index.php",
	],
	"after-po-download": [
		"<%= paths.languages %><%= pkg.plugin.textdomain %>-*-{formal,informal,ao90}.{po,json}",
	],
	"po-files": [
		"<%= paths.languages %>*.po",
		"<%= paths.languages %><%= pkg.plugin.textdomain %>-temp.pot",
		"<%= paths.languages %>yoast-seo.json",

		"<%= files.pot.yoastComponents %>",
		"<%= files.pot.yoastComponentsConfigurationWizard %>",
		"<%= files.pot.yoastComponentsRemaining %>",
		"<%= files.pot.wordpressSeoJs %>",
		"<%= paths.languages %>yoast-components.pot",
		"<%= paths.languages %>yoast-components.json",

		"<%= files.pot.yoastseojs %>",
	],
	"build-assets": [
		"<%= paths.css %>/*.css",
		"js/dist/*.js",
		"!js/dist/jquery.tablesorter.min.js",
	],
	"before-rtlcss": [
		"css/dist/*-rtl*",
		"css/dist/toggle-switch/*.css",
		"!css/dist/select2/*.min.css",
	],
	artifact: [
		"artifact",
	],
};
