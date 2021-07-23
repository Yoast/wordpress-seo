import DefaultResearcher from "../../../../src/languageProcessing/languages/_default/Researcher";
import EnglishResearcher from "../../../../src/languageProcessing/languages/en/Researcher";
import ContentAssessor from "../../../../src/scoring/productPages/cornerstone/contentAssessor";
import Paper from "../../../../src/values/Paper";
import Factory from "../../../specHelpers/factory";

const i18n = Factory.buildJed();

describe( "A cornerstone product page content assessor", function() {
	describe( "Checks the applicable assessments", function() {
		const paper = new Paper( "test" );
		it( "Should have 8 available assessments for a fully supported language", function() {
			const contentAssessor = new ContentAssessor( i18n, new EnglishResearcher( paper ) );
			contentAssessor.getPaper = function() {
				return paper;
			};

			const actual = contentAssessor.getApplicableAssessments().length;
			const expected = 6;
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
