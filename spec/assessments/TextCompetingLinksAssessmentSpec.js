import TextCompetingLinksAssessment from "../../js/assessments/seo/TextCompetingLinksAssessment";
const Mark = require( "../../js/values/Mark" );
const Paper = require( "../../js/values/Paper" );
const Factory = require( "../helpers/factory" );

const i18n = Factory.buildJed();

describe( "An assessment for competing links in the text", function() {
	it( "returns a 'bad' score if a paper is referring to another paper with the same keyword", function() {
		const paper = new Paper( "This is a very interesting paper", { keyword: "some keyword" } );
		const result = new TextCompetingLinksAssessment().getResult(
			paper,
			Factory.buildMockResearcher(
				{
					total: 0,
					totalNaKeyword: 0,
					keyword: {
						totalKeyword: 1,
						matchedAnchors: [],
					},
					internalTotal: 0,
					internalDofollow: 0,
					internalNofollow: 0,
					externalTotal: 0,
					externalDofollow: 0,
					externalNofollow: 0,
					otherTotal: 0,
					otherDofollow: 0,
					otherNofollow: 0,
				}
			),
			i18n
		);

		expect( result.getScore() ).toBe( 2 );
		expect( result.getText() ).toBe( "You're <a href='https://yoa.st/2pi' target='_blank'>linking to another page " +
			"with the focus keyword</a> you want this page to rank for. " +
			"Consider changing that if you truly want this page to rank." );
	} );

	it( "is not applicable for papers without text", function() {
		const isApplicableResult = new TextCompetingLinksAssessment().isApplicable( new Paper( "", { keyword: "some keyword" } ) );
		expect( isApplicableResult ).toBe( false );
	} );

	it( "is not applicable for papers without keyword", function() {
		const isApplicableResult = new TextCompetingLinksAssessment().isApplicable( new Paper( "some text", { keyword: "" } ) );
		expect( isApplicableResult ).toBe( false );
	} );

	it( "is not applicable for papers without keyword and text", function() {
		const isApplicableResult = new TextCompetingLinksAssessment().isApplicable( new Paper( "", { keyword: "" } ) );
		expect( isApplicableResult ).toBe( false );
	} );
} );

describe( "A test for marking competing links", function() {
	it( "returns markers for links to posts that rank for the same keyword", function() {
		let paper = new Paper( "some text", { keyword: "some keyword" } );
		const result = new TextCompetingLinksAssessment().getResult(
			paper,
			Factory.buildMockResearcher(
				{
					total: 0,
					totalNaKeyword: 0,
					keyword: {
						totalKeyword: 1,
						matchedAnchors: [ "http://www.mywebsite.com/competing_content" ],
					},
					internalTotal: 0,
					internalDofollow: 0,
					internalNofollow: 0,
					externalTotal: 0,
					externalDofollow: 0,
					externalNofollow: 0,
					otherTotal: 0,
					otherDofollow: 0,
					otherNofollow: 0,
				}
			),
			i18n
		);

		let expected = [
			new Mark( { original: "http://www.mywebsite.com/competing_content", marked: "<yoastmark class='yoast-text-mark'>http://www.mywebsite.com/competing_content</yoastmark>" } ),
		];
		expect( result._marker ).toEqual( expected );
	} );
} );
