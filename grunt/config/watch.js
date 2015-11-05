// https://github.com/gruntjs/grunt-contrib-watch
module.exports = {
	compile: {
		files: "<%= files.js %>",
		tasks: [ "build" ]
	},
	checks: {
		files: "<%= files.js %>",
		tasks: [ "jshint", "jscs" ]
	}
};
