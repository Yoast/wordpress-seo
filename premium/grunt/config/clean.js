// https://github.com/gruntjs/grunt-contrib-clean
module.exports = {
	'po-files': [
		'languages/*.po',
		'languages/yoast-social-previews.pot',
		'languages/yoast-social-previews.json',
		'languages/<%= pkg.plugin.textdomain %>-temp.pot'
	]
};
