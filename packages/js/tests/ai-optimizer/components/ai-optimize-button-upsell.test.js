import { render, screen } from "../../test-utils";
import { useSelect, useDispatch } from "@wordpress/data";

import { isTextViewActive } from "../../../src/lib/tinymce";
import AIOptimizeButton from "../../../src/ai-optimizer/components/ai-optimize-button";

jest.mock( "@wordpress/data", () => ( {
	useDispatch: jest.fn(),
	useSelect: jest.fn(),
	combineReducers: jest.fn(),
	registerStore: jest.fn(),
} ) );

jest.mock( "@wordpress/hooks", () => ( {
	doAction: jest.fn(),
} ) );

jest.mock( "../../../src/lib/tinymce", () => ( {
	isTextViewActive: jest.fn(),
} ) );

global.window.YoastSEO = {
	analysis: {
		applyMarks: jest.fn(),
		collectData: () => ( { _text: "" } ),
	},
};

/**
 * Mock the useSelect function for upsell mode tests.
 * @param {string} editorMode The editor mode.
 * @param {string} editorType The editor type.
 * @param {object[]} blocks The blocks.
 * @returns {void}
 */
const mockSelect = ( editorMode, editorType, blocks = [] ) => {
	useSelect.mockImplementation( select => select( () => ( {
		getActiveAIFixesButton: () => null,
		getActiveMarker: () => "",
		getDisabledAIFixesButtons: () => ( {} ),
		getEditorBlocks: () => blocks,
		getBlockMode: ( clientId ) => clientId === "htmlTest" ? "text" : "visual",
		getEditorMode: () => editorMode,
		getEditorType: () => editorType,
		getIsWooSeoUpsell: () => false,
		getFocusKeyphrase: () => "",
	} ) ) );

	isTextViewActive.mockReturnValue( editorMode === "text" );
};

describe( "AIOptimizeButton upsell mode", () => {
	beforeEach( () => {
		useDispatch.mockImplementation( () => ( {
			setActiveAIFixesButton: jest.fn(),
			setActiveMarker: jest.fn(),
			setMarkerPauseStatus: jest.fn(),
			setMarkerStatus: jest.fn(),
		} ) );
	} );

	afterEach( () => {
		jest.clearAllMocks();
	} );

	test( "should be enabled in visual mode in block editor", () => {
		mockSelect( "visual", "blockEditor" );
		render( <AIOptimizeButton id="someAssessment" isPremium={ false } /> );
		const button = screen.getByRole( "button" );
		expect( button ).toBeEnabled();
	} );

	test( "should be disabled in text mode in block editor", () => {
		mockSelect( "text", "blockEditor" );
		render( <AIOptimizeButton id="someAssessment" isPremium={ false } /> );
		const button = screen.getByRole( "button" );
		expect( button ).toBeDisabled();
		expect( button ).toHaveAttribute( "aria-label", "Please switch to the visual editor to optimize with AI." );
	} );

	test( "should be enabled in visual mode in classic editor", () => {
		mockSelect( "visual", "classicEditor" );
		render( <AIOptimizeButton id="someAssessment" isPremium={ false } /> );
		const button = screen.getByRole( "button" );
		expect( button ).toBeEnabled();
	} );

	test( "should be disabled in text mode in classic editor", () => {
		mockSelect( "text", "classicEditor" );
		render( <AIOptimizeButton id="someAssessment" isPremium={ false } /> );
		const button = screen.getByRole( "button" );
		expect( button ).toBeDisabled();
		expect( button ).toHaveAttribute( "aria-label", "Please switch to the visual editor to optimize with AI." );
	} );

	test( "should be disabled when a block is in HTML mode", () => {
		mockSelect( "visual", "blockEditor", [ { clientId: "htmlTest" } ] );
		render( <AIOptimizeButton id="someAssessment" isPremium={ false } /> );
		const button = screen.getByRole( "button" );
		expect( button ).toBeDisabled();
		expect( button ).toHaveAttribute( "aria-label", "Please switch to the visual editor to optimize with AI." );
	} );
} );
