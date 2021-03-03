import { forEach } from "lodash-es";
import DefaultResearcher from "../../../src/languageProcessing/languages/_default/Researcher";
import EnglishResearcher from "../../../src/languageProcessing/languages/en/Researcher";
import DutchResearcher from "../../../src/languageProcessing/languages/nl/Researcher";

import ContentAssessor from "../../../src/scoring/cornerstone/contentAssessor";
import AssessmentResult from "../../../src/values/AssessmentResult";
import Paper from "../../../src/values/Paper";
import Factory from "../../specHelpers/factory";

const i18n = Factory.buildJed();

describe( "A content assessor", function() {
	describe( "calculatePenaltyPoints", function() {
		let contentAssessor;
		let results;
		const paper = new Paper();
		beforeEach( function() {
			contentAssessor = new ContentAssessor( i18n, new EnglishResearcher( paper ), { locale: "en_US" } );
			contentAssessor.getValidResults = function() {
				return results;
			};
			contentAssessor.getPaper = function() {
				return paper;
			};
		} );

		it( "should have no points for an empty result set", function() {
			results = [];
			const expected = 0;

			const actual = contentAssessor.calculatePenaltyPoints();

			expect( actual ).toBe( expected );
		} );

		it( "should return 0 for all green assessment results", function() {
			results = [
				new AssessmentResult( { score: 9 } ),
				new AssessmentResult( { score: 9 } ),
				new AssessmentResult( { score: 9 } ),
				new AssessmentResult( { score: 9 } ),
				new AssessmentResult( { score: 9 } ),
			];
			const expected = 0;

			const actual = contentAssessor.calculatePenaltyPoints();

			expect( actual ).toBe( expected );
		} );

		it( "should return 3 for a red assessment result", function() {
			contentAssessor._allAssessmentsSupported = function() {
				return true;
			};

			results = [
				new AssessmentResult( { score: 3 } ),
			];
			const expected = 3;

			const actual = contentAssessor.calculatePenaltyPoints();

			expect( actual ).toBe( expected );
		} );

		it( "should return 2 for an orange assessment result", function() {
			results = [
				new AssessmentResult( { score: 6 } ),
			];
			const expected = 2;

			const actual = contentAssessor.calculatePenaltyPoints();

			expect( actual ).toBe( expected );
		} );

		it( "should return an aggregate for a mixed resultset", function() {
			contentAssessor._allAssessmentsSupported = function() {
				return true;
			};
			results = [
				new AssessmentResult( { score: 9 } ),
				new AssessmentResult( { score: 6 } ),
				new AssessmentResult( { score: 3 } ),
				new AssessmentResult( { score: 9 } ),
				new AssessmentResult( { score: 6 } ),
				new AssessmentResult( { score: 3 } ),
				new AssessmentResult( { score: 6 } ),
				new AssessmentResult( { score: 9 } ),
				new AssessmentResult( { text: "A piece of feedback" } ),
			];

			// 2 bad scores (x3 points) and 3 ok scores (x2 points).
			const expected = 12;

			const actual = contentAssessor.calculatePenaltyPoints();

			expect( actual ).toBe( expected );
		} );
	} );

	describe( "calculateOverallScore for English", function() {
		let points, results, contentAssessor;

		beforeEach( function() {
			contentAssessor = new ContentAssessor( i18n );
			contentAssessor.getValidResults = function() {
				return results;
			};
			contentAssessor.calculatePenaltyPoints = function() {
				return points;
			};
			contentAssessor.getPaper = function() {
				return new Paper();
			};
		} );

		it( "should default to a bad indicator", function() {
			const expected = 30;
			results = [];

			const actual = contentAssessor.calculateOverallScore();

			expect( actual ).toBe( expected );
		} );

		it( "should give worse results based on the negative points", function() {
			results = [
				new AssessmentResult(),
				new AssessmentResult(),
			];
			const testCases = [
				{ points: 7, expected: 30 },
				{ points: 6, expected: 60 },
				{ points: 9, expected: 30 },
				{ points: 4, expected: 90 },
				{ points: 2, expected: 90 },
				{ points: 1.9, expected: 90 },
				{ points: 1, expected: 90 },
			];

			forEach( testCases, function( testCase ) {
				points = testCase.points;

				contentAssessor._allAssessmentsSupported = function() {
					return true;
				};

				const actual = contentAssessor.calculateOverallScore();

				expect( actual ).toBe( testCase.expected );
			} );
		} );
	} );

	describe( "calculateOverallScore for non English", function() {
		let points, results, contentAssessor;

		beforeEach( function() {
			contentAssessor = new ContentAssessor( i18n, { researcher: new DutchResearcher() } );
			contentAssessor.getValidResults = function() {
				return results;
			};
			contentAssessor.calculatePenaltyPoints = function() {
				return points;
			};
			contentAssessor.getPaper = function() {
				return new Paper( "", { locale: "nl_NL" } );
			};
		} );

		it( "should give worse results based on the negative points", function() {
			results = [
				new AssessmentResult(),
				new AssessmentResult(),
			];
			const testCases = [
				{ points: 6, expected: 30 },
				{ points: 4, expected: 60 },
				{ points: 3, expected: 60 },
				{ points: 2, expected: 90 },
			];

			forEach( testCases, function( testCase ) {
				points = testCase.points;

				const actual = contentAssessor.calculateOverallScore();

				expect( actual ).toBe( testCase.expected );
			} );
		} );
	} );

	describe( "Checks the applicable assessments", function() {
		const paper = new Paper( "test" );
		it( "Should have 8 available assessments for a fully supported language", function() {
			const contentAssessor = new ContentAssessor( i18n, new EnglishResearcher( paper ) );
			contentAssessor.getPaper = function() {
				return paper;
			};

			const actual = contentAssessor.getApplicableAssessments().length;
			const expected = 8;
			expect( actual ).toBe( expected );
		} );

		it( "Should have 4 available assessments for a basic supported language", function() {
			const contentAssessor = new ContentAssessor( i18n, new DefaultResearcher( paper ) );
			contentAssessor.getPaper = function() {
				return paper;
			};

			const actual = contentAssessor.getApplicableAssessments().length;
			const expected = 4;
			expect( actual ).toBe( expected );
		} );
	} );

	describe( "has configuration overrides", () => {
		const assessor = new ContentAssessor( i18n );

		test( "SubheadingsDistributionTooLong", () => {
			const assessment = assessor.getAssessment( "subheadingsTooLong" );

			expect( assessment ).toBeDefined();
			expect( assessment._config ).toBeDefined();
			expect( assessment._config.parameters ).toBeDefined();
			expect( assessment._config.parameters.recommendedMaximumWordCount ).toBe( 250 );
			expect( assessment._config.parameters.slightlyTooMany ).toBe( 250 );
			expect( assessment._config.parameters.farTooMany ).toBe( 300 );
		} );

		it( "should pass a 'true' value for the isCornerstone parameter in the SentenceLengthInTextAssessment", function() {
			const assessment = assessor.getAssessment( "textSentenceLength" );

			expect( assessment._isCornerstone ).toBeTruthy();
		} );
	} );
} );
