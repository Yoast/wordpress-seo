import DefaultResearcher from "../src/languageProcessing/languages/_default/Researcher";
import Pluggable from "../src/pluggable";
import InvalidTypeError from "../src/errors/invalidType";
import Assessor from "../src/scoring/assessor.js";
import factory from "./specHelpers/factory.js";
const i18n = factory.buildJed();

describe( "the pluggable interface", function() {
	var app, pluggable;

	describe( "adding an assessment", function() {
		beforeEach( function() {
			app = {
				/**
				 * A mock updateLoadingDialog function.
				 *
				 * @returns {void}
				 */
				updateLoadingDialog: function() {},
				/**
				 * A mock pluginsLoaded function.
				 *
				 * @returns {boolean} Always true.
				 */
				pluginsLoaded: function() {
					return true;
				},
			};
			pluggable = new Pluggable( app );
			pluggable._registerPlugin( "test-plugin", { status: "ready" } );
		} );

		it( "should throw an error on adding an invalid assessment", function() {
			expect( function() {
				pluggable._registerAssessment( false );
			} ).toThrowError( InvalidTypeError );
			expect( function() {
				pluggable._registerAssessment( "name", false );
			} ).toThrowError( InvalidTypeError );
			expect( function() {
				pluggable._registerAssessment( "name", function() {}, false );
			} ).toThrowError( InvalidTypeError );
		} );

		it( "should be able to add an assessment", function() {
			var assessor = new Assessor( i18n, new DefaultResearcher() );
			expect( pluggable._registerAssessment( assessor, "name", function() {}, "test-plugin" ) ).toEqual( true );
		} );
	} );
} );

