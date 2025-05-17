import DefaultResearcher from "../../../src/languageProcessing/languages/_default/Researcher.js";
import Assessor from "../../../src/scoring/assessors/assessor.js";
import Paper from "../../../src/values/Paper.js";
import AssessmentResult from "../../../src/values/AssessmentResult.js";
import MissingArgument from "../../../src/errors/missingArgument.js";

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
				new Assessor();
			} ).toThrowError( MissingArgument );
		} );

		it( "creates an assessor", function() {
			expect( new Assessor( new DefaultResearcher() ) ).toBeDefined();
			expect( Object.keys( new Assessor( new DefaultResearcher() ).getAvailableAssessments() ) ).toEqual( [] );
		} );
	} );

	const result5 = new AssessmentResult();
	result5.setScore( 5 );
	const result4 = new AssessmentResult();
	result4.setScore( 4 );
	const result8 = new AssessmentResult();
	result8.setScore( 8 );

	const validResult = new AssessmentResult();
	validResult.setScore( 9 );
	validResult.setText( "all good" );
	validResult.setHasMarks( true );

	describe( "returning the overall score", function() {
		it( "returns the overall score", function() {
			const assessor = new Assessor( new DefaultResearcher() );
			assessor.getValidResults = function() {
				return [ result5, result4, result8 ];
			};
			expect( assessor.calculateOverallScore() ).toBe( 63 );
		} );
	} );

	const mockAssessment = {
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
			const assessor = new Assessor( new DefaultResearcher() );
			assessor.addAssessment( "testname", mockAssessment );

			const result = assessor.getAssessment( "testname" );

			expect( result ).toEqual( mockAssessment );
		} );
		it( "overides the existing assessment if the newly added assessment has the same identifier", function() {
			const assessor = new Assessor( new DefaultResearcher() );
			assessor.addAssessment( "testname", mockAssessment );

			assessor.addAssessment( "testname", mockAssessment );

			expect( assessor.getAvailableAssessments().length ).toEqual( 1 );
		} );
	} );

	describe( "removing an assessment", function() {
		it( "removes an assessment", function() {
			const assessor = new Assessor( new DefaultResearcher() );
			assessor.removeAssessment( "testname" );

			const result = assessor.getAssessment( "testname" );

			expect( result ).toEqual( undefined ); // eslint-disable-line no-undefined
		} );
	} );

	describe( "assess", function() {
		it( "should add the marker to the assessment result", function() {
			const paper = new Paper();
			const assessor = new Assessor( new DefaultResearcher(), {
				/**
				 * A mock marker function.
				 *
				 * @returns {void}
				 */
				marker: function() {},
			} );
			const assessment = {
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
			const results = assessor.getValidResults();

			expect( results[ 0 ].hasMarker() ).toBe( true );
		} );
	} );

	describe( "hasMarker", function() {
		let assessor;

		beforeEach( function() {
			assessor = new Assessor( new DefaultResearcher(), {} );
		} );

		it( "should return true when we have a global marker and a getMarks function", function() {
			const assessment = {
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
			const assessment = {
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
			const assessment = {};
			assessor._options.marker = function() {};

			expect( assessor.hasMarker( assessment ) ).toBe( false );
		} );

		it( "should return false when we don't have a global marker and don't have a getMarks function", function() {
			const assessment = {};

			expect( assessor.hasMarker( assessment ) ).toBe( false );
		} );
	} );

	describe( "getMarker", function() {
		let assessor;

		beforeEach( function() {
			assessor = new Assessor( {} );
		} );

		it( "should compose the global marker and the getMarks function", function() {
			const functions = {
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
			jest.spyOn( functions, "getMarks" );
			jest.spyOn( functions, "globalMarker" );
			const assessment = { getMarks: functions.getMarks };
			assessor._options.marker = functions.globalMarker;
			const marker = assessor.getMarker( assessment );

			marker();

			expect( functions.globalMarker ).toHaveBeenCalled();
			expect( functions.getMarks ).toHaveBeenCalled();
		} );
	} );
} );
