import MetaDescriptionLengthAssessment from '../../src/assessments/seo/metaDescriptionLengthAssessment.js';
import Paper from '../../src/values/Paper.js';
import Factory from '../helpers/factory.js';
var i18n = Factory.buildJed();

let descriptionLengthAssessment = new MetaDescriptionLengthAssessment();

describe( "An descriptionLength assessment", function() {
	it( "assesses an empty description", function() {
		var mockPaper = new Paper();
		var assessment = descriptionLengthAssessment.getResult( mockPaper, Factory.buildMockResearcher( 0 ), i18n );

		expect( assessment.getScore() ).toEqual( 1 );
		expect( assessment.getText() ).toEqual( "No <a href='https://yoa.st/2pg' target='_blank'>meta description</a> has been specified. Search engines will display copy from the page instead." );
	} );

	it( "assesses a short description", function() {
		var mockPaper = new Paper();
		var assessment = descriptionLengthAssessment.getResult( mockPaper, Factory.buildMockResearcher( 20 ), i18n );

		expect( assessment.getScore() ).toEqual( 6 );
		expect( assessment.getText() ).toEqual( "The <a href='https://yoa.st/2pg' target='_blank'>meta description</a> is under 120 characters long. However, up to 156 characters are available." );
	} );

	it( "assesses a too long description", function() {
		var mockPaper = new Paper();
		var assessment = descriptionLengthAssessment.getResult( mockPaper, Factory.buildMockResearcher( 400 ), i18n );

		expect( assessment.getScore() ).toEqual( 6 );
		expect( assessment.getText() ).toEqual( "The <a href='https://yoa.st/2pg' target='_blank'>meta description</a> is over 156 characters. Reducing the length will ensure the entire description will be visible." );
	} );

	it( "assesses a good description", function() {
		var mockPaper = new Paper();
		var assessment = descriptionLengthAssessment.getResult( mockPaper, Factory.buildMockResearcher( 140 ), i18n );

		expect( assessment.getScore() ).toEqual( 9 );
		expect( assessment.getText() ).toEqual( "The <a href='https://yoa.st/2pg' target='_blank'>meta description</a> has a nice length." );
	} );
} );
