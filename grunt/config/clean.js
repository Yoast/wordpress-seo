// https://github.com/gruntjs/grunt-contrib-clean
module.exports = {
	'po-files': [ 'languages/*.po', 'languages/<%= pkg.plugin.textdomain %>-temp.pot', 'languages/yoast-seo.json' ]
};
