// https://github.com/csscomb/grunt-csscomb
module.exports = {
	css: {
		expand: true,
		src: [
			'css/*.css',
			'!css/*.min.css'
		]
	}
};
