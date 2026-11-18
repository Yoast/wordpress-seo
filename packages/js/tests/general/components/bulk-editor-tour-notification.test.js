import { fireEvent, render, screen, waitFor } from "../../test-utils";
import { BulkEditorTourNotification } from "../../../src/general/components/bulk-editor-tour-notification";
import { ROUTES } from "../../../src/general/routes";

const mockSetOptInNotificationSeen = jest.fn();
const mockHideOptInNotification = jest.fn();

// Controls the mocked store/router reads per test.
const state = {
	isSeen: false,
	isRtl: false,
	pathname: "/",
	bulkEditorUrl: "https://example.com/wp-admin/admin.php?page=wpseo_page_bulk_edit",
};

jest.mock( "@wordpress/data", () => ( {
	useDispatch: () => ( {
		setOptInNotificationSeen: mockSetOptInNotificationSeen,
		hideOptInNotification: mockHideOptInNotification,
	} ),
} ) );

jest.mock( "react-router-dom", () => ( {
	useLocation: () => ( { pathname: state.pathname } ),
} ) );

jest.mock( "../../../src/general/hooks", () => ( {
	useSelectGeneralPage: ( selector ) => {
		switch ( selector ) {
			case "selectIsOptInNotificationSeen":
				return state.isSeen;
			case "selectPreference":
				return state.isRtl;
			case "selectAdminLink":
				return state.bulkEditorUrl;
			default:
				return undefined;
		}
	},
} ) );

// Stub the routes barrel so the test does not pull in the whole routes/notices tree (which drags in withSelect etc.).
jest.mock( "../../../src/general/routes", () => ( {
	ROUTES: { firstTimeConfiguration: "/first-time-configuration" },
} ) );

describe( "BulkEditorTourNotification", () => {
	let originalLocation;

	beforeEach( () => {
		jest.clearAllMocks();
		state.isSeen = false;
		state.isRtl = false;
		state.pathname = "/";
		originalLocation = window.location;
		Object.defineProperty( window, "location", { configurable: true, value: { href: "" } } );
	} );

	afterEach( () => {
		Object.defineProperty( window, "location", { configurable: true, value: originalLocation } );
	} );

	it( "renders nothing once the tour has been seen", () => {
		state.isSeen = true;
		render( <BulkEditorTourNotification /> );

		expect( screen.queryByText( "New: Work faster with bulk updates" ) ).not.toBeInTheDocument();
	} );

	it( "renders nothing on the first-time configuration route", () => {
		state.pathname = ROUTES.firstTimeConfiguration;
		render( <BulkEditorTourNotification /> );

		expect( screen.queryByText( "New: Work faster with bulk updates" ) ).not.toBeInTheDocument();
	} );

	it( "shows the title, message and actions for a new user", () => {
		render( <BulkEditorTourNotification /> );

		expect( screen.getByText( "New: Work faster with bulk updates" ) ).toBeInTheDocument();
		expect( screen.getByText( /Use the Bulk Editor to get AI-generated/ ) ).toBeInTheDocument();
		// The footer Dismiss button carries visible text; the modal's icon-only close only has an aria-label.
		expect( screen.getByText( "Dismiss" ) ).toBeInTheDocument();
		expect( screen.getByRole( "button", { name: /Show me/ } ) ).toBeInTheDocument();
	} );

	it( "marks the tour seen and hides it when dismissed", async() => {
		render( <BulkEditorTourNotification /> );

		fireEvent.click( screen.getByText( "Dismiss" ) );

		await waitFor( () => {
			expect( mockSetOptInNotificationSeen ).toHaveBeenCalledWith( "bulk_editor_tour" );
		} );
		expect( mockHideOptInNotification ).toHaveBeenCalledWith( "bulk_editor_tour" );
	} );

	it( "navigates to the bulk editor when Show me is clicked", () => {
		render( <BulkEditorTourNotification /> );

		fireEvent.click( screen.getByRole( "button", { name: /Show me/ } ) );

		expect( window.location.href ).toBe( state.bulkEditorUrl );
	} );
} );
