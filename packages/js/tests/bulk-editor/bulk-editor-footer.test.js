import { useDispatch, useSelect } from "@wordpress/data";
import { fireEvent, render, screen } from "../test-utils";
import { BulkEditorFooter } from "../../src/bulk-editor/components/bulk-editor-footer";

// BulkEditorFooter renders a <tfoot>; wrapping in a <table> silences the validateDOMNesting warning.
const renderInTable = ( ui ) => render( ui, { wrapper: ( { children } ) => <table>{ children }</table> } );

jest.mock( "@wordpress/data", () => ( { useDispatch: jest.fn(), useSelect: jest.fn() } ) );

describe( "BulkEditorFooter", () => {
	let requestSwitch;

	/**
	 * Points the mocked store selector at a given current page.
	 *
	 * @param {number} page The current page to report from the store.
	 *
	 * @returns {void}
	 */
	const mockCurrentPage = ( page ) => {
		// The component only selects the current page; return it regardless of the selector passed.
		useSelect.mockImplementation( () => page );
	};

	/**
	 * Stubs `window.matchMedia` so `useMediaQuery` resolves to a given breakpoint match.
	 *
	 * @param {boolean} matches Whether the media query should match (true = large/desktop viewport).
	 *
	 * @returns {void}
	 */
	const mockViewport = ( matches ) => {
		window.matchMedia = jest.fn().mockImplementation( ( media ) => ( {
			matches,
			media,
			addEventListener: jest.fn(),
			removeEventListener: jest.fn(),
		} ) );
	};

	beforeEach( () => {
		requestSwitch = jest.fn();
		useDispatch.mockReturnValue( { requestSwitch } );
		mockCurrentPage( 1 );
	} );

	it( "renders the result range for the current page", () => {
		mockCurrentPage( 2 );

		renderInTable( <BulkEditorFooter colSpan={ 3 } total={ 197 } totalPages={ 10 } isPending={ false } /> );

		// Page 2 with a page size of 20 spans results 21–40 of 197.
		expect( screen.getByText( /Showing/ ) ).toHaveTextContent( "Showing 21 to 40 of 197 results" );
	} );

	it( "caps the last result number at the total on the final page", () => {
		mockCurrentPage( 10 );

		renderInTable( <BulkEditorFooter colSpan={ 3 } total={ 197 } totalPages={ 10 } isPending={ false } /> );

		expect( screen.getByText( /Showing/ ) ).toHaveTextContent( "Showing 181 to 197 of 197 results" );
	} );

	it( "requests a guarded page switch when a page button is clicked", () => {
		mockCurrentPage( 1 );

		renderInTable( <BulkEditorFooter colSpan={ 3 } total={ 197 } totalPages={ 10 } isPending={ false } /> );

		fireEvent.click( screen.getByRole( "button", { name: "3" } ) );

		expect( requestSwitch ).toHaveBeenCalledWith( { kind: "page", target: 3 } );
	} );

	it( "shows fewer page buttons on a mobile viewport", () => {
		mockViewport( false );

		renderInTable( <BulkEditorFooter colSpan={ 3 } total={ 197 } totalPages={ 10 } isPending={ false } /> );

		// The compact mobile set (5 buttons) drops middle pages, so button "4" is not rendered at page 1.
		expect( screen.queryByRole( "button", { name: "4" } ) ).not.toBeInTheDocument();
		expect( screen.getByRole( "button", { name: "10" } ) ).toBeInTheDocument();
	} );

	it( "renders the summary but no pager when all results fit on one page", () => {
		renderInTable( <BulkEditorFooter colSpan={ 3 } total={ 5 } totalPages={ 1 } isPending={ false } /> );

		expect( screen.getByText( /Showing/ ) ).toHaveTextContent( "Showing 1 to 5 of 5 results" );
		expect( screen.queryByRole( "navigation" ) ).toBeNull();
	} );

	it( "renders nothing when there are no results", () => {
		renderInTable( <BulkEditorFooter colSpan={ 3 } total={ 0 } totalPages={ 0 } isPending={ false } /> );

		expect( screen.queryByRole( "rowgroup" ) ).toBeNull();
	} );
} );
