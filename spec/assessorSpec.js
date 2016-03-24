var Assessor = require( "../js/assessor.js" );
var Paper = require("../js/values/Paper.js");
var InvalidTypeError = require( "../js/errors/invalidType.js" );
var MissingArgument = require( "../js/errors/missingArgument" );

describe( "create an assessor", function(){
	it( "throws an error when no args are given", function(){
		expect( function() { new Assessor } ).toThrowError( InvalidTypeError );
	});
});
