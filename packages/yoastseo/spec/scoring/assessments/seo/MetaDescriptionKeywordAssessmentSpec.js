import MetaDescriptionKeywordAssessment from "../../../../src/scoring/assessments/seo/MetaDescriptionKeywordAssessment";
import Paper from "../../../../src/values/Paper";
import Factory from "../../../specHelpers/factory";

const i18n = Factory.buildJed();

const mockResearcherNoMatches = Factory.buildMockResearcher( 0 );
const mockResearcherOneMatch = Factory.buildMockResearcher( 1 );
const mockResearcherTwoMatches = Factory.buildMockResearcher( 2 );
const mockResearcherThreeMatches = Factory.buildMockResearcher( 3 );

describe( "the metadescription keyword assessment", function() {
	it( "returns a bad result when the meta description doesn't contain the keyword", function() {
		const mockPaper = new Paper();
		const assessment = new MetaDescriptionKeywordAssessment().getResult( mockPaper, mockResearcherNoMatches, i18n );

		expect( assessment.getScore() ).toBe( 3 );
		expect( assessment.getText() ).toBe( "<a href='https://yoa.st/33k' target='_blank'>Keyphrase in meta description</a>: " +
			"The meta description has been specified, but it does not contain the keyphrase. " +
			"<a href='https://yoa.st/33l' target='_blank'>Fix that</a>!" );
	} );

	it( "returns a good result and an appropriate feedback message when at least one sentence contains every keyword term " +
		"at least once in the same sentence.", function() {
		const mockPaper = new Paper();
		const assessment = new MetaDescriptionKeywordAssessment().getResult( mockPaper, mockResearcherOneMatch, i18n );

		expect( assessment.getScore() ).toBe( 9 );
		expect( assessment.getText() ).toBe( "<a href='https://yoa.st/33k' target='_blank'>Keyphrase in meta description</a>: " +
			"Keyphrase or synonym appear in the meta description. Well done!" );
	} );

	it( "returns a good result and an appropriate feedback message when the meta description contains the keyword " +
		"two times in the same sentence", function() {
		const mockPaper = new Paper();
		const assessment = new MetaDescriptionKeywordAssessment().getResult( mockPaper, mockResearcherTwoMatches, i18n );

		expect( assessment.getScore() ).toBe( 9 );
		expect( assessment.getText() ).toBe( "<a href='https://yoa.st/33k' target='_blank'>Keyphrase in meta " +
			"description</a>: Keyphrase or synonym appear in the meta description. Well done!" );
	} );

	it( "returns a bad result when the meta description contains the keyword three times in the same sentence", function() {
		const mockPaper = new Paper();
		const assessment = new MetaDescriptionKeywordAssessment().getResult( mockPaper, mockResearcherThreeMatches, i18n );

		expect( assessment.getScore() ).toBe( 3 );
		expect( assessment.getText() ).toBe( "<a href='https://yoa.st/33k' target='_blank'>Keyphrase in meta " +
			"description</a>: The meta description contains the keyphrase 3 times, which is over the advised maximum " +
			"of 2 times. <a href='https://yoa.st/33l' target='_blank'>Limit that</a>!" );
	} );

	it( "is not applicable when the paper doesn't have a keyword", function() {
		const isApplicableResult = new MetaDescriptionKeywordAssessment().isApplicable( new Paper( "text", { description: "description" } ) );
		expect( isApplicableResult ).toBe( false );
	} );

	it( "is not applicable when the paper doesn't have a meta description", function() {
		const isApplicableResult = new MetaDescriptionKeywordAssessment().isApplicable( new Paper( "text", { keyword: "keyword" } ) );
		expect( isApplicableResult ).toBe( false );
	} );

	it( "is  applicable when the paper has a meta description and a keyword", function() {
		const isApplicableResult = new MetaDescriptionKeywordAssessment().isApplicable( new Paper( "text",
			{ keyword: "keyword", description: "description" } ) );
		expect( isApplicableResult ).toBe( true );
	} );
} );

