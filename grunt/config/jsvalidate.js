// https://github.com/ariya/grunt-jsvalidate
module.exports = {
	options: {
		verbose: true
	},
	plugin: {
		files: {
			src: [
				'<%= files.js %>',
				'!js/src/kb-search/*.js',
				'!js/src/wp-seo-admin.js'
			]
		}
	},
	grunt: {
		files: {
			src: [
				'<%= files.grunt %>',
				'<%= files.config %>'
			]
		}
	}
};
