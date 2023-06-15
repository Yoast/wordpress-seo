module.exports = {
	presets: [ "@yoast/babel-preset" ],

	// Remove the parsedPaper directory from the build, except for the scoreAggregators which are used in src/worker/AnalysisWebWorker.js
	ignore: [ "src/parsedPaper/" ],
	exclude: [ "src/parsedPaper/assess/scoreAggregators/" ],
};
