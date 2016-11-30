// See https://github.com/gruntjs/grunt-contrib-watch
module.exports = {
	compile: {
		files: "<%= files.js %>",
		tasks: [ "build:js" ],
	},
	checks: {
		files: [ "<%= files.js %>", "<%= files.jsDontLint %>" ],
		tasks: [ "eslint" ],
	},
	sass: {
		files: "<%= files.scss %>",
		tasks: [ "sass:build", "postcss:build" ],
	},
	templates: {
		files: "<%= files.templates %>",
		tasks: [ "build:jst" ],
	},
};
