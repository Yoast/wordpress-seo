import { inRange } from "../../src/helpers/inRange.js";
import { inRangeStartInclusive } from "../../src/helpers/inRange.js";
import { inRangeEndInclusive } from "../../src/helpers/inRange.js";

describe( "Checks whether a value is in range", function() {
	it( "returns true, the value is in range", function() {
		expect( inRange( 10, 0, 20 ) ).toBe( true );
	} );
	it( "returns false, the value isn't in range", function() {
		expect( inRange( 10, 20, 30 ) ).toBe( false );
	} );
	it( "returns false, the value isn't in range", function() {
		expect( inRange( 10, 10, 30 ) ).toBe( false );
	} );
	it( "returns true, the value is in range", function() {
		expect( inRange( 30, 10, 30 ) ).toBe( true );
	} );
} );

describe( "checks whether a value is in range, including the start value", function() {
	it( "returns true, the value is in range", function() {
		expect( inRangeStartInclusive( 10, 0, 20 ) ).toBe( true );
	} );
	it( "returns false, the value isn't in range", function() {
		expect( inRangeStartInclusive( 10, 20, 30 ) ).toBe( false );
	} );
	it( "returns true, the value is in range", function() {
		expect( inRangeStartInclusive( 10, 10, 30 ) ).toBe( true );
	} );
	it( "returns false, the value isn't in range", function() {
		expect( inRangeStartInclusive( 30, 10, 30 ) ).toBe( false );
	} );
} );

describe( "checks whether a value is in range, including the end value", function() {
	it( "returns true, the value is in range", function() {
		expect( inRangeEndInclusive( 10, 0, 20 ) ).toBe( true );
	} );
	it( "returns false, the value isn't in range", function() {
		expect( inRangeEndInclusive( 10, 20, 30 ) ).toBe( false );
	} );
	it( "returns false, the value isn't in range", function() {
		expect( inRangeEndInclusive( 10, 10, 30 ) ).toBe( false );
	} );
	it( "returns false, the value isn't in range", function() {
		expect( inRangeEndInclusive( 30, 10, 30 ) ).toBe( true );
	} );
} );
