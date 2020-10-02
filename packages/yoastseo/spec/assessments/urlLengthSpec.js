import UrlLengthAssessment from "../../src/languages/legacy/assessments/seo/UrlLengthAssessment.js";
import Paper from "../../src/values/Paper.js";
import factory from "../specHelpers/factory.js";
var i18n = factory.buildJed();

describe( "An assessment for the urlLengthAssessment", function() {
	beforeEach( () => {
		console.warn = jest.fn();
	} );

	it( "runs the url length assessment on the paper", function() {
		const urlLengthAssessment = new UrlLengthAssessment();

		let paper = new Paper();
		let result = urlLengthAssessment.getResult( paper, factory.buildMockResearcher( true ), i18n );

		expect( result.score ).toBe( 6 );
		expect( result.text ).toBe( "<a href='https://yoa.st/35b' target='_blank'>Slug too long</a>: " +
			"the slug for this page is a bit long. <a href='https://yoa.st/35c' target='_blank'>Shorten it</a>!" );

		paper = new Paper();
		result = urlLengthAssessment.getResult( paper, factory.buildMockResearcher( false ), i18n );

		expect( result.score ).toBe( 0 );
	} );

	it( "logs a deprecation warning when the assessment is made.", () => {
		const urlLengthAssessment = new UrlLengthAssessment();
		const paper = new Paper();
		urlLengthAssessment.getResult( paper, factory.buildMockResearcher( true ), i18n );
		expect( console.warn ).toBeCalled();
	} );
} );
