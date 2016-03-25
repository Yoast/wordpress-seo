var ScoreFormatter = require("../js/scoreFormatter.js");

var Factory = require( "./helpers/factory.js" );

describe("A function to transform a textual score into a description", function() {
	ScoreFormatter.prototype.outputScore = function() {};
	ScoreFormatter.prototype.outputOverallScore = function() {};

	var i18n = Factory.buildJed();

	scoreFormatter = new ScoreFormatter({
		scorer: { __score: [], __totalScore: 0 },
		targets: { output: "", overall: "" },
		keyword: "",
		i18n: i18n
	});

	it("should know how to transform the score", function() {
		expect( scoreFormatter.scoreRating( 'na' ).seoText ).toBe( "No keyword" );
		expect( scoreFormatter.scoreRating( 1 ).seoText ).toBe( "Bad SEO score" );
		expect( scoreFormatter.scoreRating( 5 ).seoText ).toBe( "Ok SEO score" );
		expect( scoreFormatter.scoreRating( 8 ).seoText ).toBe( "Good SEO score" );
	});

	it("should return an empty string with invalid scores", function() {
		expect( scoreFormatter.scoreRating( '' ) ).toEqual( {} );
		expect( scoreFormatter.scoreRating( 'some invalid string' ) ).toEqual( {} );
	})
});

describe("A function to transform a numeric overall score into a textual score", function() {
	var i18n = Factory.buildJed();

	scoreFormatter = new ScoreFormatter({
		scorer: { __score: [], __totalScore: 0 },
		targets: { output: "", overall: "" },
		keyword: "",
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
