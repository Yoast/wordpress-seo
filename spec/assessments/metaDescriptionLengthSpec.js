import MetaDescriptionLengthAssessment from "../../src/assessments/seo/metaDescriptionLengthAssessment.js";
import Paper from "../../src/values/Paper.js";
import Factory from "../specHelpers/factory.js";
var i18n = Factory.buildJed();

let descriptionLengthAssessment = new MetaDescriptionLengthAssessment();

describe( "An descriptionLength assessment", function() {
	it( "assesses an empty description", function() {
		var mockPaper = new Paper();
		var assessment = descriptionLengthAssessment.getResult( mockPaper, Factory.buildMockResearcher( 0 ), i18n );

		expect( assessment.getScore() ).toEqual( 1 );
		expect( assessment.getText() ).toEqual( "<a href='https://yoa.st/34d' target='_blank'>Meta description length</a>:  No meta description has been specified. " +
			"Search engines will display copy from the page instead. <a href='https://yoa.st/34e' target='_blank'>Make sure to write one</a>!" );
	} );

	it( "assesses a short description", function() {
		var mockPaper = new Paper();
		var assessment = descriptionLengthAssessment.getResult( mockPaper, Factory.buildMockResearcher( 20 ), i18n );

		expect( assessment.getScore() ).toEqual( 6 );
		expect( assessment.getText() ).toEqual( "<a href='https://yoa.st/34d' target='_blank'>Meta description length</a>: " +
			"The meta description is too short (under 120 characters). Up to 156 characters are available. <a href='https://yoa.st/34e' target='_blank'>Use the space</a>!" );
	} );

	it( "assesses a too long description", function() {
		var mockPaper = new Paper();
		var assessment = descriptionLengthAssessment.getResult( mockPaper, Factory.buildMockResearcher( 400 ), i18n );

		expect( assessment.getScore() ).toEqual( 6 );
		expect( assessment.getText() ).toEqual( "<a href='https://yoa.st/34d' target='_blank'>Meta description length</a>: " +
			"The meta description is over 156 characters. To ensure the entire description will be visible, <a href='https://yoa.st/34e' target='_blank'>you should reduce the length</a>!" );
	} );

	it( "assesses a good description", function() {
		var mockPaper = new Paper();
		var assessment = descriptionLengthAssessment.getResult( mockPaper, Factory.buildMockResearcher( 140 ), i18n );

		expect( assessment.getScore() ).toEqual( 9 );
		expect( assessment.getText() ).toEqual( "<a href='https://yoa.st/34d' target='_blank'>Meta description length</a>: Well done!" );
	} );
} );
