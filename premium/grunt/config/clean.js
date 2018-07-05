// https://github.com/gruntjs/grunt-contrib-clean
module.exports = {
	'po-files': [
		'languages/*.po',
		'languages/yoast-social-previews.pot',
		'languages/yoast-social-previews.json',
		'languages/<%= pkg.plugin.textdomain %>-temp.pot'
	],
	"build-assets": [
		"<%= paths.js %>/dist/*.js",
		"<%= paths.css %>/*.css",
	],
	artifact: [
		"artifact",
	],
	"yoast-components-i18n": [
		"node_modules/yoast-components/node_modules/@wordpress/i18n",
	],
};
