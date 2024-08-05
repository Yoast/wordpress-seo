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
 * @param {string} editorMode The editor mode.
 * @param {object[]} blocks The blocks.
 * @returns {function} The mock.
 */
const mockSelect = ( activeAIButton, editorMode = "visual", blocks = [] ) =>
	useSelect.mockImplementation( select => select( () => ( {
		getActiveAIFixesButton: () => activeAIButton,
		getActiveMarker: () => null,
		getDisabledAIFixesButtons: () => ( { keyphraseDistributionAIFixes: "Your text is too long." } ),
		getBlocks: () => blocks,
		getBlockMode: ( clientId ) => clientId === "htmlTest" ? "html" : "visual",
		getEditorMode: () => editorMode,
	} ) ) );

describe( "AIAssessmentFixesButton", () => {
	test( "should find the correct aria-label in the document", () => {
		mockSelect( "keyphraseDensityAIFixes" );
		render( <AIAssessmentFixesButton id="keyphraseDensity" isPremium={ false } /> );

		const labelText = document.querySelector( 'button[aria-label="Optimize with AI"]' );
		expect( labelText ).toBeInTheDocument();
	} );

	test( "should find the correct button id", () => {
		mockSelect( "keyphraseDensityAIFixes" );
		render( <AIAssessmentFixesButton id="keyphraseDensity" isPremium={ true } /> );
		const button = screen.getByRole( "button" );
		expect( button ).toBeInTheDocument();
	} );

	test( "should find the button without tooltip when the button is NOT hovered", () => {
		mockSelect( "keyphraseDensityAIFixes" );
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

	test( "should be enabled under the default circumstances", () => {
		mockSelect( "keyphraseDensityAIFixes" );
		render( <AIAssessmentFixesButton id="keyphraseDensity" isPremium={ true } /> );
		const button = screen.getByRole( "button" );
		expect( button ).toBeInTheDocument();
		expect( button ).toBeEnabled();
		expect( button ).toHaveAttribute( "aria-label", "Optimize with AI" );
	} );

	test( "should be disabled when listed in the disabled buttons", () => {
		mockSelect( "keyphraseDistributionAIFixes" );
		render( <AIAssessmentFixesButton id="keyphraseDistribution" isPremium={ true } /> );
		const button = screen.getByRole( "button" );
		expect( button ).toBeInTheDocument();
		expect( button ).toBeDisabled();
		expect( button ).toHaveAttribute( "aria-label", "Your text is too long." );
	} );

	test( "should be disabled in HTML editing mode", () => {
		mockSelect( "keyphraseDensityAIFixes", "html", [ { clientId: "test" } ] );
		render( <AIAssessmentFixesButton id="keyphraseDensity" isPremium={ true } /> );
		const button = screen.getByRole( "button" );
		expect( button ).toBeInTheDocument();
		expect( button ).toBeDisabled();
		expect( button ).toHaveAttribute( "aria-label", "Please switch to the visual editor to optimize with AI." );
	} );

	test( "should be disabled when one of the blocks is in HTML editing mode", () => {
		mockSelect( "keyphraseDensityAIFixes", "visual", [ { clientId: "test" }, { clientId: "htmlTest" } ] );
		render( <AIAssessmentFixesButton id="keyphraseDensity" isPremium={ true } /> );
		const button = screen.getByRole( "button" );
		expect( button ).toBeInTheDocument();
		expect( button ).toBeDisabled();
		expect( button ).toHaveAttribute( "aria-label", "Please switch to the visual editor to optimize with AI." );
	} );
} );

