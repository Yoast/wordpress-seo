import PageTitleLengthAssessment from "../../../../src/scoring/assessments/seo/PageTitleWidthAssessment.js";
import Paper from "../../../../src/values/Paper.js";
import factory from "../../../specHelpers/factory.js";
const i18n = factory.buildJed();

const pageTitleLengthAssessment = new PageTitleLengthAssessment();

describe( "the SEO title length assessment", function() {
	it( "should assess a paper without an SEO title", function() {
		const paper = new Paper( "" );
		const result = pageTitleLengthAssessment.getResult( paper, factory.buildMockResearcher( 0 ), i18n );

		expect( result.getScore() ).toEqual( 1 );
		expect( result.getText() ).toEqual( "<a href='https://yoa.st/34h' target='_blank'>SEO title width</a>: " +
			"<a href='https://yoa.st/34i' target='_blank'>Please create an SEO title</a>." );
	} );

	it( "should assess a paper with an SEO title that's under the recommended value", function() {
		const paper = new Paper( "", { title: "The Title" } );
		const result = pageTitleLengthAssessment.getResult( paper, factory.buildMockResearcher( 9 ), i18n );
		expect( result.getScore() ).toEqual( 6 );
		expect( result.getText() ).toEqual( "<a href='https://yoa.st/34h' target='_blank'>SEO title width</a>: " +
			"The SEO title is too short. <a href='https://yoa.st/34i' target='_blank'>Use the space to add keyphrase variations " +
			"or create compelling call-to-action copy</a>." );
	} );

	it( "should assess a paper with an SEO title that's in range of the recommended value", function() {
		const paper = new Paper( "", { title: "The Title That Is At Least As Long As It Should Be To Pass" } );
		const result = pageTitleLengthAssessment.getResult( paper, factory.buildMockResearcher( 450 ), i18n );
		expect( result.getScore() ).toEqual( 9 );
		expect( result.getText() ).toEqual( "<a href='https://yoa.st/34h' target='_blank'>SEO title width</a>: Good job!" );
	} );

	it( "should assess a paper with an SEO title that's in range of the recommended value", function() {
		const paper = new Paper( "", { title: "The Title That Is At Least As Long As It Should Be To Pass" } );
		const result = pageTitleLengthAssessment.getResult( paper, factory.buildMockResearcher( 600 ), i18n );
		expect( result.getScore() ).toEqual( 9 );
		expect( result.getText() ).toEqual( "<a href='https://yoa.st/34h' target='_blank'>SEO title width</a>: Good job!" );
	} );

	it( "should assess a paper with an SEO title that's longer than the recommended value", function() {
		const paper = new Paper( "", { title: "The Title That Is Too Long Long To Pass" } );
		const result = pageTitleLengthAssessment.getResult( paper, factory.buildMockResearcher( 620 ), i18n );
		expect( result.getScore() ).toEqual( 3 );
		expect( result.getText() ).toEqual( "<a href='https://yoa.st/34h' target='_blank'>SEO title width</a>: " +
			"The SEO title is wider than the viewable limit. <a href='https://yoa.st/34i' target='_blank'>Try to make it shorter</a>." );
		expect( pageTitleLengthAssessment.getMaximumLength() ).toBe( 600 );
	} );
} );

describe( "test for SEO title width assessment when is used in product page analysis", function() {
	it( "assesses a paper from product page with short title width", function() {
		const paper = new Paper( "", { title: "Controversial: A tortie cat turns out to be the most beatiful cat a study claims" } );
		const config = {
			scores: {
				widthTooShort: 9,
			},
		};
		const result = new PageTitleLengthAssessment( config, true ).getResult( paper, factory.buildMockResearcher( 300 ), i18n );
		expect( result.getScore() ).toEqual( 9 );
		expect( result.getText() ).toEqual( "<a href='https://yoa.st/34h' target='_blank'>SEO title width</a>: Good job!" );
	} );

	it( "assesses a paper from product page with too long title width", function() {
		const paper = new Paper( "", { title: "Controversial: A tortie cat turns out to be the most beatiful cat a study claims" } );
		const config = {
			scores: {
				widthTooShort: 9,
			},
		};
		const result = new PageTitleLengthAssessment( config, true ).getResult( paper, factory.buildMockResearcher( 620 ), i18n );
		expect( result.getScore() ).toEqual( 3 );
		expect( result.getText() ).toEqual( "<a href='https://yoa.st/34h' target='_blank'>SEO title width</a>: " +
			"The SEO title is wider than the viewable limit. <a href='https://yoa.st/34i' target='_blank'>Try to make it shorter</a>." );
	} );
} );
