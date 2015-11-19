// https://github.com/jscs-dev/grunt-jscs
module.exports = {
	options: {
		config: '.jscsrc'
	},
	plugin: {
		files: {
			src: [
				'<%= files.js %>',
				'!assets/js/yoast-seo-helpscout-beacon.js'
			]
		}
	},
	grunt: {
		options: {
			// We have no control over task names that use underscores
			requireCamelCaseOrUpperCaseIdentifiers: 'ignoreProperties'
		},
		files: {
			src: [
				'<%= files.grunt %>',
				'<%= files.config %>'
			]
		}
	}
};
