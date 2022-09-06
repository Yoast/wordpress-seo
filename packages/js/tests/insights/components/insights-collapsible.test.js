import React from "react";
import { useSelect } from "@wordpress/data";
import InsightsCollapsible from "../../../src/insights/components/insights-collapsible";
import { shallow } from "enzyme";
import FleschReadingEase from "../../../src/insights/components/flesch-reading-ease";
import TextFormality from "../../../src/insights/components/text-formality";
import TextLength from "../../../src/insights/components/text-length";

jest.mock( "@wordpress/data", () => (
	{
		useSelect: jest.fn(),
	}
) );

/**
 * Mocks the WordPress `useSelect` hook.
 *
 * @param {boolean} isFleschReadingEaseAvailable Whether FRE is available.
 * @param {boolean} isTextFormalityAvailable Whether Text formality is available.
 *
 * @returns {void}
 */
function mockSelect( isFleschReadingEaseAvailable, isTextFormalityAvailable ) {
	const select = jest.fn(
		() => (
			{
				isFleschReadingEaseAvailable: jest.fn( () => isFleschReadingEaseAvailable ),
				isTextFormalityAvailable: jest.fn( () => isTextFormalityAvailable ),
			}
		)
	);

	useSelect.mockImplementation(
		selectFunction => selectFunction( select )
	);
}

describe( "The insights collapsible component", () => {
	it( "renders the Flesch reading ease (FRE) component if the FRE score and difficulty are available", () => {
		mockSelect( true, true );
		const render = shallow( <InsightsCollapsible location={ "sidebar" } /> );

		expect( render.find( FleschReadingEase ) ).toHaveLength( 1 );
	} );
	it( "does not render the FRE component if the FRE score and difficulty are not available", () => {
		mockSelect( false, true );
		const render = shallow( <InsightsCollapsible location={ "sidebar" } /> );

		expect( render.find( FleschReadingEase ) ).toHaveLength( 0 );
	} );
	it( "renders the TextLength component", () => {
		const render = shallow( <InsightsCollapsible location={ "sidebar" } /> );

		expect( render.find( TextLength ) ).toHaveLength( 1 );
	} );
	it( "should render the Text formality component if it's available", () => {
		mockSelect( true, true );
		const render = shallow( <InsightsCollapsible location={ "sidebar" } /> );

		expect( render.find( TextFormality ) ).toHaveLength( 1 );
	} );
	it( "should not render the Text formality component if it's unavailable", () => {
		mockSelect( true, false );
		const render = shallow( <InsightsCollapsible location={ "sidebar" } /> );

		expect( render.find( TextFormality ) ).toHaveLength( 0 );
	} );
} );
