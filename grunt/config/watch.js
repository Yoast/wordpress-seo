// https://github.com/gruntjs/grunt-contrib-watch
module.exports = {
	compile: {
		files: "<%= files.js %>",
		tasks: [ "uglify" ]
	},
	checks: {
		files: "<%= files.js %>",
		tasks: [ "jshint", "jscs" ]
	}
};
