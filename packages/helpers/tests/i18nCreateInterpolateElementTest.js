import React from "react";
import { i18nCreateInterpolateElement } from "../src/i18n-create-interpolate-element";
import { createInterpolateElement } from "@wordpress/element";
import { sprintf } from "@wordpress/i18n";

jest.mock( "@wordpress/element", () => ( {
	createInterpolateElement: jest.fn(),
} ) );

jest.mock( "@wordpress/i18n", () => ( {
	sprintf: jest.fn(),
} ) );

describe( "i18nCreateInterpolateElement", () => {
	beforeEach( () => {
		jest.clearAllMocks();
	} );

	it( "should return interpolated element when no error occurs", () => {
		const translatedString = "Hello %s";
		const args = [ "world" ];
		const conversionMap = { world: <span>world</span> };
		const interpolatedElement = <span>Hello world</span>;

		sprintf.mockReturnValue( "Hello world" );
		createInterpolateElement.mockReturnValue( interpolatedElement );

		const result = i18nCreateInterpolateElement( translatedString, args, conversionMap );

		expect( sprintf ).toHaveBeenCalledWith( translatedString, ...args );
		expect( createInterpolateElement ).toHaveBeenCalledWith( "Hello world", conversionMap );
		expect( result ).toBe( interpolatedElement );
	} );

	it( "should return translated string and log error when an error occurs", () => {
		const translatedString = "Hello %s";
		const args = [ "world" ];
		const conversionMap = { world: <span>world</span> };

		sprintf.mockImplementation( () => {
			throw new Error( "Test error" );
		} );

		console.error = jest.fn();

		const result = i18nCreateInterpolateElement( translatedString, args, conversionMap );

		expect( sprintf ).toHaveBeenCalledWith( translatedString, ...args );
		expect( console.error ).toHaveBeenCalledWith( "Error in translation for:", translatedString );
		expect( result ).toBe( translatedString );
	} );
} );
