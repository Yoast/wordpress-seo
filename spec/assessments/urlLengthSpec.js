import UrlLengthAssessment from "../../src/assessments/seo/urlLengthAssessment.js";
import Paper from "../../src/values/Paper.js";
import factory from "../specHelpers/factory.js";
var i18n = factory.buildJed();

let urlLengthAssessment = new UrlLengthAssessment();

describe( "An assessment for the urlLengthAssessment", function() {
	it( "runs the url length assessment on the paper", function() {
		var paper = new Paper();
		var result = urlLengthAssessment.getResult( paper, factory.buildMockResearcher( true ), i18n );

		expect( result.score ).toBe( 6 );
		expect( result.text ).toBe( "The slug for this page is a bit long, consider shortening it." );

		var paper = new Paper();
		var result = urlLengthAssessment.getResult( paper, factory.buildMockResearcher( false ), i18n );

		expect( result.score ).toBe( 0 );
	} );
} );
