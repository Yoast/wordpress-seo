// https://github.com/gruntjs/grunt-contrib-watch
module.exports = {
	options: {
//		livereload: true
	},
	grunt: {
		options: {
			reload: true
		},
		files: [
			'<%= files.grunt %>',
			'<%= files.config %>'
		],
		tasks: [
			'eslint:plugin'
		]
	},
	php: {
		files: [
			'<%= files.php %>'
		],
		tasks: [
			'phplint',
			'phpcs',
			'checktextdomain'
		]
	},
	js: {
		files: [
			'<%= files.js %>'
		],
		tasks: [
			'build:js',
			'eslint:plugin'
		]
	},
	css: {
		files: [
			'css/*css'
		],
		tasks: [
			'build:css'
		]
	}
};
