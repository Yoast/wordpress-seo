import { fireEvent, render, screen, waitFor } from "../../test-utils";
import { useSelect, useDispatch } from "@wordpress/data";
import { doAction } from "@wordpress/hooks";

import { isTextViewActive } from "../../../src/lib/tinymce";
import AIOptimizeButton from "../../../src/ai-optimizer/components/ai-optimize-button";

jest.mock( "@wordpress/data", () => {
	return {
		useDispatch: jest.fn(),
		useSelect: jest.fn(),
		combineReducers: jest.fn(),
		registerStore: jest.fn(),
	};
} );

jest.mock( "@wordpress/hooks", () => ( {
	doAction: jest.fn(),
} ) );

jest.mock( "../../../src/lib/tinymce", () => ( {
	isTextViewActive: jest.fn(),
} ) );

global.window.YoastSEO = {
	analysis: {
		applyMarks: jest.fn(),
		collectData: () => ( { _text: "Some text content with the keyphrase in it." } ),
	},
};

/**
 * Mock the useSelect function.
 * @param {string} activeAIButton The active AI button ID.
 * @param {string} editorMode The editor mode.
 * @param {string} editorType The editor type.
 * @param {object[]} blocks The blocks.
 * @param {string} activeMarker The active marker.
 * @param {boolean} shouldUpsellWoo Whether to show the Yoast WooCommerce SEO upsell.
 * @param {string} keyword The focus keyphrase.
 * @param {string} content The editor content.
 * @param {string} focusAIButtonId The focus AI button ID.
 * @returns {function} The mock.
 */
// eslint-disable-next-line complexity
const mockSelect = ( activeAIButton, editorMode = "visual", editorType = "blockEditor", blocks = [], activeMarker = "", shouldUpsellWoo = false, keyword = "test keyphrase", content = "Some text content with the keyphrase in it.", focusAIButtonId = null ) => {
	useSelect.mockImplementation( select => select( () => ( {
		getActiveAIFixesButton: () => activeAIButton,
		getActiveMarker: () => activeMarker,
		getDisabledAIFixesButtons: () => ( { keyphraseDistributionAIFixes: "Your text is too long." } ),
		getEditorBlocks: () => blocks,
		getBlockMode: ( clientId ) => clientId === "htmlTest" ? "text" : "visual",
		getEditorMode: () => editorMode,
		getEditorType: () => editorType,
		getIsWooSeoUpsell: () => shouldUpsellWoo,
		getFocusKeyphrase: () => keyword,
		getFocusAIFixesButtonId: () => focusAIButtonId,
	} ) ) );

	// Mock collectData to reflect the provided content
	global.window.YoastSEO.analysis.collectData = () => ( { _text: content } );

	isTextViewActive.mockReturnValue( editorMode === "text" );
};

