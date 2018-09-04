import SubheadingsKeywordAssessment from "../../src/assessments/seo/subheadingsKeywordAssessment.js";
import Paper from "../../src/values/Paper.js";
import Factory from "../helpers/factory.js";
var i18n = Factory.buildJed();

let matchKeywordAssessment = new SubheadingsKeywordAssessment();

describe( "An assessment for matching keywords in subheadings", function() {
	it( "assesses a string without subheadings", function() {
		var mockPaper = new Paper();
		var assessment = matchKeywordAssessment.getResult( mockPaper, Factory.buildMockResearcher( { count: 0 } ), i18n );

		expect( assessment.hasScore() ).toBe( false );
		expect( assessment.getScore() ).toEqual( 0 );
		expect( assessment.getText() ).toEqual( "" );
	} );
	it( "assesses a string with subheadings without keywords", function() {
		var mockPaper = new Paper();
		var assessment = matchKeywordAssessment.getResult( mockPaper, Factory.buildMockResearcher( { count: 1, matches: 0 } ), i18n );

		expect( assessment.getScore() ).toEqual( 6 );
		expect( assessment.getText() ).toEqual( "You have not used the focus keyword in any <a href='https://yoa.st/2ph' target='_blank'>subheading</a> (such as an H2) in your copy." );
	} );
	it( "assesses a string with subheadings and keywords", function() {
		var mockPaper = new Paper();
		var assessment = matchKeywordAssessment.getResult( mockPaper, Factory.buildMockResearcher( { count: 1, matches: 1 } ), i18n );

		expect( assessment.getScore() ).toEqual( 9 );
		expect( assessment.getText() ).toEqual( "The focus keyword appears in 1 (out of 1) <a href='https://yoa.st/2ph' target='_blank'>subheadings</a> in your copy." );
	} );
	it( "assesses a string with subheadings and keywords", function() {
		var mockPaper = new Paper();
		var assessment = matchKeywordAssessment.getResult( mockPaper, Factory.buildMockResearcher( { count: 10, matches: 1 } ), i18n );

		expect( assessment.getScore() ).toEqual( 9 );
		expect( assessment.getText() ).toEqual( "The focus keyword appears in 1 (out of 10) <a href='https://yoa.st/2ph' target='_blank'>subheadings</a> in your copy." );
	} );
} );
