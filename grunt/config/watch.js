// https://github.com/gruntjs/grunt-contrib-watch
module.exports = {
	options: {
		livereload: true
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
			'jshint:grunt',
			'jsvalidate:grunt',
			'jscs:grunt'
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
			'<%= files.js %>',
			'<%= paths.js %>/**/*.js'
		],
		tasks: [
			'build:js',
			'jshint:plugin',
			'jsvalidate:plugin',
			'jscs:plugin'
		]
	},
	css: {
		files: [
			'css/*css',
			'!css/*.min.css'
		],
		tasks: [
			'build:css'
		]
	},
	sass: {
		files: '<%= files.sass %>',
		tasks: [
			'build:sass'
		]
	}
};
