var Assessor = require( "../js/seoAssessor.js" );
var Paper = require("../js/values/Paper.js");
var AssessmentResult = require( "../js/values/AssessmentResult.js" );

var factory = require( "./helpers/factory.js" );
var i18n = factory.buildJed();

var assessor = new Assessor( i18n );

describe ( "running assessments in the assessor", function() {
	it( "runs assessments without any specific requirements", function() {
		assessor.assess( new Paper( "" ) );
		expect( assessor.getValidResults().length ).toBe( 4 );
	});

	it( "additionally runs assessments that only require a text", function() {
		assessor.assess( new Paper( "text" ) );
		expect( assessor.getValidResults().length ).toBe( 6 );
	});

	it( "additionally runs assessments that only require a keyword", function() {
		assessor.assess( new Paper( "text", { keyword: "keyword" } ) );
		expect( assessor.getValidResults().length ).toBe( 7 );
	});

	it( "additionally runs assessments that require text and a keyword", function() {
		assessor.assess( new Paper( "text", { keyword: "keyword" } ) );
		expect( assessor.getValidResults().length ).toBe( 7 );
	});

	it( "additionally runs assessments that require an url", function() {
		assessor.assess( new Paper( "text", { url: "sample url" } ) );
		expect( assessor.getValidResults().length ).toBe( 6 );
	});
});