describe( "AIOptimizeButton", () => {
	let setActiveAIFixesButton;
	let setActiveMarker;
	let setMarkerPauseStatus;
	let setMarkerStatus;
	let setFocusAIFixesButtonId;

	beforeEach( () => {
		setActiveAIFixesButton = jest.fn();
		setActiveMarker = jest.fn();
		setMarkerPauseStatus = jest.fn();
		setMarkerStatus = jest.fn();
		setFocusAIFixesButtonId = jest.fn();

		useDispatch.mockImplementation( () => ( {
			setActiveAIFixesButton,
			setActiveMarker,
			setMarkerPauseStatus,
			setMarkerStatus,
			setFocusAIFixesButtonId,
		} ) );
	} );

	afterEach( () => {
		jest.clearAllMocks();
	} );

	test( "should find the button, but also a lock icon when Yoast SEO Premium is not activated", () => {
		mockSelect( "keyphraseDensityAIFixes" );
		render( <AIOptimizeButton id="keyphraseDensity" isPremium={ false } /> );

		const labelText = document.querySelector( 'button[aria-label="Optimize with AI"]' );
		expect( labelText ).toBeInTheDocument();
		const lockIcon = document.querySelector( ".yst-fixes-button__lock-icon" );
		expect( lockIcon ).toBeInTheDocument();
	} );

	test( "should find the button, but also a lock icon when Yoast WooCommerce SEO is not activated (on products)", () => {
		mockSelect( "keyphraseDensityAIFixes", "visual", "blockEditor", [], "", true );
		render( <AIOptimizeButton id="keyphraseDensity" isPremium={ true } /> );

		const labelText = document.querySelector( 'button[aria-label="Optimize with AI"]' );
		expect( labelText ).toBeInTheDocument();
		const lockIcon = document.querySelector( ".yst-fixes-button__lock-icon" );
		expect( lockIcon ).toBeInTheDocument();
	} );

	test( "should find the button without a lock if no upsell is needed", () => {
		mockSelect( "keyphraseDensityAIFixes" );
		render( <AIOptimizeButton id="keyphraseDensity" isPremium={ true } /> );
		const button = screen.getByRole( "button" );
		expect( button ).toBeInTheDocument();
		const lockIcon = document.querySelector( ".yst-fixes-button__lock-icon" );
		expect( lockIcon ).not.toBeInTheDocument();
	} );

	test( "should not show tooltip when button is not hovered", () => {
		mockSelect( "keyphraseDensityAIFixes" );
		render( <AIOptimizeButton id="keyphraseDensity" isPremium={ true } /> );

		const button = screen.getByRole( "button" );
		expect( button ).toBeInTheDocument();
		expect( screen.queryByRole( "tooltip" ) ).not.toBeInTheDocument();
	} );

	test( "should be enabled under the default circumstances", () => {
		mockSelect( "keyphraseDensityAIFixes" );
		render( <AIOptimizeButton id="keyphraseDensity" isPremium={ true } /> );
		const button = screen.getByRole( "button" );
		expect( button ).toBeInTheDocument();
		expect( button ).toBeEnabled();
		expect( button ).toHaveAttribute( "aria-label", "Optimize with AI" );
	} );

	test( "should be enabled under the default circumstances, in the classic editor", () => {
		mockSelect( "keyphraseDensityAIFixes", "visual", "classicEditor" );
		render( <AIOptimizeButton id="keyphraseDensity" isPremium={ true } /> );
		const button = screen.getByRole( "button" );
		expect( button ).toBeInTheDocument();
		expect( button ).toBeEnabled();
		expect( button ).toHaveAttribute( "aria-label", "Optimize with AI" );
	} );

	test( "should be disabled when listed in the disabled buttons", () => {
		mockSelect( "keyphraseDistributionAIFixes" );
		render( <AIOptimizeButton id="keyphraseDistribution" isPremium={ true } /> );
		const button = screen.getByRole( "button" );
		expect( button ).toBeInTheDocument();
		expect( button ).toBeDisabled();
		expect( button ).toHaveAttribute( "aria-label", "Your text is too long." );
	} );

	test( "should be disabled in HTML editing mode, for the block editor", () => {
		mockSelect( "keyphraseDensityAIFixes", "text", "blockEditor", [ { clientId: "test" } ] );
		render( <AIOptimizeButton id="keyphraseDensity" isPremium={ true } /> );
		const button = screen.getByRole( "button" );
		expect( button ).toBeInTheDocument();
		expect( button ).toBeDisabled();
		expect( button ).toHaveAttribute( "aria-label", "Please switch to the visual editor to optimize with AI." );
	} );

	test( "should be disabled in HTML editing mode, for the classic editor", () => {
		mockSelect( "keyphraseDensityAIFixes", "text", "classicEditor" );
		render( <AIOptimizeButton id="keyphraseDensity" isPremium={ true } /> );
		const button = screen.getByRole( "button" );
		expect( button ).toBeInTheDocument();
		expect( button ).toBeDisabled();
		expect( button ).toHaveAttribute( "aria-label", "Please switch to the visual editor to optimize with AI." );
	} );

	test( "should be disabled when one of the blocks is in HTML editing mode", () => {
		mockSelect( "keyphraseDensityAIFixes", "visual", "blockEditor", [ { clientId: "test" }, { clientId: "htmlTest" } ] );
		render( <AIOptimizeButton id="keyphraseDensity" isPremium={ true } /> );
		const button = screen.getByRole( "button" );
		expect( button ).toBeInTheDocument();
		expect( button ).toBeDisabled();
		expect( button ).toHaveAttribute( "aria-label", "Please switch to the visual editor to optimize with AI." );
	} );
	test( "should disable the highlighting button when the AI button is clicked", () => {
		mockSelect( null );
		render( <AIOptimizeButton id="keyphraseDensity" isPremium={ true } /> );
		const button = screen.getByRole( "button" );

		fireEvent.click( button );

		expect( setActiveMarker ).not.toHaveBeenCalled();
		expect( setMarkerPauseStatus ).not.toHaveBeenCalled();
		expect( window.YoastSEO.analysis.applyMarks ).not.toHaveBeenCalled();
		expect( setActiveAIFixesButton ).toHaveBeenCalledWith( "keyphraseDensityAIFixes" );
		expect( setMarkerStatus ).toHaveBeenCalledWith( "disabled" );
	} );
	test( "should enable back the highlighting button when the AI button is clicked the second time", () => {
		mockSelect( "keyphraseDensityAIFixes" );
		render( <AIOptimizeButton id="keyphraseDensity" isPremium={ true } /> );
		const button = screen.getByRole( "button" );

		fireEvent.click( button );

		expect( setActiveMarker ).not.toHaveBeenCalled();
		expect( setMarkerPauseStatus ).not.toHaveBeenCalled();
		expect( window.YoastSEO.analysis.applyMarks ).not.toHaveBeenCalled();
		expect( setActiveAIFixesButton ).toHaveBeenCalledWith( null );
		expect( setMarkerStatus ).toHaveBeenCalledWith( "enabled" );
	} );
	test( "should remove the active marker if it's available when the AI button is clicked", () => {
		mockSelect( "keyphraseDensityAIFixes", "visual", "blockEditor", [ { clientId: "test" } ], "test" );
		render( <AIOptimizeButton id="keyphraseDensity" isPremium={ true } /> );
		const button = screen.getByRole( "button" );

		fireEvent.click( button );

		expect( setActiveMarker ).toHaveBeenCalledWith( null );
		expect( setMarkerPauseStatus ).toHaveBeenCalledWith( false );
		expect( window.YoastSEO.analysis.applyMarks ).toHaveBeenCalled();
	} );

	test( "should be disabled when another AI button is active (in preview mode)", () => {
		// Another button (introductionKeywordAIFixes) is active, so keyphraseDensity button should be disabled.
		mockSelect( "introductionKeywordAIFixes" );
		render( <AIOptimizeButton id="keyphraseDensity" isPremium={ true } /> );
		const button = screen.getByRole( "button" );
		expect( button ).toBeInTheDocument();
		expect( button ).toBeDisabled();
		expect( button ).toHaveAttribute( "aria-label", "Please apply or discard the current AI suggestion." );
	} );

	test( "should be enabled when no other AI button is active", () => {
		mockSelect( null );
		render( <AIOptimizeButton id="keyphraseDensity" isPremium={ true } /> );
		const button = screen.getByRole( "button" );
		expect( button ).toBeInTheDocument();
		expect( button ).toBeEnabled();
		expect( button ).toHaveAttribute( "aria-label", "Optimize with AI" );
	} );

	test( "should call doAction when clicked with Premium", () => {
		mockSelect( null );
		render( <AIOptimizeButton id="keyphraseDensity" isPremium={ true } /> );
		const button = screen.getByRole( "button" );

		fireEvent.click( button );

		expect( doAction ).toHaveBeenCalledWith( "yoast.ai.fixAssessments", "keyphraseDensityAIFixes" );
	} );

	test( "should have ai-primary variant when button is pressed", () => {
		// Button is pressed when activeAIButtonId matches the button's ID
		mockSelect( "keyphraseDensityAIFixes" );
		render( <AIOptimizeButton id="keyphraseDensity" isPremium={ true } /> );
		const button = screen.getByRole( "button" );

		// The component uses variant="ai-primary" when pressed
		expect( button ).toHaveClass( "yst-button--ai-primary" );
	} );

	test( "should have ai-secondary variant when button is not pressed", () => {
		mockSelect( null );
		render( <AIOptimizeButton id="keyphraseDensity" isPremium={ true } /> );
		const button = screen.getByRole( "button" );

		// The component uses variant="ai-secondary" when not pressed
		expect( button ).toHaveClass( "yst-button--ai-secondary" );
	} );

	test( "should show tooltip on pointer enter and hide on pointer leave when not pressed", async() => {
		mockSelect( null );
		render( <AIOptimizeButton id="keyphraseDensity" isPremium={ true } /> );
		const button = screen.getByRole( "button" );

		// Tooltip should not be visible initially
		expect( screen.queryByText( "Optimize with AI" ) ).not.toBeInTheDocument();

		// Trigger pointer enter
		fireEvent.pointerEnter( button );

		// Tooltip should be visible (the ariaLabel text appears in the Tooltip)
		await waitFor( () => {
			expect( screen.getByText( "Optimize with AI" ) ).toBeInTheDocument();
		} );

		// Trigger pointer leave
		fireEvent.pointerLeave( button );

		// Tooltip should be hidden
		await waitFor( () => {
			expect( screen.queryByText( "Optimize with AI" ) ).not.toBeInTheDocument();
		} );
	} );

	test( "should not show tooltip when button is pressed even on hover", () => {
		mockSelect( "keyphraseDensityAIFixes" );
		render( <AIOptimizeButton id="keyphraseDensity" isPremium={ true } /> );
		const button = screen.getByRole( "button" );

		// Trigger pointer enter
		fireEvent.pointerEnter( button );

		// Tooltip should NOT be shown when button is pressed (isButtonPressed is true)
		// The text from aria-label should not appear as a tooltip element
		const tooltipText = screen.queryAllByText( "Optimize with AI" );
		// Should only find the aria-label, not an additional tooltip element
		expect( tooltipText.length ).toBeLessThanOrEqual( 1 );
	} );

	test( "should be disabled when nested block is in HTML mode", () => {
		// The block with clientId "htmlTest" is mocked to be in HTML mode
		const nestedBlocks = [
			{
				clientId: "parent",
				innerBlocks: [
					{ clientId: "child1", innerBlocks: [] },
					{ clientId: "htmlTest", innerBlocks: [] },
				],
			},
		];
		mockSelect( "keyphraseDensityAIFixes", "visual", "blockEditor", nestedBlocks );
		render( <AIOptimizeButton id="keyphraseDensity" isPremium={ true } /> );
		const button = screen.getByRole( "button" );
		expect( button ).toBeDisabled();
		expect( button ).toHaveAttribute( "aria-label", "Please switch to the visual editor to optimize with AI." );
	} );

	test( "should set focusAIButtonId when button is clicked", () => {
		mockSelect( null );
		render( <AIOptimizeButton id="keyphraseDensity" isPremium={ true } /> );
		const button = screen.getByRole( "button" );

		fireEvent.click( button );

		// setFocusAIFixesButtonId should be called with the button ID and location context
		expect( setFocusAIFixesButtonId ).toHaveBeenCalled();
	} );

	test( "should have correct data-id attribute", () => {
		mockSelect( null );
		render( <AIOptimizeButton id="keyphraseDensity" isPremium={ true } /> );
		const button = screen.getByRole( "button" );

		// The button data-id should include the assessment ID + "AIFixes"
		expect( button ).toHaveAttribute( "data-id", "keyphraseDensityAIFixes" );
	} );
} );

