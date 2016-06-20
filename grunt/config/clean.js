// https://github.com/gruntjs/grunt-contrib-clean
module.exports = {
	'po-files': [
		'languages/*.{po,mo}',
		'languages/yoast-seo.json'
	],
	'release-css': [
		'css/src/**',
		'css/*.css',
		'!css/*.min.css'
	],
	'release-js': [
		'js/src/**',
		'js/dist/*.js',
		'!js/dist/*.min.js'
	],
	'release-misc': [
		'changelog.txt',
		'CONTRIBUTING.md',
		'ISSUE_TEMPLATE.md',
		'phpdoc.xml',
		'README.md'
	]
};
