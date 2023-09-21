// import React from "react";
import { useSelect } from "@wordpress/data";
// import TextLength from "../../../src/insights/components/text-length";

jest.mock( "@wordpress/data", () => (
	{
		useSelect: jest.fn(),
	}
) );


/**
 * Mocks the WordPress `useSelect` hook.
 *
 * @param {object} textLengthObject The result of text length research.
 *
 * @returns {void}
 */
function mockSelect( textLengthObject ) {
	const select = jest.fn(
		() => (
			{
				getTextLength: jest.fn( () => textLengthObject ),
			}
		)
	);

	useSelect.mockImplementation(
		selectFunction => selectFunction( select )
	);
}

describe( "a test for TextLength component", () => {
	it( "returns the props for languages that use word as the unit for text length measurement", () => {
		mockSelect( {
			count: 300,
			unit: "words",
		} );
	} );

	it( "returns the props for languages that use character as the unit for text length measurement", () => {
		mockSelect( {
			count: 300,
			unit: "character",
		} );
	} );
} );
