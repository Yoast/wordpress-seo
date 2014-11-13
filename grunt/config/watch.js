// https://github.com/gruntjs/grunt-contrib-watch
module.exports = {
	gruntfile: {
		files: ['Gruntfile.js'],
		tasks: ['jshint:grunt', 'jsvalidate', 'jscs']
	},
	php: {
		files: ['**/*.php', '*/*.php', '!node_modules/**'],
		tasks: ['phplint', 'phpcs']
	},
	js: {
		files: ['js/*.js'],
		tasks: ['jshint', 'jsvalidate', 'jscs', 'uglify']
	},
	css: {
		files: ['css/*css'],
		tasks: ['build:css']
	}
};
