// See https://github.com/sindresorhus/grunt-eslint
module.exports = {
	plugin: {
		src: [ "<%= files.js %>" ],
		options: {
			maxWarnings: 167,
		},
	},
	tests: {
		src: [ "<%= files.jsTests %>" ],
		options: {
			maxWarnings: 4,
		},
	},
	grunt: {
		src: [ "<%= files.grunt %>", "<%= files.config %>" ],
		options: {
			maxWarnings: 16,
		},
	},
};
