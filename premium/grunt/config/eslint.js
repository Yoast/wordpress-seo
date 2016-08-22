// See https://github.com/sindresorhus/grunt-eslint
module.exports = {
	plugin: {
		src: [ "<%= files.js %>" ],
		options: {
			maxWarnings: 1106,
		},
	},
	grunt: {
		src: [ "<%= files.grunt %>", "<%= files.config %>" ],
		options: {
			maxWarnings: 298,
		},
	},
};

