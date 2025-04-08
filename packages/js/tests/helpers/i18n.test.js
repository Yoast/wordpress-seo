import { safeCreateInterpolateElement } from "../../src/helpers/i18n";
import { createInterpolateElement } from "@wordpress/element";

jest.mock( "@wordpress/element", () => ( {
	createInterpolateElement: jest.fn(),
} ) );

describe( "safeCreateInterpolateElement", () => {
	it( "should return the result of createInterpolateElement when no error occurs", () => {
		const interpolatedString = "Hello, <strong>world</strong>!";
		const conversionMap = { strong: <strong /> };
		const mockResult = <>Hello, <strong>world</strong>!</>;

		createInterpolateElement.mockReturnValue( mockResult );

		const result = safeCreateInterpolateElement( interpolatedString, conversionMap );

		expect( createInterpolateElement ).toHaveBeenCalledWith( interpolatedString, conversionMap );
		expect( result ).toBe( mockResult );
	} );

	it( "should return the original string and log an error when createInterpolateElement throws an error", () => {
		const interpolatedString = "Hello, <strong>world</strong>!";
		const conversionMap = { strong: <strong /> };
		const mockError = new Error( "Test error" );

		createInterpolateElement.mockImplementation( () => {
			throw mockError;
		} );

		console.error = jest.fn();

		const result = safeCreateInterpolateElement( interpolatedString, conversionMap );

		expect( createInterpolateElement ).toHaveBeenCalledWith( interpolatedString, conversionMap );
		expect( console.error ).toHaveBeenCalledWith(
			"Error in translation for:",
			interpolatedString,
			mockError
		);
		expect( result ).toBe( interpolatedString );
	} );
} );
