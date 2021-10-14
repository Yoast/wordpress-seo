// See https://github.com/sindresorhus/grunt-eslint
module.exports = function( grunt ) {
	const fix = grunt.option( "fix" ) || false;
	const outputFileSrc = grunt.option( "output-file-src" ) || false;
	const outputFileTests = grunt.option( "output-file-tests" ) || false;

	return {
		target: {
			src: [ "<%= files.js %>", "<%= files.jsDontLint %>" ],
			options: {
				maxWarnings: 22,
				fix: fix,
				outputFile: outputFileSrc,
			},
		},
		tests: {
			src: [ "<%= files.jsTests %>" ],
			options: {
				configFile: ".eslintrc-tests",
				maxWarnings: 19,
				fix: fix,
				outputFile: outputFileTests,
			},
		},
	};
};
