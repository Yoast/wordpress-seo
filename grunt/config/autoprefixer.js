// https://github.com/nDmitry/grunt-autoprefixer
module.exports = {
	options: {
		// diff: '<%= path.logs %>autoprefixer.patch'
		browsers: [
			'last 1 versions',
			'Explorer >= 8'
		]
	},
	plugin: {
		src: '<%= files.css %>'
	}
};
