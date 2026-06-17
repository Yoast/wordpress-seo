import { useDispatch, useSelect } from "@wordpress/data";
import { fireEvent, render, screen } from "../test-utils";
import { BulkEditorFooter } from "../../src/bulk-editor/components/bulk-editor-footer";

jest.mock( "@wordpress/data", () => ( { useDispatch: jest.fn(), useSelect: jest.fn() } ) );

describe( "BulkEditorFooter", () => {
	let setPage;

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
		setPage = jest.fn();
		useDispatch.mockReturnValue( { setPage } );
		mockCurrentPage( 1 );
		// Default to the desktop viewport so the full set of page buttons renders.
		mockViewport( true );
	} );

	it( "renders the result range for the current page", () => {
		mockCurrentPage( 2 );

		render( <BulkEditorFooter total={ 197 } totalPages={ 10 } isPending={ false } /> );

		// Page 2 with a page size of 20 spans results 21–40 of 197.
		expect( screen.getByText( /Showing/ ) ).toHaveTextContent( "Showing 21 to 40 of 197 results" );
	} );

	it( "caps the last result number at the total on the final page", () => {
		mockCurrentPage( 10 );

		render( <BulkEditorFooter total={ 197 } totalPages={ 10 } isPending={ false } /> );

		expect( screen.getByText( /Showing/ ) ).toHaveTextContent( "Showing 181 to 197 of 197 results" );
	} );

	it( "dispatches setPage with the requested page when a page button is clicked", () => {
		mockCurrentPage( 1 );

		render( <BulkEditorFooter total={ 197 } totalPages={ 10 } isPending={ false } /> );

		fireEvent.click( screen.getByRole( "button", { name: "3" } ) );

		expect( setPage ).toHaveBeenCalledWith( 3 );
	} );

	it( "shows fewer page buttons on a mobile viewport", () => {
		mockViewport( false );

		render( <BulkEditorFooter total={ 197 } totalPages={ 10 } isPending={ false } /> );

		// The compact mobile set drops the inner pages, so a middle page like 4 is no longer rendered as a button.
		expect( screen.queryByRole( "button", { name: "4" } ) ).not.toBeInTheDocument();
		expect( screen.getByRole( "button", { name: "10" } ) ).toBeInTheDocument();
	} );

	it( "renders nothing when there are no results", () => {
		const { container } = render( <BulkEditorFooter total={ 0 } totalPages={ 0 } isPending={ false } /> );

		expect( container ).toBeEmptyDOMElement();
	} );

	it( "hides the result summary on mobile", () => {
		render( <BulkEditorFooter total={ 197 } totalPages={ 10 } isPending={ false } /> );

		const summary = screen.getByText( /Showing/ );
		expect( summary ).toHaveClass( "yst-hidden", "sm:yst-block" );
	} );
} );
