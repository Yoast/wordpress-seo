var Assessor = require( "../js/assessor.js" );
var Paper = require("../js/values/Paper.js");
var AssessmentResult = require( "../js/values/AssessmentResult.js" );
var MissingArgument = require( "../js/errors/missingArgument" );

var factory = require( "./helpers/factory.js" );
var i18n = factory.buildJed();

describe( "create an assessor", function() {
	it( "throws an error when no args are given", function() {
		expect( function() { new Assessor } ).toThrowError( MissingArgument );
	});

	it( "creates an assessor", function() {
		var mockPaper = new Paper( "text" );
		expect( new Assessor( i18n ) ).toBeDefined();
		expect( Object.keys( new Assessor( i18n ).getAvailableAssessments() ) ).toContain("wordCount");
		expect( Object.keys( new Assessor( i18n ).getAvailableAssessments() ) ).toContain("fleschReading");
	});
});

var assessor = new Assessor( i18n );

describe ( "running assessments in the assessor", function() {
	it( "runs assessments without any specific requirements", function() {
		assessor.assess( new Paper( "" ) );
		expect( assessor.getValidResults().length ).toBe( 5 );
	})

	it( "additionally runs assessments that only require a text", function() {
		assessor.assess( new Paper( "text" ) );
		expect( assessor.getValidResults().length ).toBe( 7 );
	})

	it( "additionally runs assessments that only require a keyword", function() {
		assessor.assess( new Paper( "text", { keyword: "keyword" } ) );
		expect( assessor.getValidResults().length ).toBe( 10 );
	})

	it( "additionally runs assessments that require text and a keyword", function() {
		assessor.assess( new Paper( "text", { keyword: "keyword" } ) );
		expect( assessor.getValidResults().length ).toBe( 10 );
	})

	it( "additionally runs assessments that require an url", function() {
		assessor.assess( new Paper( "text", { url: "sample url" } ) );
		expect( assessor.getValidResults().length ).toBe( 7 );
	})
});

var result5 = new AssessmentResult();
result5.setScore( 5 );
var result4 = new AssessmentResult();
result4.setScore( 4 );
var result8 = new AssessmentResult();
result8.setScore( 8 );

describe ( "returning the overallscore", function() {
	it ("returns the overallscore", function() {
		assessor.getValidResults = function() {
			return [
				result5,result4,result8
			]
		};
		expect( assessor.calculateOverallScore() ).toBe( 63 );
	})
} );
