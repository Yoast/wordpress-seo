// https://github.com/gruntjs/grunt-contrib-jshint
module.exports = {
	plugin: {
		options: {
			jshintrc: '<%= paths.js %>.jshintrc'
		},
		src: [
			'<%= files.js %>',
			'!js/src/kb-search/*.js'
		]
	},
	grunt: {
		options: {
			jshintrc: '.jshintrc'
		},
		src: [
			'<%= files.grunt %>',
			'<%= files.config %>'
		]
	}
};
