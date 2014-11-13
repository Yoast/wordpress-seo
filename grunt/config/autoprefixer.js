// https://github.com/nDmitry/grunt-autoprefixer
module.exports = {
	options: {
		// diff: 'tmp/autoprefixer.patch'
		browsers: [
			'last 1 versions',
			'Explorer >= 8'
		]
	},
	all: {
		src: '<%= files.css %>'
	}
};
