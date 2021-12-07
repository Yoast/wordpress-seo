import MetaDescriptionLengthAssessment from "../../../../src/scoring/assessments/seo/MetaDescriptionLengthAssessment.js";
import Paper from "../../../../src/values/Paper.js";
import Factory from "../../../specHelpers/factory.js";

const descriptionLengthAssessment = new MetaDescriptionLengthAssessment();

describe( "the meta description length assessment", function() {
	it( "assesses an empty description", function() {
		const mockPaper = new Paper();
		const assessment = descriptionLengthAssessment.getResult( mockPaper, Factory.buildMockResearcher( 0 ) );

		expect( assessment.getScore() ).toEqual( 1 );
		expect( assessment.getText() ).toEqual( "<a href='https://yoa.st/34d' target='_blank'>Meta description length" +
			"</a>:  No meta description has been specified. Search engines will display copy from the page instead. " +
			"<a href='https://yoa.st/34e' target='_blank'>Make sure to write one</a>!" );
	} );

	it( "assesses a short description", function() {
		const mockPaper = new Paper();
		const assessment = descriptionLengthAssessment.getResult( mockPaper, Factory.buildMockResearcher( 20 ) );

		expect( assessment.getScore() ).toEqual( 6 );
		expect( assessment.getText() ).toEqual( "<a href='https://yoa.st/34d' target='_blank'>Meta description length</a>: " +
			"The meta description is too short (under 120 characters). Up to 156 characters are available. " +
			"<a href='https://yoa.st/34e' target='_blank'>Use the space</a>!" );
	} );

	it( "assesses a too long description", function() {
		const mockPaper = new Paper();
		const assessment = descriptionLengthAssessment.getResult( mockPaper, Factory.buildMockResearcher( 400 ) );

		expect( assessment.getScore() ).toEqual( 6 );
		expect( descriptionLengthAssessment.getMaximumLength() ).toEqual( 156 );
		expect( assessment.getText() ).toEqual( "<a href='https://yoa.st/34d' target='_blank'>Meta description length</a>: " +
			"The meta description is over 156 characters. To ensure the entire description will be visible, " +
			"<a href='https://yoa.st/34e' target='_blank'>you should reduce the length</a>!" );
	} );

	it( "assesses a good description", function() {
		const mockPaper = new Paper();
		const assessment = descriptionLengthAssessment.getResult( mockPaper, Factory.buildMockResearcher( 140 ) );

		expect( assessment.getScore() ).toEqual( 9 );
		expect( assessment.getText() ).toEqual( "<a href='https://yoa.st/34d' target='_blank'>Meta description length</a>: Well done!" );
	} );
} );
