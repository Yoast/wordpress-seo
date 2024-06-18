import React from "react";
import { render, screen } from "../../test-utils";
import { useSelect } from "@wordpress/data";

import AIAssessmentFixesButton from "../../../src/ai-assessment-fixes/components/ai-assessment-fixes-button";

jest.mock( "@wordpress/data", () => {
	return {
		useDispatch: jest.fn( () => {
			return {
				setActiveAIFixesButton: jest.fn(),
			};
		} ),
		useSelect: jest.fn(),
	};
} );

/**
 * Mock the useSelect function.
 * @param {string} activeAIButton The active AI button ID.
 * @returns {function} The mock.
 */
const mockSelect = ( activeAIButton ) => useSelect.mockImplementation( select => select( () => ( {
	getActiveAIFixesButton: () => activeAIButton,
	getActiveMarker: () => null,
} ) ) );

describe( "AIAssessmentFixesButton", () => {
	test( "should find the correct aria-label in the document", () => {
		render( <AIAssessmentFixesButton id="keyphraseDensity" isPremium={ false } /> );

		const labelText = document.querySelector( 'button[aria-label="Optimize with AI"]' );
		expect( labelText ).toBeInTheDocument();
	} );

	test( "should find the correct button id", () => {
		render( <AIAssessmentFixesButton id="keyphraseDensity" isPremium={ true } /> );
		const button = screen.getByRole( "button" );
		expect( button ).toBeInTheDocument();
	} );

	test( "should find the button without tooltip when the button is NOT hovered", () => {
		render( <AIAssessmentFixesButton id="keyphraseDensity" isPremium={ true }  /> );

		const buttonWithOutTooltip = document.getElementsByClassName( "ai-button" );
		expect( buttonWithOutTooltip ).toHaveLength( 1 );
	} );

	test( "should find the button without tooltip when the button is pressed", () => {
		// The button is pressed when the active AI button id in the store is the same as the current button id.
		// The button ID is the component ID + "AIFixes".
		mockSelect( "keyphraseDensityAIFixes" );

		render( <AIAssessmentFixesButton id="keyphraseDensity" isPremium={ false }  /> );

		const buttonWithTooltip = document.getElementsByClassName( "yoast-tooltip yoast-tooltip-w" );
		expect( buttonWithTooltip ).toHaveLength( 0 );
	} );
} );

