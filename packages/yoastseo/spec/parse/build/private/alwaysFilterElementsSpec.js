import alwaysFilterElements from "../../../../src/parse/build/private/alwaysFilterElements";
import Node from "../../../../src/parse/structure/Node";

// Note: Testing of individual elements is done in filterTreeSpec.js.

describe( "A test to guard the consistency of alwaysFilterElements", function() {
	it( "should always contain functions", function() {
		alwaysFilterElements.forEach( callBackFunction => expect( typeof callBackFunction ).toBe( "function" ) );
	} );

	it( "should always contain a function that returns a boolean", function() {
		const node = new Node( "div" );
		alwaysFilterElements.forEach( callBackFunction => {
			expect( typeof callBackFunction( node ) ).toBe( "boolean" );
		} );
	} );
} );
