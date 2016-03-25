var Assessor = require( "../js/assessor.js" );
var Paper = require("../js/values/Paper.js");
var InvalidTypeError = require( "../js/errors/invalidType.js" );
var MissingArgument = require( "../js/errors/missingArgument" );

var factory = require( "./helpers/factory.js" );
var i18n = factory.buildJed();


describe( "create an assessor", function(){
	it( "throws an error when no args are given", function(){
		expect( function() { new Assessor } ).toThrowError( InvalidTypeError );
	});

	it( "creates an assessor", function(){
		var mockPaper = new Paper( "text" );
		expect( new Assessor( mockPaper, i18n ) ).toBeDefined();
		expect( Object.keys( new Assessor( mockPaper, i18n ).getAvailableAssessments() ) ).toContain("wordCount");
		expect( Object.keys( new Assessor( mockPaper, i18n ).getAvailableAssessments() ) ).toContain("fleschReading");
	});
});

var mockPaper = new Paper( "text" );
var assessor = new Assessor( mockPaper, i18n );

describe ( "running assessments in the assessor", function(){
	it( "runs assessments", function(){
		expect( assessor.executeAssessments().length ).toBe( 16 );
	})
});
