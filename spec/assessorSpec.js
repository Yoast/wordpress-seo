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
		expect( Object.keys( new Assessor( i18n ).getAvailableAssessments() ) ).toEqual( [] );
	});
});

var assessor = new Assessor( i18n );

var result5 = new AssessmentResult();
result5.setScore( 5 );
var result4 = new AssessmentResult();
result4.setScore( 4 );
var result8 = new AssessmentResult();
result8.setScore( 8 );

describe ( "returning the overallscore", function() {
	it ("returns the overallscore", function() {
		assessor.getValidResults = function() {
			return [ result5, result4, result8 ]
		};
		expect( assessor.calculateOverallScore() ).toBe( 63 );
	})
} );

var mockAssessment = {
	callback: function(){ return true }
};

describe ( "adding an assessment", function() {
	it( "adds an assessment", function(){
		assessor.addAssessment( "testname", mockAssessment );
		expect( assessor.getAvailableAssessments()[ "testname" ] ).toEqual(jasmine.objectContaining( mockAssessment ) );
	});
} );

describe ( "removing an assessment", function() {
	it( "removes an assessment", function(){
		assessor.removeAssessment( "testname" );
		expect( assessor.getAvailableAssessments()[ "testname" ] ).toEqual( undefined );
	});
} );
