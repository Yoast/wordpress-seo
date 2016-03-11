// https://github.com/gruntjs/grunt-contrib-watch
module.exports = {
	sass: {
		files: "<%= files.scss %>",
		tasks: [ "sass:build", "postcss:build" ]
	}
};
