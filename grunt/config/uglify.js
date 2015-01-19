// https://github.com/gruntjs/grunt-contrib-uglify
module.exports = {
	'wordpres-seo': {
		options: {
			preserveComments: 'some',
			report: 'gzip'
		},
		files: [{
			expand: true,
			cwd: 'assets/js',
			src: [
				'*.js',
				'!*.min.js'
			],
			dest: 'assets/js',
			ext: '.min.js',
			extDot: 'first',
			isFile: true
		}]
	}
};
