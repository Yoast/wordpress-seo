// https://github.com/gruntjs/grunt-contrib-jshint
module.exports = {
	plugin: {
		options: {
			jshintrc: '.jshintrc'
		},
		src: '<%= files.js %>'
	},
	grunt: {
		options: {
			jshintrc: '.gruntjshintrc'
		},
		src: [
			'<%= files.grunt %>',
			'<%= files.config %>'
		]
	}
};
