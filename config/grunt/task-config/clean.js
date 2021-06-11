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
		"<%= paths.languages %>*.pot",
		"<%= paths.languages %>yoast-components.json",
		"<%= paths.languages %>yoast-seo.json",
		"<%= paths.languages %>yoastseojsfiles.txt",
	],
	"build-assets-js": [
		"js/dist",
		"<%= paths.css %>monorepo*.css",
	],
	"build-assets-css": [
		"css/dist/*.css",
		"!<%= paths.css %>monorepo*.css",
		"<%= files.cssMap %>",
		"<%= paths.css %>/select2",
	],
	artifact: [
		"<%= files.artifact %>",
	],
	"composer-files": [
		"<%= files.artifactComposer %>/vendor",
	],
	"vendor-prefixed": [
		"<%= paths.vendorPrefixed %>*/",
		"!<%= paths.vendorPrefixed %>*.gitignore",
	],
};
