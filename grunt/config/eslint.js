// See https://github.com/sindresorhus/grunt-eslint
module.exports = {
	plugin: {
		src: [ "<%= files.js %>" ],
		options: {
			maxWarnings: 150,
		},
	},
	tests: {
		src: [ "<%= files.jsTests %>" ],
		options: {
			maxWarnings: 6,
		},
	},
	grunt: {
		src: [ "<%= files.grunt %>", "<%= files.config %>" ],
		options: {
			maxWarnings: 22,
		},
	},
};
