// https://github.com/gruntjs/grunt-contrib-cssmin
module.exports = {
	options: {
		report: 'gzip'
	},
	plugin: {
		expand: true,
		cwd: '<%= paths.css %>',
		src: [
			'*.css',
			'!*.min.css'
		],
		dest: '<%= paths.css %>',
		ext: '.min.css'
	}
};
