require("../js/scoreFormatter.js");

describe("A function to transform a textual score into a description", function() {
	YoastSEO.ScoreFormatter.prototype.outputScore = function() {};
	YoastSEO.ScoreFormatter.prototype.outputOverallScore = function() {};

	var i18n = Factory.buildJed();

	scoreFormatter = new YoastSEO.ScoreFormatter({
		scores: [],
		overallScore: 0,
		outputTarget: '',
		overallTarget: '',
		keyword: '',
		saveScores: function() {},
		i18n: i18n
	});

	it("should know how to transform the score", function() {
		expect(scoreFormatter.getSEOScoreText('na') ).toBe("No keyword");
		expect(scoreFormatter.getSEOScoreText('bad') ).toBe("Bad SEO score");
		expect(scoreFormatter.getSEOScoreText('poor') ).toBe("Poor SEO score");
		expect(scoreFormatter.getSEOScoreText('ok') ).toBe("Ok SEO score");
		expect(scoreFormatter.getSEOScoreText('good') ).toBe("Good SEO score");
	});

	it("should return an empty string with invalid scores", function() {
		expect(scoreFormatter.getSEOScoreText('') ).toBe("");
		expect(scoreFormatter.getSEOScoreText('some invalid string') ).toBe("");
	})
});
