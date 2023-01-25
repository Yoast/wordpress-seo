import { shallow } from "enzyme";
import React from "react";
import { useSelect } from "@wordpress/data";
import TextLength from "../../../src/insights/components/text-length";

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
		const render = shallow( <TextLength /> );

		expect( render.props().amount ).toBe( 300 );
		expect( render.props().linkText ).toBe( "Learn more about word count" );
		expect( render.props().title ).toBe( "Word count" );
		expect( render.props().unit ).toBe( "words" );
	} );

	it( "returns the props for languages that use character as the unit for text length measurement", () => {
		mockSelect( {
			count: 300,
			unit: "character",
		} );
		const render = shallow( <TextLength /> );

		expect( render.props().amount ).toBe( 300 );
		expect( render.props().linkText ).toBe( "Learn more about character count" );
		expect( render.props().title ).toBe( "Character count" );
		expect( render.props().unit ).toBe( "characters" );
	} );
} );
