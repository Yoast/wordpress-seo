import ListAssessment from "../../../../src/scoring/assessments/readability/ListAssessment";
import Paper from "../../../../src/values/Paper.js";
import Factory from "../../../specHelpers/factory.js";
const i18n = Factory.buildJed();

const listAssessment = new ListAssessment();

describe( "tests for the assessment applicability.", function() {
	it( "returns false when the paper is empty.", function() {
		const paper = new Paper( "" );
		expect( listAssessment.isApplicable( paper ) ).toBe( false );
	} );

	it( "returns true when the paper is not empty.", function() {
		const paper = new Paper( "sample keyword", {
			url: "sample-with-keyword",
			keyword: "kéyword",
		} );
		expect( listAssessment.isApplicable( paper ) ).toBe( true );
	} );
} );
