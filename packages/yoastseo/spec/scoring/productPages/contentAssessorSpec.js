import EnglishResearcher from "../../../src/languageProcessing/languages/en/Researcher";
import DefaultResearcher from "../../../src/languageProcessing/languages/_default/Researcher";
import ContentAssessor from "../../../src/scoring/productPages/contentAssessor.js";
import Factory from "../../specHelpers/factory.js";
import Paper from "../../../src/values/Paper.js";

const i18n = Factory.buildJed();

describe( "A product page content assessor", function() {
	describe( "Checks the applicable assessments", function() {
		it( "Should have 6 available assessments for a fully supported language", function() {
			const paper = new Paper( "test", { locale: "en_US" } );
			const contentAssessor = new ContentAssessor( i18n, new EnglishResearcher( paper ) );

			contentAssessor.getPaper = function() {
				return paper;
			};
			const actual = contentAssessor.getApplicableAssessments().map( result => result.identifier );
			const expected = [
				"subheadingsTooLong",
				"textParagraphTooLong",
				"textSentenceLength",
				"textTransitionWords",
				"passiveVoice",
				"textPresence"
			];
			expect( actual ).toEqual( expected );
		} );

		it( "Should have 4 available assessments for a basic supported language", function() {
			const paper = new Paper( "test", { locale: "xx_XX" } );
			const contentAssessor = new ContentAssessor( i18n, new DefaultResearcher( paper ) );

			contentAssessor.getPaper = function() {
				return paper;
			};

			const actual = contentAssessor.getApplicableAssessments().map( result => result.identifier );
			const expected = [
				"subheadingsTooLong",
				"textParagraphTooLong",
				"textSentenceLength",
				"textPresence"
			];
			expect( actual ).toEqual( expected );
		} );
	} );
} );
