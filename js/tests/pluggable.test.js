import { Assessor } from "yoastseo";

import Pluggable from "../src/pluggable";
import Factory from "./helpers/factory";

const i18n = Factory.buildJed();

describe( "the pluggable interface", function() {
	let refresh, pluggable;

	describe( "adding an assessment", function() {
		beforeEach( function() {
			refresh = function() {};
			pluggable = new Pluggable( refresh );
			pluggable.registerPlugin( "test-plugin", { status: "ready" } );
		} );

		it( "should return false on adding an invalid assessment", function() {
			console.error = jest.fn();

			expect( pluggable.registerAssessment( false ) ).toBe( false );
			expect( pluggable.registerAssessment( "name", false ) ).toBe( false );
			expect( pluggable.registerAssessment( "name", function() {}, false ) ).toBe( false );

			expect( console.error ).toHaveBeenCalledTimes( 3 );
		} );

		it( "should be able to add an assessment", function() {
			const assessor = new Assessor( i18n );
			expect( pluggable.registerAssessment( assessor, "name", function() {}, "test-plugin" ) ).toEqual( true );
		} );
	} );
} );
