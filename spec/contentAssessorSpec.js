var ContentAssessor = require( "../js/contentAssessor.js" );
var AssessmentResult = require( "../js/values/AssessmentResult.js" );
var Factory = require( "./helpers/factory.js" );

var forEach = require( "lodash/forEach" );

var i18n = Factory.buildJed();

describe( "A content assesor", function() {
	var contentAssessor;

	beforeEach( function() {
		contentAssessor = new ContentAssessor( i18n );
	});

	describe( "calculatePenaltyPoints", function() {
		var results;

		beforeEach( function() {
			contentAssessor.getValidResults = function() {
				return results;
			};
		});

		it( "should have no points for an empty result set", function() {
			results = [];
			var expected = 0;

			var actual = contentAssessor.calculatePenaltyPoints();

			expect( actual ).toBe( expected );
		});

		it( "should return 0 for all green assessment results", function() {
			results = [
				new AssessmentResult({ score: 9 }),
				new AssessmentResult({ score: 9 }),
				new AssessmentResult({ score: 9 }),
				new AssessmentResult({ score: 9 }),
				new AssessmentResult({ score: 9 })
			];
			var expected = 0;

			var actual = contentAssessor.calculatePenaltyPoints();

			expect( actual ).toBe( expected );
		});

		it( "should return 3 for a red assessment result", function() {
			results = [
				new AssessmentResult({ score: 3 })
			];
			var expected = 3;

			var actual = contentAssessor.calculatePenaltyPoints();

			expect( actual ).toBe( expected );
		});

		it( "should return 2 for an orange assessment result", function() {
			results = [
				new AssessmentResult({ score: 6 })
			];
			var expected = 2;

			var actual = contentAssessor.calculatePenaltyPoints();

			expect( actual ).toBe( expected );
		});

		it( "should return an aggregate for a mixed resultset", function() {
			results = [
				new AssessmentResult({ score: 9 }),
				new AssessmentResult({ score: 6 }),
				new AssessmentResult({ score: 3 }),
				new AssessmentResult({ score: 9 }),
				new AssessmentResult({ score: 6 }),
				new AssessmentResult({ score: 3 }),
				new AssessmentResult({ score: 6 }),
				new AssessmentResult({ score: 9 }),
				new AssessmentResult({ text: "A piece of feedback" })
			];
			var expected = 6 + 6;

			var actual = contentAssessor.calculatePenaltyPoints();

			expect( actual ).toBe( expected );
		});
	});

	describe( "calculateOverallScore", function() {
		var points, results;

		beforeEach( function() {
			contentAssessor.getValidResults = function() {
				return results;
			};
			contentAssessor.calculatePenaltyPoints = function() {
				return points;
			};
		});

		it( "should default to a bad indicator", function() {
			var expected = 30;
			results = [];

			var actual = contentAssessor.calculateOverallScore();

			expect( actual ).toBe( expected );
		} );

		it( "should give worse results based on the negative points", function() {
			results = [
				new AssessmentResult()
			];
			var testCases = [
				{ points: 7, expected: 30 },
				{ points: 6, expected: 60 },
				{ points: 9, expected: 30 },
				{ points: 4, expected: 90 },
				{ points: 2, expected: 90 },
				{ points: 1.9, expected: 90 },
				{ points: 1, expected: 90 }
			];

			forEach( testCases, function( testCase ) {
				points = testCase.points;

				var actual = contentAssessor.calculateOverallScore();

				expect( actual ).toBe( testCase.expected );
			} );
		});
	});
});
