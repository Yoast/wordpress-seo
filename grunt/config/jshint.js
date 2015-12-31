// https://github.com/gruntjs/grunt-contrib-jshint
module.exports = {
	plugin: {
		options: {
			jshintrc: ".jshintrc"
		},
		src: [ "<%= files.js %>", "<%= files.jsDontLint %>" ]
	},
	grunt: {
		options: {
			jshintrc: ".gruntjshintrc"
		},
		src: [
			"<%= files.grunt %>",
			"<%= files.config %>"
		]
	}
};
