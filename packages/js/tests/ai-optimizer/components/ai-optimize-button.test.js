import { fireEvent, render, screen } from "../../test-utils";
import { useSelect, useDispatch } from "@wordpress/data";

import { isTextViewActive } from "../../../src/lib/tinymce";
import AIOptimizeButton from "../../../src/ai-optimizer/components/ai-optimize-button";

jest.mock( "@wordpress/data", () => {
	return {
		useDispatch: jest.fn(),
		useSelect: jest.fn(),
		combineReducers: jest.fn(),
	};
} );

jest.mock( "../../../src/lib/tinymce", () => ( {
	isTextViewActive: jest.fn(),
} ) );

global.window.YoastSEO = {
	analysis: {
		applyMarks: jest.fn(),
	},
};

/**
 * Mock the useSelect function.
 * @param {string} activeAIButton The active AI button ID.
 * @param {string} editorMode The editor mode.
 * @param {string} editorType The editor type.
 * @param {object[]} blocks The blocks.
 * @param {string} activeMarker The active marker.
 * @returns {function} The mock.
 */
const mockSelect = ( activeAIButton, editorMode = "visual", editorType = "blockEditor", blocks = [], activeMarker = "" ) => {
	useSelect.mockImplementation( select => select( () => ( {
		getActiveAIFixesButton: () => activeAIButton,
		getActiveMarker: () => activeMarker,
		getDisabledAIFixesButtons: () => ( { keyphraseDistributionAIFixes: "Your text is too long." } ),
		getBlocks: () => blocks,
		getBlockMode: ( clientId ) => clientId === "htmlTest" ? "text" : "visual",
		getEditorMode: () => editorMode,
		getEditorType: () => editorType,
	} ) ) );

	isTextViewActive.mockReturnValue( editorMode === "text" );
};

describe( "AIAssessmentFixesButton", () => {
	let setActiveAIFixesButton;
	let setActiveMarker;
	let setMarkerPauseStatus;
	let setMarkerStatus;

	beforeEach( () => {
		setActiveAIFixesButton = jest.fn();
		setActiveMarker = jest.fn();
		setMarkerPauseStatus = jest.fn();
		setMarkerStatus = jest.fn();

		useDispatch.mockImplementation( () => ( {
			setActiveAIFixesButton,
			setActiveMarker,
			setMarkerPauseStatus,
			setMarkerStatus,
		} ) );
	} );

	afterEach( () => {
		jest.clearAllMocks();
	} );

	test( "should find the correct aria-label in the document", () => {
		mockSelect( "keyphraseDensityAIFixes" );
		render( <AIOptimizeButton id="keyphraseDensity" isPremium={ false } /> );

		const labelText = document.querySelector( 'button[aria-label="Optimize with AI"]' );
		expect( labelText ).toBeInTheDocument();
	} );

	test( "should find the correct button id", () => {
		mockSelect( "keyphraseDensityAIFixes" );
		render( <AIOptimizeButton id="keyphraseDensity" isPremium={ true } /> );
		const button = screen.getByRole( "button" );
		expect( button ).toBeInTheDocument();
	} );

	test( "should find the button without tooltip when the button is NOT hovered", () => {
		mockSelect( "keyphraseDensityAIFixes" );
		render( <AIOptimizeButton id="keyphraseDensity" isPremium={ true }  /> );

		const buttonWithOutTooltip = document.getElementsByClassName( "ai-button" );
		expect( buttonWithOutTooltip ).toHaveLength( 1 );
	} );

	test( "should find the button without tooltip when the button is pressed", () => {
		// The button is pressed when the active AI button id in the store is the same as the current button id.
		// The button ID is the component ID + "AIFixes".
		mockSelect( "keyphraseDensityAIFixes" );
		render( <AIOptimizeButton id="keyphraseDensity" isPremium={ false }  /> );

		const buttonWithTooltip = document.getElementsByClassName( "yoast-tooltip yoast-tooltip-w" );
		expect( buttonWithTooltip ).toHaveLength( 0 );
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
		mockSelect( "keyphraseDensityAIFixes", "visual", "blockEditor", [ { clientId: "test" } ], "test", "keyphraseDensity" );
		render( <AIOptimizeButton id="keyphraseDensity" isPremium={ true } /> );
		const button = screen.getByRole( "button" );

		fireEvent.click( button );

		expect( setActiveMarker ).toHaveBeenCalledWith( null );
		expect( setMarkerPauseStatus ).toHaveBeenCalledWith( false );
		expect( window.YoastSEO.analysis.applyMarks ).toHaveBeenCalled();
	} );
} );

