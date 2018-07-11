const MetaDescriptionKeywordAssessment = require( "../../js/assessments/seo/metaDescriptionKeywordAssessment.js" );
const Paper = require( "../../js/values/Paper.js" );

const factory = require( "../helpers/factory.js" );
const i18n = factory.buildJed();

let descriptionKeywordAssessment = new MetaDescriptionKeywordAssessment();

describe( "the metadescription keyword assessment", function() {
	it( "returns a bad result when the meta description doesn't contain the keyword", function() {
		const mockPaper = new Paper();
		const assessment = descriptionKeywordAssessment.getResult( mockPaper, factory.buildMockResearcher( 0 ), i18n );

		expect( assessment.getScore() ).toBe( 3 );
		expect( assessment.getText() ).toBe( "A meta description has been specified, " +
			"but it <a href='https://yoa.st/2pf' target='_blank'>does not contain the focus keyword</a>." );
	} );

	it( "returns a good result and an appropriate feedback message when the meta description contains the keyword once", function() {
		const mockPaper = new Paper();
		const assessment = descriptionKeywordAssessment.getResult( mockPaper, factory.buildMockResearcher( 1 ), i18n );

		expect( assessment.getScore() ).toBe( 9 );
		expect( assessment.getText() ).toBe( "The meta description <a href='https://yoa.st/2pf' target='_blank'>contains the focus keyword</a>." +
			" That's great." );
	} );

	it( "returns a good result and an appropriate feedback message when the meta description contains the keyword two times", function() {
		const mockPaper = new Paper();
		const assessment = descriptionKeywordAssessment.getResult( mockPaper, factory.buildMockResearcher( 2 ), i18n );

		expect( assessment.getScore() ).toBe( 9 );
		expect( assessment.getText() ).toBe( "The meta description <a href='https://yoa.st/2pf' target='_blank'>contains the focus keyword 2 times</a>. " +
			"That's great." );
	} );

	it( "returns a good result when the meta description contains the keyword more than two times", function() {
		const mockPaper = new Paper();
		const assessment = descriptionKeywordAssessment.getResult( mockPaper, factory.buildMockResearcher( 3 ), i18n );

		expect( assessment.getScore() ).toBe( 9 );
		expect( assessment.getText() ).toBe( "The meta description <a href='https://yoa.st/2pf' target='_blank'>contains the focus keyword 3 times</a>. " +
			"That's great." );
	} );

	it( "is not applicable when the paper doesn't have a keyword", function() {
		const isApplicableResult = descriptionKeywordAssessment.isApplicable( new Paper( "text", { description: "description" } ) );
		expect( isApplicableResult ).toBe( false );
	} );

	it( "is not applicable when the paper doesn't have a meta description", function() {
		const isApplicableResult = descriptionKeywordAssessment.isApplicable( new Paper( "text", { keyword: "keyword" } ) );
		expect( isApplicableResult ).toBe( false );
	} );

	it( "is  applicable when the paper has a meta description and a keyword", function() {
		const isApplicableResult = descriptionKeywordAssessment.isApplicable( new Paper( "text", { keyword: "keyword", description: "description" } ) );
		expect( isApplicableResult ).toBe( true );
	} );
} );

