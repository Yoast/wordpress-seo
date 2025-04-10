import { describe, expect, test } from "@jest/globals";
import { getDifference } from "../../src/transformers/difference";

describe( "getDifference", () => {
	test.each( [
		[ "100%", 2, 1, 1 ],
		[ "50%", 3, 2, 0.5 ],
		[ "-50%", 1, 2, -0.5 ],
		[ "0%", 1, 1, 0 ],
		[ "0% (return on divide by 0)", 0, 0, 0 ],
		[ "100% (divide by 0)", 10, 0, 1 ],
		[ "NaN (current)", NaN, 1, NaN ],
		[ "NaN (previous)", 1, NaN, NaN ],
		[ "undefined (current)", undefined, 1, NaN ],
		[ "null (current)", null, 1, NaN ],
	] )( "should return the difference: %s", ( _, current, previous, expected ) => {
		expect( getDifference( current, previous ) ).toBe( expected );
	} );
} );
