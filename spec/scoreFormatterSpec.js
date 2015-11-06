//require("../js/config/config.js");
//require("../js/config/scoring.js");
//require("../js/analyzer.js");
//require("../js/preprocessor.js");
//require("../js/analyzescorer.js");
//require("../js/stringhelper.js");
require("../js/scoreFormatter.js");

describe("A function to transform a textual score into a description", function() {
	YoastSEO.ScoreFormatter.prototype.outputScore = function() {};
	YoastSEO.ScoreFormatter.prototype.outputOverallScore = function() {};

	scoreFormatter = new YoastSEO.ScoreFormatter({
		scores: [],
		overallScore: 0,
		outputTarget: '',
		overallTarget: '',
		keyword: '',
		saveScores: function() {}
	});

	var i18n = Factory.buildJed();

	it("should know how to transform the score", function() {
		expect(scoreFormatter.getSEOScoreText('na', i18n) ).toBe("No keyword");
		expect(scoreFormatter.getSEOScoreText('bad', i18n) ).toBe("Bad SEO score");
		expect(scoreFormatter.getSEOScoreText('poor', i18n) ).toBe("Poor SEO score");
		expect(scoreFormatter.getSEOScoreText('ok', i18n) ).toBe("Ok SEO score");
		expect(scoreFormatter.getSEOScoreText('good', i18n) ).toBe("Good SEO score");
	});

	it("should return an empty string with invalid scores", function() {
		expect(scoreFormatter.getSEOScoreText('', i18n) ).toBe("");
		expect(scoreFormatter.getSEOScoreText('some invalid string', i18n) ).toBe("");
	})
});
