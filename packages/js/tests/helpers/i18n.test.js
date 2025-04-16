import { describe, expect, it, jest } from "@jest/globals";
import { safeCreateInterpolateElement } from "../../src/helpers/i18n";

describe( "safeCreateInterpolateElement", () => {
	it( "should return the result of createInterpolateElement when no error occurs", () => {
		const interpolatedString = "Hello, <strong>world</strong>!";
		const conversionMap = { strong: <strong /> };

		const result = safeCreateInterpolateElement( interpolatedString, conversionMap );

		expect( result ).toEqual( <>Hello, <strong>world</strong>!</> );
	} );

	it( "should return the original string and log an error when createInterpolateElement throws an error", () => {
		const interpolatedString = "Hello, </strong>world<strong>!";
		const conversionMap = { strong: <strong /> };

		console.error = jest.fn();

		const result = safeCreateInterpolateElement( interpolatedString, conversionMap );

		expect( result ).toBe( interpolatedString );
		expect( console.error ).toHaveBeenCalledWith(
			"Error in translation for:",
			interpolatedString,
			expect.any( Error )
		);
	} );
} );
