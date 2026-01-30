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

// Mock ModalContent to avoid complex store dependencies
jest.mock( "../../../src/ai-optimizer/components/modal-content", () => ( {
	ModalContent: ( { onClose } ) => (
		<div data-testid="modal-content">
			<button onClick={ onClose }>Close</button>
		</div>
	),
} ) );

global.window.YoastSEO = {
	analysis: {
		applyMarks: jest.fn(),
		collectData: () => ( { _text: "Some text content with the keyphrase in it." } ),
	},
};

/**
 * Mock the useSelect function.
 * @param {Object} options The mock options.
 * @param {string} [options.activeAIButton=null] The active AI button ID.
 * @param {boolean} [options.shouldUpsellWoo=false] Whether to show the Yoast WooCommerce SEO upsell.
 * @returns {void}
 */
const mockSelect = ( { activeAIButton = null, shouldUpsellWoo = false } = {} ) => {
	useSelect.mockImplementation( select => select( () => ( {
		getActiveAIFixesButton: () => activeAIButton,
		getActiveMarker: () => "",
		getDisabledAIFixesButtons: () => ( {} ),
		getEditorBlocks: () => [],
		getBlockMode: () => "visual",
		getEditorMode: () => "visual",
		getEditorType: () => "blockEditor",
		getIsWooSeoUpsell: () => shouldUpsellWoo,
		getFocusKeyphrase: () => "test keyphrase",
		getFocusAIFixesButtonId: () => null,
	} ) ) );

	isTextViewActive.mockReturnValue( false );
};

describe( "AIOptimizeButton modal behavior", () => {
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

	test( "should open upsell modal and not call doAction when clicked without Premium", () => {
		mockSelect();
		render( <AIOptimizeButton id="keyphraseDensity" isPremium={ false } /> );
		const button = screen.getByRole( "button" );

		fireEvent.click( button );

		// The modal should be rendered (using mocked ModalContent)
		expect( screen.getByTestId( "modal-content" ) ).toBeInTheDocument();
		// doAction should NOT be called for upsell
		expect( doAction ).not.toHaveBeenCalled();
		// Marker status should not change for upsell
		expect( setMarkerStatus ).not.toHaveBeenCalled();
		// setActiveAIFixesButton should not be called for upsell
		expect( setActiveAIFixesButton ).not.toHaveBeenCalled();
	} );

	test( "should open upsell modal when clicking with WooCommerce upsell needed", () => {
		mockSelect( { shouldUpsellWoo: true } );
		render( <AIOptimizeButton id="keyphraseDensity" isPremium={ true } /> );
		const button = screen.getByRole( "button" );

		fireEvent.click( button );

		// The modal should be rendered (using mocked ModalContent)
		expect( screen.getByTestId( "modal-content" ) ).toBeInTheDocument();
		// doAction should NOT be called for WooCommerce upsell
		expect( doAction ).not.toHaveBeenCalled();
		// setActiveAIFixesButton should not be called for upsell
		expect( setActiveAIFixesButton ).not.toHaveBeenCalled();
	} );

	test( "should close modal when onClose is called", async() => {
		mockSelect();
		render( <AIOptimizeButton id="keyphraseDensity" isPremium={ false } /> );
		const aiButton = screen.getByRole( "button", { name: "Optimize with AI" } );

		// Open the modal
		fireEvent.click( aiButton );
		expect( screen.getByTestId( "modal-content" ) ).toBeInTheDocument();

		// Find and click the close button in the mocked modal (it's within modal-content)
		const modalContent = screen.getByTestId( "modal-content" );
		const closeButton = modalContent.querySelector( "button" );
		fireEvent.click( closeButton );

		// Modal should be closed
		await waitFor( () => {
			expect( screen.queryByTestId( "modal-content" ) ).not.toBeInTheDocument();
		} );
	} );
} );
