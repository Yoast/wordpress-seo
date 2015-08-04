// https://github.com/ariya/grunt-jsvalidate
module.exports = {
	options: {
		verbose: true
	},
	plugin: {
		files: {
			src: "js/analyzer.js"
		}
	},
	grunt: {
		files: {
			src: [
				"<%= files.grunt %>",
				"<%= files.config %>"
			]
		}
	}
};
