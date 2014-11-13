// https://github.com/gruntjs/grunt-contrib-cssmin
module.exports = {
	minify: {
		expand: true,
		cwd: 'css/',
		src: [
			'*.css',
			'!*.min.css'
		],
		dest: 'css/',
		ext: '.min.css'
	}
};
