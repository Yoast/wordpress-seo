// import React from "react";
import { useSelect } from "@wordpress/data";
import { enableFeatures } from "@yoast/feature-flag";
// import InsightsCollapsible from "../../../src/insights/components/insights-collapsible";
// import FleschReadingEase from "../../../src/insights/components/flesch-reading-ease";
// import TextFormality from "../../../src/insights/components/text-formality";
// import TextLength from "../../../src/insights/components/text-length";

jest.mock( "@wordpress/data", () => (
	{
		useSelect: jest.fn(),
	}
) );

/**
 * Mocks the WordPress `useSelect` hook.
 *
 * @param {boolean} isFleschReadingEaseAvailable Whether FRE is available.
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
	} );
	it( "does not render the FRE component if the FRE score and difficulty are not available", () => {
		mockSelect( false );
	} );
	it( "renders the TextLength component", () => {

	} );
	it( "does not render the Text formality component when the feature is disabled", () => {
		mockSelect( true );
	} );
	it( "renders the Text formality component when the feature is enabled", () => {
		enableFeatures( [ "TEXT_FORMALITY" ] );
		mockSelect( true );
	} );
} );
