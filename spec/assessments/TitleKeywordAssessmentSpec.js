import TitleKeywordAssessment from "../../src/assessments/seo/TitleKeywordAssessment";
const Paper = require( "../../js/values/Paper" );
const Factory = require( "../helpers/factory" );

const i18n = Factory.buildJed();

describe( "an assessment to check if the keyword is in the pageTitle", function() {
	it( "returns an assementresult with keyword not found", function() {
		const paper = new Paper( "", {
			keyword: "keyword",
			title: "a non-empty title",
		} );
		const assessment = new TitleKeywordAssessment().getResult(
			paper,
			Factory.buildMockResearcher( { exactMatch: false, allWordsFound: false, position: -1 } ),
			i18n );

		expect( assessment.getScore() ).toBe( 2 );
		expect( assessment.getText() ).toBe(
			"The focus keyword 'keyword' does not appear in the <a href='https://yoa.st/2pn' target='_blank'>SEO title</a>."
		);
	} );

	it( "returns an assementresult with an exact match of the keyword found at start", function() {
		const paper = new Paper( "", {
			keyword: "keyword",
			title: "keyword and the rest of this non-empty title",
		} );
		const assessment = new TitleKeywordAssessment().getResult(
			paper,
			Factory.buildMockResearcher( { exactMatch: true, allWordsFound: true, position: 0 } ),
			i18n );

		expect( assessment.getScore() ).toBe( 9 );
		expect( assessment.getText() ).toBe(
			"The exact match of the focus keyphrase appears at the beginning of " +
			"the <a href='https://yoa.st/2pn' target='_blank'>SEO title</a>, which is considered to improve rankings."
		);
	} );

	it( "returns an assementresult with an exact match of the keyword found not at start", function() {
		const paper = new Paper( "", {
			keyword: "keyword",
			title: "the rest of this non-empty title and the keyword",
		} );
		const assessment = new TitleKeywordAssessment().getResult(
			paper,
			Factory.buildMockResearcher( { exactMatch: true, allWordsFound: true, position: 41 } ),
			i18n );

		expect( assessment.getScore() ).toBe( 6 );
		expect( assessment.getText() ).toBe(
			"The exact match of the focus keyphrase appears in the <a href='https://yoa.st/2pn' target='_blank'>SEO title</a>, " +
			"but not at the beginning; try and move it to the beginning."
		);
	} );

	it( "returns an assementresult with keyword found at start", function() {
		const paper = new Paper( "", {
			keyword: "keyword",
			title: "a non-empty title",
		} );
		const assessment = new TitleKeywordAssessment().getResult(
			paper,
			Factory.buildMockResearcher( { exactMatch: false, allWordsFound: true, position: -1 } ),
			i18n );

		expect( assessment.getScore() ).toBe( 6 );
		expect( assessment.getText() ).toBe(
			"The <a href='https://yoa.st/2pn' target='_blank'>SEO title</a> contains " +
			"all words from the focus keyphrase, but not its exact match."
		);
	} );

	it( "returns false isApplicable for a paper without title", function() {
		const isApplicableResult = new TitleKeywordAssessment().isApplicable( new Paper( "", { keyword: "some keyword", title: "" } ) );
		expect( isApplicableResult ).toBe( false );
	} );

	it( "returns false isApplicable for a paper without keyword", function() {
		const isApplicableResult = new TitleKeywordAssessment().isApplicable( new Paper( "", { keyword: "", title: "some title" } ) );
		expect( isApplicableResult ).toBe( false );
	} );
} );
