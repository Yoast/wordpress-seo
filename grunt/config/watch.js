// https://github.com/gruntjs/grunt-contrib-watch
module.exports = {
	compile: {
		files: "<%= files.js %>",
		tasks: [ "build:js" ]
	},
	checks: {
		files: [ "<%= files.js %>", "<%= files.jsDontLint %>" ],
		tasks: [ "eslint", "jshint", "jscs" ]
	},
	sass: {
		files: "<%= files.scss %>",
		tasks: [ "sass:build", "postcss:build" ]
	},
	"cssmin-example": {
		files: [ "examples/standalone/style.css" ],
		tasks: [ "cssmin" ]
	},
	templates: {
		files: "<%= files.templates %>",
		tasks: [ "build:jst" ]
	}
};
