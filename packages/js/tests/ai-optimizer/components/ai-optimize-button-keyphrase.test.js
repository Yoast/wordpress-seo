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
		collectData: () => ( { _text: "Some text content" } ),
	},
};

/**
 * Mock the useSelect function for keyphrase tests.
 * @param {string} keyword The focus keyphrase.
 * @param {string} content The editor content.
 * @returns {void}
 */
const mockSelect = ( keyword, content ) => {
	useSelect.mockImplementation( select => select( () => ( {
		getActiveAIFixesButton: () => null,
		getActiveMarker: () => "",
		getDisabledAIFixesButtons: () => ( {} ),
		getEditorBlocks: () => [],
		getBlockMode: () => "visual",
		getEditorMode: () => "visual",
		getEditorType: () => "blockEditor",
		getIsWooSeoUpsell: () => false,
		getFocusKeyphrase: () => keyword,
		getFocusAIFixesButtonId: () => null,
	} ) ) );

	global.window.YoastSEO.analysis.collectData = () => ( { _text: content } );
	isTextViewActive.mockReturnValue( false );
};

describe( "AIOptimizeButton keyphrase validation", () => {
	beforeEach( () => {
		useDispatch.mockImplementation( () => ( {
			setActiveAIFixesButton: jest.fn(),
			setActiveMarker: jest.fn(),
			setMarkerPauseStatus: jest.fn(),
			setMarkerStatus: jest.fn(),
			setFocusAIFixesButtonId: jest.fn(),
		} ) );
	} );

	afterEach( () => {
		jest.clearAllMocks();
	} );

	test( "should be disabled when both keyphrase and content are missing", () => {
		mockSelect( "", "" );
		render( <AIOptimizeButton id="introductionKeyword" isPremium={ true } /> );
		const button = screen.getByRole( "button" );
		expect( button ).toBeDisabled();
		expect( button ).toHaveAttribute( "aria-label", "Please add both a keyphrase and some text to your content." );
	} );

	test( "should be disabled when keyphrase is missing", () => {
		mockSelect( "", "Some test content" );
		render( <AIOptimizeButton id="introductionKeyword" isPremium={ true } /> );
		const button = screen.getByRole( "button" );
		expect( button ).toBeDisabled();
		expect( button ).toHaveAttribute( "aria-label", "Please add both a keyphrase and some text to your content." );
	} );

	test( "should be disabled when content is missing", () => {
		mockSelect( "test keyphrase", "" );
		render( <AIOptimizeButton id="keyphraseDensity" isPremium={ true } /> );
		const button = screen.getByRole( "button" );
		expect( button ).toBeDisabled();
		expect( button ).toHaveAttribute( "aria-label", "Please add both a keyphrase and some text to your content." );
	} );

	test( "should be disabled when keyphrase is whitespace only", () => {
		mockSelect( "   ", "Some test content" );
		render( <AIOptimizeButton id="keyphraseDensity" isPremium={ true } /> );
		const button = screen.getByRole( "button" );
		expect( button ).toBeDisabled();
		expect( button ).toHaveAttribute( "aria-label", "Please add both a keyphrase and some text to your content." );
	} );

	test( "should be enabled when both keyphrase and content are present", () => {
		mockSelect( "test keyphrase", "Some test content with the keyphrase in it." );
		render( <AIOptimizeButton id="introductionKeyword" isPremium={ true } /> );
		const button = screen.getByRole( "button" );
		expect( button ).toBeEnabled();
		expect( button ).toHaveAttribute( "aria-label", "Optimize with AI" );
	} );

	test( "should not apply keyphrase validation to non-keyphrase assessments", () => {
		mockSelect( "", "" );
		render( <AIOptimizeButton id="someOtherAssessment" isPremium={ true } /> );
		const button = screen.getByRole( "button" );
		expect( button ).toBeEnabled();
		expect( button ).toHaveAttribute( "aria-label", "Optimize with AI" );
	} );
} );
