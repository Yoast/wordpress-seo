import { fireEvent, render, screen } from "../../test-utils";
import { BulkEditorTour } from "../../../src/bulk-editor/components/tour/bulk-editor-tour";
import { TOUR_OPT_IN_KEY } from "../../../src/bulk-editor/constants";

// Controls the mocked store reads per test.
const storeState = { isSeen: false, isAiEnabled: true };
const mockSetOptInNotificationSeen = jest.fn();
const mockHideOptInNotification = jest.fn();

jest.mock( "@wordpress/data", () => ( {
	useSelect: ( mapSelect ) => mapSelect( () => ( {
		selectIsOptInNotificationSeen: () => storeState.isSeen,
		selectPreference: ( key, fallback ) => ( key === "isAiEnabled" ? storeState.isAiEnabled : fallback ),
	} ) ),
	useDispatch: () => ( { setOptInNotificationSeen: mockSetOptInNotificationSeen, hideOptInNotification: mockHideOptInNotification } ),
} ) );

const mockAnchor = { spotlight: null, targetMissing: false };
const defaultSpotlight = () => ( {
	rects: [ { top: 0, left: 0, width: 10, height: 10 } ],
	bounds: { top: "0px", left: "0px", width: "10px", height: "10px" },
	viewport: { width: 1024, height: 768 },
} );

jest.mock( "../../../src/bulk-editor/components/tour/use-tour-anchor", () => ( {
	useTourAnchor: () => mockAnchor,
} ) );

/**
 * Renders the tour and returns the select/deselect spies plus a re-render helper.
 *
 * @param {Object} [props] Prop overrides.
 * @returns {{onSelectAll: jest.Mock, onDeselectAll: jest.Mock, rerender: Function}} The spies and a re-render helper.
 */
const renderTour = ( props = {} ) => {
	const onSelectAll = jest.fn();
	const onDeselectAll = jest.fn();
	const makeElement = () => (
		<BulkEditorTour
			onSelectAll={ onSelectAll }
			onDeselectAll={ onDeselectAll }
			hasSelection={ false }
			{ ...props }
		/>
	);
	const view = render( makeElement() );
	// A fresh element each time, so React actually re-renders (it bails out on an identical element reference).
	return { onSelectAll, onDeselectAll, rerender: () => view.rerender( makeElement() ) };
};

const clickNext = () => fireEvent.click( screen.getByRole( "button", { name: /Next/ } ) );

describe( "BulkEditorTour", () => {
	beforeEach( () => {
		jest.clearAllMocks();
		storeState.isSeen = false;
		storeState.isAiEnabled = true;
		mockAnchor.spotlight = defaultSpotlight();
		mockAnchor.targetMissing = false;
	} );

	it( "renders nothing once the tour has been seen", () => {
		storeState.isSeen = true;
		renderTour();

		expect( screen.queryByRole( "dialog" ) ).not.toBeInTheDocument();
	} );

	it( "auto-starts on the first step for a new user", () => {
		renderTour();

		expect( screen.getByText( "1 / 4" ) ).toBeInTheDocument();
		expect( screen.getByRole( "heading", { name: "Select your content type" } ) ).toBeInTheDocument();
	} );

	it( "advances and goes back through the steps", () => {
		renderTour();

		clickNext();
		expect( screen.getByText( "2 / 4" ) ).toBeInTheDocument();

		fireEvent.click( screen.getByRole( "button", { name: "Back" } ) );
		expect( screen.getByText( "1 / 4" ) ).toBeInTheDocument();
	} );

	it( "drops the generate step when AI is disabled, leaving three steps", () => {
		storeState.isAiEnabled = false;
		renderTour();

		clickNext();
		clickNext();

		expect( screen.getByText( "3 / 3" ) ).toBeInTheDocument();
		expect( screen.queryByText( "Get SEO-friendly options at scale" ) ).not.toBeInTheDocument();
	} );

	it( "selects rows when reaching the generate step so its target can appear", () => {
		const { onSelectAll } = renderTour( { hasSelection: false } );

		// Advance through steps 2 and 3 to the generate step (step 4), which requires a selection.
		clickNext();
		clickNext();
		clickNext();

		expect( onSelectAll ).toHaveBeenCalledTimes( 1 );
	} );

	it( "does not re-select when the user already has a selection", () => {
		const { onSelectAll } = renderTour( { hasSelection: true } );

		clickNext();
		clickNext();
		clickNext();

		expect( onSelectAll ).not.toHaveBeenCalled();
	} );

	it( "finishes and marks the tour seen if the last step's target never appears", () => {
		const { onDeselectAll, rerender } = renderTour( { hasSelection: false } );

		// Reach the generate step (step 4).
		clickNext();
		clickNext();
		clickNext();

		// Its target never shows (e.g. nothing is selectable), so the anchor reports it missing.
		mockAnchor.spotlight = null;
		mockAnchor.targetMissing = true;
		rerender();

		expect( mockSetOptInNotificationSeen ).toHaveBeenCalledWith( TOUR_OPT_IN_KEY );
		expect( onDeselectAll ).toHaveBeenCalledTimes( 1 );
		expect( screen.queryByRole( "dialog" ) ).not.toBeInTheDocument();
	} );

	it( "marks the tour seen and clears its own selection on finish", () => {
		const { onDeselectAll } = renderTour( { hasSelection: false } );

		clickNext();
		clickNext();
		clickNext();
		fireEvent.click( screen.getByRole( "button", { name: "Got it!" } ) );

		expect( mockSetOptInNotificationSeen ).toHaveBeenCalledWith( TOUR_OPT_IN_KEY );
		expect( mockHideOptInNotification ).toHaveBeenCalledWith( TOUR_OPT_IN_KEY );
		expect( onDeselectAll ).toHaveBeenCalledTimes( 1 );
		expect( screen.queryByRole( "dialog" ) ).not.toBeInTheDocument();
	} );
} );
