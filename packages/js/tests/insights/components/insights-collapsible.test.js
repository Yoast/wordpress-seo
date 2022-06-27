import React from "react";
import { useSelect } from "@wordpress/data";
import InsightsCollapsible from "../../../src/insights/components/insights-collapsible";
import { shallow } from "enzyme";
import FleschReadingEase from "../../../src/insights/components/flesch-reading-ease";

jest.mock( "@wordpress/data", () => (
	{
		useSelect: jest.fn(),
	}
) );

/**
 * Mocks the WordPress `useSelect` hook.
 *
 * @param {boolean} isFleschReadingEaseAvailable Whether FRE is available
 *
 * @returns {void}
 */
function mockSelect( isFleschReadingEaseAvailable ) {
	const select = jest.fn(
		() => (
			{
				isFleschReadingEaseAvailable: jest.fn( () => isFleschReadingEaseAvailable ),
			}
		)
	);

	useSelect.mockImplementation(
		selectFunction => selectFunction( select )
	);
}

describe( "The insights collapsible component", () => {
	it( "renders the Flesch reading ease (FRE) component if the FRE score and difficulty are available", () => {
		mockSelect( true );
		const render = shallow( <InsightsCollapsible location={ "sidebar" } /> );

		expect( render.find( FleschReadingEase ) ).toHaveLength( 1 );
	} );
	it( "does not render the FRE component if the FRE score and difficulty are not available", () => {
		mockSelect( false );
		const render = shallow( <InsightsCollapsible location={ "sidebar" } /> );

		expect( render.find( FleschReadingEase ) ).toHaveLength( 0 );
	} );
} );
