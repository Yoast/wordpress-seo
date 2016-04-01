var Pluggable = require( "../js/pluggable" );

var InvalidTypeError = require( "../js/errors/invalidType" );

var Assessor = require( "../js/assessor.js" );

var factory = require( "./helpers/factory.js" );
var i18n = factory.buildJed();

describe( "the pluggable interface", function() {
	var app, pluggable;

	describe( "adding an assessment", function() {
		beforeEach( function() {
			app = {
				updateLoadingDialog: function() {}
			};
			pluggable = new Pluggable( app );
			pluggable._registerPlugin( "test-plugin" );
		});

		it( "should throw an error on adding an invalid assessment", function() {
			expect( function() { pluggable._registerAssessment( false ) } ).toThrowError( InvalidTypeError );
			expect( function() { pluggable._registerAssessment( "name", false ) } ).toThrowError( InvalidTypeError );
			expect( function() { pluggable._registerAssessment( "name", function() {}, false ) } ).toThrowError( InvalidTypeError );
		});

		it( "should be able to add an assessment", function() {
			var assessor = new Assessor( i18n);
			expect( pluggable._registerAssessment( assessor, "name", function() {}, "test-plugin" ) ).toEqual( true );
		})
	});
});
