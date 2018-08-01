// https://github.com/gruntjs/grunt-contrib-uglify
module.exports = {
	js: {
		options: {
			preserveComments: 'some',
			report: 'gzip'
		},
		files: [ {
					expand: true,
					src: [
						'<%= paths.js %>dist/*.js',
						'!<%= paths.js %>dist/*.min.js',
					],
					ext: '.min.js',
					extDot: 'first',
					isFile: true
				} ]
	}
};
