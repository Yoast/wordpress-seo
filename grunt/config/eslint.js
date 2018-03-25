// See https://github.com/sindresorhus/grunt-eslint
module.exports = {
	target: {
		src: [ "<%= files.js %>", "<%= files.jsDontLint %>" ],
		options: {
			maxWarnings: 14,
		},
	},
	tests: {
		src: [ "<%= files.jsTests %>" ],
		options: {
			configFile: ".eslintrc-tests",
		},
	},
};
