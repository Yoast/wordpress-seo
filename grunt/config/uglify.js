// https://github.com/gruntjs/grunt-contrib-uglify
module.exports = {
	'wordpres-seo': {
		options: {
			preserveComments: /^!|@preserve|@license|@cc_on/,
			report: 'gzip'
		},
		files: [{
			expand: true,
			cwd: 'js/dist',
			src: [
				'*.js',
				'!*.min.js'
			],
			dest: 'js/dist',
			ext: '.min.js',
			extDot: 'first',
			isFile: true
		}]
	}
};
