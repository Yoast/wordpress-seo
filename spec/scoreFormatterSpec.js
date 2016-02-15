var ScoreFormatter = require("../js/scoreFormatter.js");

var Factory = require( "./helpers/factory.js" );

describe("A function to transform a textual score into a description", function() {
	ScoreFormatter.prototype.outputScore = function() {};
	ScoreFormatter.prototype.outputOverallScore = function() {};

	var i18n = Factory.buildJed();

	scoreFormatter = new ScoreFormatter({
		scores: [],
		overallScore: 0,
		outputTarget: '',
		overallTarget: '',
		keyword: '',
		saveScores: function() {},
		i18n: i18n
	});

	it("should know how to transform the score", function() {
		expect(scoreFormatter.getSEOScoreText('na')).toBe("No keyword");
		expect(scoreFormatter.getSEOScoreText('bad')).toBe("Bad SEO score");
		expect(scoreFormatter.getSEOScoreText('ok')).toBe("Ok SEO score");
		expect(scoreFormatter.getSEOScoreText('good')).toBe("Good SEO score");
	});

	it("should return an empty string with invalid scores", function() {
		expect(scoreFormatter.getSEOScoreText('')).toBe("");
		expect(scoreFormatter.getSEOScoreText('some invalid string')).toBe("");
	})
});

describe("A function to transform a numeric overall score into a textual score", function() {
	var i18n = Factory.buildJed();

	scoreFormatter = new ScoreFormatter({
		scores: [],
		overallScore: 0,
		outputTarget: '',
		overallTarget: '',
		keyword: '',
		saveScores: function() {},
		i18n: i18n
	});

	it("should know how to transform the score", function() {
		var expectations = [
			[ 1, 'bad' ],
			[ 23, 'bad' ],
			[ 40, 'bad' ],
			[ 41, 'ok' ],
			[ 55, 'ok' ],
			[ 70, 'ok' ],
			[ 71, 'good' ],
			[ 83, 'good' ],
			[ 100, 'good' ]
		];

		expectations.forEach( function( item ) {
			expect( scoreFormatter.overallScoreRating(item[0]) ).toBe(item[1]);
		});
	})
});
