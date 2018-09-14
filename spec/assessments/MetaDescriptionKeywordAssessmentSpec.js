import MetaDescriptionKeywordAssessment from "../../src/assessments/seo/MetaDescriptionKeywordAssessment";
import Paper from "../../src/values/Paper";
import Factory from "../helpers/factory";

const i18n = Factory.buildJed();

const mockResearcherNoMatches = Factory.buildMockResearcher( { fullDescription: [ 0 ], perSentence: [ [ 0 ] ] } );
const mockResearcherOneMatch = Factory.buildMockResearcher( { fullDescription: [ 1 ], perSentence: [ [ 1 ] ] } );
const mockResearcherTwoMatches = Factory.buildMockResearcher( { fullDescription: [ 2 ], perSentence: [ [ 2 ] ] } );
const mockResearcherThreeMatches = Factory.buildMockResearcher( { fullDescription: [ 3 ], perSentence: [ [ 3 ] ] } );
const mockResearcherMatchesDescription = Factory.buildMockResearcher( { fullDescription: [ 1 ], perSentence: [ [ 0 ] ] } );

describe( "the metadescription keyword assessment", function() {
	it( "returns a bad result when the meta description doesn't contain the keyword", function() {
		const mockPaper = new Paper();
		const assessment = new MetaDescriptionKeywordAssessment().getResult( mockPaper, mockResearcherNoMatches, i18n );

		expect( assessment.getScore() ).toBe( 3 );
		expect( assessment.getText() ).toBe( "A meta description has been specified, " +
			"but it <a href='https://yoa.st/2pf' target='_blank'>does not contain the focus keyword</a>." );
	} );

	it( "returns a good result and an appropriate feedback message when at least one sentence contains every keyword term at least once in the same sentence.", function() {
		const mockPaper = new Paper();
		const assessment = new MetaDescriptionKeywordAssessment().getResult( mockPaper, mockResearcherOneMatch, i18n );

		expect( assessment.getScore() ).toBe( 9 );
		expect( assessment.getText() ).toBe( "The meta description <a href='https://yoa.st/2pf' target='_blank'>contains the focus keyword</a> in at least one sentence." );
	} );

	it( "returns a good result and an appropriate feedback message when the meta description contains the keyword two times in the same sentence", function() {
		const mockPaper = new Paper();
		const assessment = new MetaDescriptionKeywordAssessment().getResult( mockPaper, mockResearcherTwoMatches, i18n );

		expect( assessment.getScore() ).toBe( 9 );
		expect( assessment.getText() ).toBe( "The meta description <a href='https://yoa.st/2pf' target='_blank'>contains the focus keyword</a> in at least one sentence." );
	} );

	it( "returns an okay result when the meta description contains the keyword more than three times in the same sentence", function() {
		const mockPaper = new Paper();
		const assessment = new MetaDescriptionKeywordAssessment().getResult( mockPaper, mockResearcherThreeMatches, i18n );

		expect( assessment.getScore() ).toBe( 6 );
		expect( assessment.getText() ).toBe( "The meta description <a href='https://yoa.st/2pf' target='_blank'>contains the focus keyword</a>. Try adding all the keyword terms into one sentence to make it better." );
	} );

	it( "returns an okay result when the meta description contains the keyword one time, but not in the same sentence", function() {
		const mockPaper = new Paper();
		const assessment = new MetaDescriptionKeywordAssessment().getResult( mockPaper, mockResearcherMatchesDescription, i18n );

		expect( assessment.getScore() ).toBe( 6 );
		expect( assessment.getText() ).toBe( "The meta description <a href='https://yoa.st/2pf' target='_blank'>contains the focus keyword</a>. Try adding all the keyword terms into one sentence to make it better." );
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
		const isApplicableResult = new MetaDescriptionKeywordAssessment().isApplicable( new Paper( "text", { keyword: "keyword", description: "description" } ) );
		expect( isApplicableResult ).toBe( true );
	} );
} );

