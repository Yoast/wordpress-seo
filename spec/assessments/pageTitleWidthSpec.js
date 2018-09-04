import PageTitleLengthAssessment from "../../src/assessments/seo/pageTitleWidthAssessment.js";
import Paper from "../../src/values/Paper.js";
import factory from "../helpers/factory.js";
var i18n = factory.buildJed();

let pageTitleLengthAssessment = new PageTitleLengthAssessment();

describe( "the SEO title length assessment", function() {
	it( "should assess a paper without a <a href='https://yoa.st/2po' target='_blank'>SEO title</a>", function() {
		var paper = new Paper( "" );
		var result = pageTitleLengthAssessment.getResult( paper, factory.buildMockResearcher( 0 ), i18n );

		expect( result.getScore() ).toEqual( 1 );
		expect( result.getText() ).toEqual( "Please create an <a href='https://yoa.st/2po' target='_blank'>SEO title</a>." );
	} );

	it( "should assess a paper with a SEO title that's under the recommended value", function() {
		var paper = new Paper( "", { title: "The Title" } );
		var result = pageTitleLengthAssessment.getResult( paper, factory.buildMockResearcher( 9 ), i18n );
		expect( result.getScore() ).toEqual( 6 );
		expect( result.getText() ).toEqual( "The <a href='https://yoa.st/2po' target='_blank'>SEO title</a> is too short. Use the space to add keyword variations or create compelling call-to-action copy." );
	} );

	it( "should assess a paper with a SEO title that's in range of the recommended value", function() {
		var paper = new Paper( "", { title: "The Title That Is At Least As Long As It Should Be To Pass" } );
		var result = pageTitleLengthAssessment.getResult( paper, factory.buildMockResearcher( 450 ), i18n );
		expect( result.getScore() ).toEqual( 9 );
		expect( result.getText() ).toEqual( "The <a href='https://yoa.st/2po' target='_blank'>SEO title</a> has a nice length." );
	} );

	it( "should assess a paper with a SEO title that's in range of the recommended value", function() {
		var paper = new Paper( "", { title: "The Title That Is At Least As Long As It Should Be To Pass" } );
		var result = pageTitleLengthAssessment.getResult( paper, factory.buildMockResearcher( 600 ), i18n );
		expect( result.getScore() ).toEqual( 9 );
		expect( result.getText() ).toEqual( "The <a href='https://yoa.st/2po' target='_blank'>SEO title</a> has a nice length." );
	} );

	it( "should assess a paper with a SEO title that's longer than the recommended value", function() {
		var paper = new Paper( "", { title: "The Title That Is Too Long Long To Pass" } );
		var result = pageTitleLengthAssessment.getResult( paper, factory.buildMockResearcher( 620 ), i18n );
		expect( result.getScore() ).toEqual( 3 );
		expect( result.getText() ).toEqual( "The <a href='https://yoa.st/2po' target='_blank'>SEO title</a> is wider than the viewable limit." );
	} );
} );
