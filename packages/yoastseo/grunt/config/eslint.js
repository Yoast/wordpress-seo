// See https://github.com/sindresorhus/grunt-eslint
module.exports = function( grunt ) {
	const fix = grunt.option( "fix" ) || false;

	return {
		target: {
			src: [ "<%= files.js %>", "<%= files.jsDontLint %>" ],
			options: {
				maxWarnings: 21,
				fix: fix,
			},
		},
		tests: {
			src: [ "<%= files.jsTests %>" ],
			options: {
				configFile: ".eslintrc-tests",
				maxWarnings: 6,
				fix: fix,
			},
		},
	};
};
