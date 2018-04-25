// See https://github.com/sindresorhus/grunt-eslint
module.exports = {
	plugin: {
		src: [ "<%= files.js %>" ],
		options: {
			maxWarnings: 100,
		},
	},
	tests: {
		src: [ "<%= files.jsTests %>" ],
		options: {
			fix: true,
		}
	},
	grunt: {
		src: [ "<%= files.grunt %>", "<%= files.config %>" ],
		options: {
			maxWarnings: 29,
		},
	},
};
