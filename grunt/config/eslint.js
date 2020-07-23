// See https://github.com/sindresorhus/grunt-eslint
module.exports = {
	plugin: {
		src: [ "<%= files.js %>" ],
		options: {
			maxWarnings: 126,
		},
	},
	tests: {
		src: [ "<%= files.jsTests %>" ],
		options: {
			maxWarnings: 0,
		},
	},
	grunt: {
		src: [ "<%= files.grunt %>", "<%= files.config %>" ],
		options: {
			maxWarnings: 0,
		},
	},
};
