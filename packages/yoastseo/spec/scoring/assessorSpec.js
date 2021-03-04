import DefaultResearcher from "../../src/languageProcessing/languages/_default/Researcher";
import Assessor from "../../src/scoring/assessor.js";
import Paper from "../../src/values/Paper.js";
import AssessmentResult from "../../src/values/AssessmentResult.js";
import MissingArgument from "../../src/errors/missingArgument";
import factory from "../specHelpers/factory.js";
var i18n = factory.buildJed();

global.window = {};

describe( "an assessor object", function() {
	describe( "create an assessor", function() {
		it( "throws an error when no args are given", function() {
			expect( function() {
				new Assessor();
			} ).toThrowError( MissingArgument );
		} );

		it( "throws an error when no researcher argument is provided", function() {
			expect( function() {
				new Assessor( i18n );
			} ).toThrowError( MissingArgument );
		} );

		it( "creates an assessor", function() {
			expect( new Assessor( i18n, new DefaultResearcher() ) ).toBeDefined();
			expect( Object.keys( new Assessor( i18n, new DefaultResearcher() ).getAvailableAssessments() ) ).toEqual( [] );
		} );
	} );

	var result5 = new AssessmentResult();
	result5.setScore( 5 );
	var result4 = new AssessmentResult();
	result4.setScore( 4 );
	var result8 = new AssessmentResult();
	result8.setScore( 8 );

	var validResult = new AssessmentResult();
	validResult.setScore( 9 );
	validResult.setText( "all good" );
	validResult.setHasMarks( true );

	describe( "returning the overall score", function() {
		it( "returns the overall score", function() {
			var assessor = new Assessor( i18n, new DefaultResearcher() );
			assessor.getValidResults = function() {
				return [ result5, result4, result8 ];
			};
			expect( assessor.calculateOverallScore() ).toBe( 63 );
		} );
	} );

	var mockAssessment = {
		/**
		 * A mock assessment which always returns true.
		 *
		 * @returns {boolean} True.
		 */
		callback: function() {
			return true;
		},
	};

	describe( "adding an assessment", function() {
		it( "adds an assessment", function() {
			var assessor = new Assessor( i18n, new DefaultResearcher() );
			assessor.addAssessment( "testname", mockAssessment );

			var result = assessor.getAssessment( "testname" );

			expect( result ).toEqual( mockAssessment );
		} );
	} );

	describe( "removing an assessment", function() {
		it( "removes an assessment", function() {
			var assessor = new Assessor( i18n, new DefaultResearcher() );
			assessor.removeAssessment( "testname" );

			var result = assessor.getAssessment( "testname" );

			expect( result ).toEqual( undefined ); // eslint-disable-line no-undefined
		} );
	} );

	describe( "assess", function() {
		it( "should add the marker to the assessment result", function() {
			var paper = new Paper();
			var assessor = new Assessor( i18n, new DefaultResearcher(), {
				/**
				 * A mock marker function.
				 *
				 * @returns {void}
				 */
				marker: function() {},
			} );
			var assessment = {
				/**
				 * A mock getResult function.
				 *
				 * @returns {Object} A result with a score, a feedback text and marks.
				 */
				getResult: function() {
					return validResult;
				},
				/**
				 * A mock isApplicable function.
				 *
				 * @returns {boolean} True.
				 */
				isApplicable: function() {
					return true;
				},
				/**
				 * A mock getMarks function.
				 *
				 * @returns {void}
				 */
				getMarks: function() {},
			};

			assessor.addAssessment( "test1", assessment );

			assessor.assess( paper );
			var results = assessor.getValidResults();

			expect( results[ 0 ].hasMarker() ).toBe( true );
		} );
	} );

	describe( "hasMarker", function() {
		var assessor;

		beforeEach( function() {
			assessor = new Assessor( i18n, new DefaultResearcher(), {} );
		} );

		it( "should return true when we have a global marker and a getMarks function", function() {
			var assessment = {
				/**
				 * A mock getMarks function.
				 *
				 * @returns {void}
				 */
				getMarks: function() {},
			};
			assessor._options.marker = function() {};

			expect( assessor.hasMarker( assessment ) ).toBe( true );
		} );

		it( "should return false when we don't have a global marker", function() {
			var assessment = {
				/**
				 * A mock getMarks function.
				 *
				 * @returns {void}
				 */
				getMarks: function() {},
			};

			expect( assessor.hasMarker( assessment ) ).toBe( false );
		} );

		it( "should return false when we don't have a getMarks function", function() {
			var assessment = {};
			assessor._options.marker = function() {};

			expect( assessor.hasMarker( assessment ) ).toBe( false );
		} );

		it( "should return false when we don't have a global marker and don't have a getMarks function", function() {
			var assessment = {};

			expect( assessor.hasMarker( assessment ) ).toBe( false );
		} );
	} );

	describe( "getMarker", function() {
		var assessor;

		beforeEach( function() {
			assessor = new Assessor( i18n, {} );
		} );

		it( "should compose the global marker and the getMarks function", function() {
			var functions = {
				/**
				 * A mock getMarks function.
				 *
				 * @returns {void}
				 */
				getMarks: function() {},
				/**
				 * A mock globalMarker function.
				 *
				 * @returns {void}
				 */
				globalMarker: function() {},
			};
			spyOn( functions, "getMarks" );
			spyOn( functions, "globalMarker" );
			var assessment = { getMarks: functions.getMarks };
			assessor._options.marker = functions.globalMarker;
			var marker = assessor.getMarker( assessment );

			marker();

			expect( functions.globalMarker ).toHaveBeenCalled();
			expect( functions.getMarks ).toHaveBeenCalled();
		} );
	} );
} );
