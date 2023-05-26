module.exports = {
	publish: {
		files: [ {
			expand: true,
			src: [ "src/**/*.js", "vendor/**/*.js" ],
			/**
			 * Filters the source files.
			 *
			 * @param {string} filePath The path of the current file.
			 *
			 * @returns {boolean} Whether to process this file.
			 */
			filter: function( filePath ) {
				const insideParsedPaper = filePath.startsWith( "src/parsedPaper/" );
				const insideParsedPaperScoreAggregator = filePath.startsWith( "src/parsedPaper/assess/scoreAggregators/" );
				return ( ! insideParsedPaper ) || insideParsedPaperScoreAggregator;
			},
			dest: "dist/",
		} ],
		options: {
			sourceMap: true,
			comments: true,
		},
	},
};
