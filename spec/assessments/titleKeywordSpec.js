const PageTitleKeywordAssessment = require( "../../js/assessments/seo/titleKeywordAssessment.js" );
const Paper = require( "../../js/values/Paper.js" );
const Factory = require( "../helpers/factory.js" );
const i18n = Factory.buildJed();

describe( "an assessment to check if the keyword is in the pageTitle", function() {
	it( "returns an assementresult with keyword not found", function() {
		const paper = new Paper( "", {
			keyword: "keyword",
			title: "a non-empty title",
		} );
		const assessment = new PageTitleKeywordAssessment().getResult( paper, Factory.buildMockResearcher( { matches: 0 } ), i18n );

		expect( assessment.getScore() ).toBe( 2 );
		expect( assessment.getText() ).toBe( "The focus keyword 'keyword' does not appear in the <a href='https://yoa.st/2pn' target='_blank'>SEO title</a>." );
	} );

	it( "returns an assementresult with keyword found at start", function() {
		const paper = new Paper( "", {
			keyword: "keyword",
			title: "a non-empty title",
		} );
		const assessment = new PageTitleKeywordAssessment().getResult( paper, Factory.buildMockResearcher( { matches: 1, position: 0 } ), i18n );

		expect( assessment.getScore() ).toBe( 9 );
		expect( assessment.getText() ).toBe( "The <a href='https://yoa.st/2pn' target='_blank'>SEO title</a> contains the focus keyword, at the beginning which is considered to improve rankings." );
	} );

	it( "returns an assementresult with keyword found at start", function() {
		const paper = new Paper( "", {
			keyword: "keyword",
			title: "a non-empty title",
		} );
		const assessment = new PageTitleKeywordAssessment().getResult( paper, Factory.buildMockResearcher( { matches: 1, position: 2 } ), i18n );

		expect( assessment.getScore() ).toBe( 6 );
		expect( assessment.getText() ).toBe( "The <a href='https://yoa.st/2pn' target='_blank'>SEO title</a> contains the focus keyword, but it does not appear at the beginning; try and move it to the beginning." );
	} );

	it( "returns false isApplicable for a paper without title", function() {
		const isApplicableResult = new PageTitleKeywordAssessment().isApplicable( new Paper( "", { keyword: "some keyword", title: "" } ) );
		expect( isApplicableResult ).toBe( false );
	} );

	it( "returns false isApplicable for a paper without keyword", function() {
		const isApplicableResult = new PageTitleKeywordAssessment().isApplicable( new Paper( "", { keyword: "", title: "some title" } ) );
		expect( isApplicableResult ).toBe( false );
	} );
} );
