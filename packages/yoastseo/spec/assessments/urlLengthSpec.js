import UrlLengthAssessment from "../../src/assessments/seo/UrlLengthAssessment.js";
import Paper from "../../src/values/Paper.js";
import factory from "../specHelpers/factory.js";
var i18n = factory.buildJed();

const urlLengthAssessment = new UrlLengthAssessment();

describe( "An assessment for the urlLengthAssessment", function() {
	it( "runs the url length assessment on the paper", function() {
		var paper = new Paper();
		var result = urlLengthAssessment.getResult( paper, factory.buildMockResearcher( true ), i18n );

		expect( result.score ).toBe( 6 );
		expect( result.text ).toBe( "<a href='https://yoa.st/35b' target='_blank'>Slug too long</a>: " +
			"the slug for this page is a bit long. <a href='https://yoa.st/35c' target='_blank'>Shorten it</a>!" );

		var paper = new Paper();
		var result = urlLengthAssessment.getResult( paper, factory.buildMockResearcher( false ), i18n );

		expect( result.score ).toBe( 0 );
	} );
} );
