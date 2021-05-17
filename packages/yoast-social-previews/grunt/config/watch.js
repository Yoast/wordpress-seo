// https://github.com/gruntjs/grunt-contrib-watch
module.exports = {
	compile: {
		files: "<%= files.js %>",
		tasks: [ "build:js" ],
	},
	checks: {
		files: [ "<%= files.js %>", "<%= files.jsDontLint %>" ],
		tasks: [ "check" ],
	},
	sass: {
		files: "<%= files.scss %>",
		tasks: [ "sass:build", "postcss:build" ],
	},
	"cssmin-example": {
		files: [ "example/style.css" ],
		tasks: [ "cssmin" ],
	},
	templates: {
		files: "<%= files.templates %>",
		tasks: [ "build:jst" ],
	},
};
