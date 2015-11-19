// https://github.com/stephenharris/grunt-checktextdomain
module.exports = {
	'po-files': [ 'languages/*.po', 'languages/<%= pkg.plugin.textdomain %>-temp.pot', 'languages/yoast-seo.json' ]
};
