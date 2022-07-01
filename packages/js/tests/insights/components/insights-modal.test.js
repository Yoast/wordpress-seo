import React from "react";
import { useSelect } from "@wordpress/data";
import { shallow } from "enzyme";
import FleschReadingEase from "../../../src/insights/components/flesch-reading-ease";
import InsightsModal from "../../../src/insights/components/insights-modal";
import TextLength from "../../../src/insights/components/text-length";


jest.mock( "@wordpress/data", () => (
	{
		withSelect: jest.fn(),
		withDispatch: jest.fn(),
		useSelect: jest.fn(),
	}
) );

jest.mock( "../../../src/containers/EditorModal", () => jest.fn() );

/**
 * Mocks the WordPress `useSelect` hook.
 *
 * @param {boolean} isFleschReadingEaseAvailable Whether FRE is available
 * @param {boolean} isElementorEditor Whether the editor is the Elementor editor
 *
 * @returns {void}
 */
function mockSelect( isFleschReadingEaseAvailable, isElementorEditor ) {
	const select = jest.fn(
		() => (
			{
				isFleschReadingEaseAvailable: jest.fn( () => isFleschReadingEaseAvailable ),
				getIsElementorEditor: jest.fn( () => isElementorEditor ),
			}
		)
	);

	useSelect.mockImplementation(
		selectFunction => selectFunction( select )
	);
}

describe( "The insights collapsible component", () => {
	it( "renders the Flesch reading ease (FRE) component if the FRE score and difficulty are available", () => {
		mockSelect( true, false );
		const render = shallow( <InsightsModal location={ "sidebar" } /> );

		expect( render.find( FleschReadingEase ) ).toHaveLength( 1 );
	} );
	it( "does not render the FRE component if the FRE score and difficulty are not available", () => {
		mockSelect( false, false );
		const render = shallow( <InsightsModal location={ "sidebar" } /> );

		expect( render.find( FleschReadingEase ) ).toHaveLength( 0 );
	} );
	it( "renders the TextLength component", () => {
		const render = shallow( <InsightsModal location={ "sidebar" } /> );

		expect( render.find( TextLength ) ).toHaveLength( 1 );
	} );
} );
