// https://github.com/jscs-dev/grunt-jscs
module.exports = {
	options: {
		config: '.jscsrc'
	},
	plugin: {
		files: {
			src: [
				'<%= files.js %>',
				'!js/src/kb-search/*.js'
			]
		}
	}
};
