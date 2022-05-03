// See https://github.com/gruntjs/grunt-contrib-clean for details.
module.exports = {
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
