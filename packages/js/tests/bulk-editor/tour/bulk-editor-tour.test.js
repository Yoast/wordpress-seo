import { fireEvent, render, screen } from "../../test-utils";
import { BulkEditorTour } from "../../../src/bulk-editor/components/tour/bulk-editor-tour";
import { TOUR_OPT_IN_KEY } from "../../../src/bulk-editor/constants";

// Controls the mocked store reads per test.
const storeState = { isSeen: false, isAiEnabled: true };
const mockSetOptInNotificationSeen = jest.fn();

jest.mock( "@wordpress/data", () => ( {
	useSelect: ( mapSelect ) => mapSelect( () => ( {
		selectIsOptInNotificationSeen: () => storeState.isSeen,
		selectPreference: ( key, fallback ) => ( key === "isAiEnabled" ? storeState.isAiEnabled : fallback ),
	} ) ),
	useDispatch: () => ( { setOptInNotificationSeen: mockSetOptInNotificationSeen } ),
} ) );

// Bypass the DOM measuring/positioning; the controller only needs a style to render the card.
jest.mock( "../../../src/bulk-editor/components/tour/use-tour-anchor", () => ( {
	useTourAnchor: () => ( { style: { top: "0px", left: "0px", width: "10px", height: "10px" } } ),
} ) );

/**
 * Renders the tour and returns the select/deselect spies.
 *
 * @param {Object} [props] Prop overrides.
 * @returns {{onSelectAll: jest.Mock, onDeselectAll: jest.Mock}} The spies.
 */
const renderTour = ( props = {} ) => {
	const onSelectAll = jest.fn();
	const onDeselectAll = jest.fn();
	render(
		<BulkEditorTour
			onSelectAll={ onSelectAll }
			onDeselectAll={ onDeselectAll }
			hasSelection={ false }
			{ ...props }
		/>
	);
	return { onSelectAll, onDeselectAll };
};

const clickNext = () => fireEvent.click( screen.getByRole( "button", { name: /Next/ } ) );

describe( "BulkEditorTour", () => {
	beforeEach( () => {
		jest.clearAllMocks();
		storeState.isSeen = false;
		storeState.isAiEnabled = true;
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

	it( "marks the tour seen and clears its own selection on finish", () => {
		const { onDeselectAll } = renderTour( { hasSelection: false } );

		clickNext();
		clickNext();
		clickNext();
		fireEvent.click( screen.getByRole( "button", { name: "Got it!" } ) );

		expect( mockSetOptInNotificationSeen ).toHaveBeenCalledWith( TOUR_OPT_IN_KEY );
		expect( onDeselectAll ).toHaveBeenCalledTimes( 1 );
		expect( screen.queryByRole( "dialog" ) ).not.toBeInTheDocument();
	} );
} );
