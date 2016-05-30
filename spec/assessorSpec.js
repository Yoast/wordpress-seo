var Assessor = require( "../js/assessor.js" );
var Paper = require("../js/values/Paper.js");
var AssessmentResult = require( "../js/values/AssessmentResult.js" );
var MissingArgument = require( "../js/errors/missingArgument" );

var factory = require( "./helpers/factory.js" );
var i18n = factory.buildJed();

describe( "an assessor object", function() {

	describe( "create an assessor", function () {
		it( "throws an error when no args are given", function () {
			expect( function () {
				new Assessor
			} ).toThrowError( MissingArgument );
		} );

		it( "creates an assessor", function () {
			var mockPaper = new Paper( "text" );
			expect( new Assessor( i18n ) ).toBeDefined();
			expect( Object.keys( new Assessor( i18n ).getAvailableAssessments() ) ).toEqual( [] );
		} );
	} );

	var assessor = new Assessor( i18n );

	var result5 = new AssessmentResult();
	result5.setScore( 5 );
	var result4 = new AssessmentResult();
	result4.setScore( 4 );
	var result8 = new AssessmentResult();
	result8.setScore( 8 );

	var validResult = new AssessmentResult();
	validResult.setScore( 9 );
	validResult.setText( "all good" );
	validResult.setShouldMark( true );

	describe( "returning the overallscore", function () {
		it( "returns the overallscore", function () {
			assessor.getValidResults = function () {
				return [ result5, result4, result8 ]
			};
			expect( assessor.calculateOverallScore() ).toBe( 63 );
		} );
	} );

	var mockAssessment = {
		callback: function () {
			return true
		}
	};

	describe( "adding an assessment", function () {
		it( "adds an assessment", function () {
			assessor.addAssessment( "testname", mockAssessment );

			var result = assessor.getAssessment( "testname" );

			expect( result ).toEqual( mockAssessment );
		} );
	} );

	describe( "removing an assessment", function () {
		it( "removes an assessment", function () {
			assessor.removeAssessment( "testname" );

			var result = assessor.getAssessment( "testname" );

			expect( result ).toEqual( undefined );
		} );
	} );

	describe( "assess", function() {
		it( "should add the marker to the assessment result", function() {
			var paper = new Paper();
			var assessor = new Assessor( i18n, { marker: function() {} } );
			var assessment = { getResult: function() { return validResult; }, isApplicable: function() { return true; }, getMarks: function() {} };

			assessor.addAssessment( "test1", assessment );

			assessor.assess( paper );
			var results = assessor.getValidResults();
			
			expect( results[0].hasMarker() ).toBe( true );
		});
	});

	describe( "hasMarker", function() {
		var assessor;

		beforeEach( function() {
			assessor = new Assessor( i18n, {} );
		});

		it( "should return true when we have a global marker and a getMarks function", function() {
			var assessment = { getMarks: function() {} };
			assessor._options.marker = function() {};

			expect( assessor.hasMarker( assessment ) ).toBe( true );
		});

		it( "should return false when we don't have a global marker", function() {
			var assessment = { getMarks: function() {} };

			expect( assessor.hasMarker( assessment ) ).toBe( false );
		});

		it( "should return false when we don't have a getMarks function", function() {
			var assessment = {};
			assessor._options.marker = function() {};

			expect( assessor.hasMarker( assessment ) ).toBe( false );
		});

		it( "should return false when we don't have a global marker and don't have a getMarks function", function() {
			var assessment = {};

			expect( assessor.hasMarker( assessment ) ).toBe( false );
		});
	});

	describe( "getMarker", function() {

		var assessor;

		beforeEach( function() {
			assessor = new Assessor( i18n, {} );
		});

		it( "should compose the global marker and the getMarks function", function() {
			var functions = {
				getMarks: function() {},
				globalMarker: function() {}
			};
			spyOn( functions, "getMarks" );
			spyOn( functions, "globalMarker" );
			var assessment = { getMarks: functions.getMarks };
			assessor._options.marker = functions.globalMarker;
			var marker = assessor.getMarker( assessment );

			marker();

			expect( functions.globalMarker ).toHaveBeenCalled();
			expect( functions.getMarks ).toHaveBeenCalled();
		});
	});
});
