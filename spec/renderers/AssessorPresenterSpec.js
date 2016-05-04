var AssessorPresenter = require( "../../js/renderers/AssessorPresenter.js" );
var AssessmentResult = require( "../../js/values/AssessmentResult" );
var Factory = require( "../helpers/factory.js" );

describe( "an AssessorPresenter", function() {
	var i18n;
	var assessorPresenter;

	beforeEach( function() {
		i18n = Factory.buildJed();
		assessorPresenter = new AssessorPresenter( {
			scorer: { __score: [], __totalScore: 0 },
			targets: { output: "", overall: "" },
			keyword: "",
			assessor: {},
			i18n: i18n
		} );
	} );


	describe("A function to transform a textual score into a description", function() {
		AssessorPresenter.prototype.outputScore = function() {};
		AssessorPresenter.prototype.outputOverallScore = function() {};

		it("should know how to transform the score", function() {
			expect( assessorPresenter.resultToRating( { score: 0 } ).rating ).toBe( "feedback" );
			expect( assessorPresenter.resultToRating( { score: 1 } ).rating ).toBe( "bad" );
			expect( assessorPresenter.resultToRating( { score: 5 } ).rating ).toBe( "ok" );
			expect( assessorPresenter.resultToRating( { score: 8 } ).rating ).toBe( "good" );
		});

		it("should return an empty string with invalid scores", function() {
			expect( assessorPresenter.resultToRating( "" ) ).toEqual( "" );
			expect( assessorPresenter.resultToRating( "some invalid string" ) ).toEqual( "" );
		})
	});

	describe("A function to transform a numeric overall score into a textual score", function() {
		var expectations = [
			[ 0, 'feedback', "Feedback" ],
			[ 1, 'bad', "Bad SEO score" ],
			[ 23, 'bad', "Bad SEO score" ],
			[ 40, 'bad', "Bad SEO score" ],
			[ 41, 'ok', "OK SEO score" ],
			[ 55, 'ok', "OK SEO score" ],
			[ 70, 'ok', "OK SEO score" ],
			[ 71, 'good', "Good SEO score" ],
			[ 83, 'good', "Good SEO score" ],
			[ 100, 'good', "Good SEO score" ]
		];

		beforeEach( function() {
			assessorPresenter.keyword = "keyword";
		});

		it("should know how to transform the score", function() {
			expectations.forEach( function( item ) {
				expect( assessorPresenter.getOverallRating( item[0] ).rating ).toBe( item[1] );
			});
		});

		it("should know how to transform the score and retrieve the proper translation from config", function() {
			expectations.forEach( function( item ) {
				expect( assessorPresenter.getIndicatorScreenReaderText( assessorPresenter.getOverallRating( item[0] ).rating ) ).toBe( item[ 2 ] );
			});
		});

		it( "should rate a paper without a keyword as na (no keyword)", function() {
			assessorPresenter.keyword = "";

			expect( assessorPresenter.getOverallRating( 41 ).rating ).toBe( "feedback" );
		});

		it( "should gracefully deal with invalid scores", function() {
			expect( assessorPresenter.getOverallRating( false ).rating ).toBe( "feedback" );
		});
	});

	describe( "assessment result sorting", function() {
		var result1, result2;

		beforeEach( function() {
			result1 = new AssessmentResult();
			result2 = new AssessmentResult();
			result1.setScore( 50 );
			result2.setScore( 25 );
		});

		it( "should be able to sort assessment results", function() {
			var assessments = [ result1, result2 ];
			var expectation = [ result2, result1 ];

			expect( assessorPresenter.sort( assessments ) ).toEqual( expectation );
		});

		it( "should order undefined results lower than defined results", function() {
			var result3 = new AssessmentResult();
			var assessments = [ result1, result2, result3 ];
			var expectation = [ result3, result2, result1 ];

			expect( assessorPresenter.sort( assessments ) ).toEqual( expectation );
		});
	})
});
