// See https://github.com/sindresorhus/grunt-eslint
module.exports = {
	plugin: {
		src: [ "<%= files.js %>" ],
		options: {
			maxWarnings: 115,
		},
	},
	grunt: {
		src: [ "<%= files.grunt %>", "<%= files.config %>" ],
		options: {
			maxWarnings: 29,
		},
	},
};
