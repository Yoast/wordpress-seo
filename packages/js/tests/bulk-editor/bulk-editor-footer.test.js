import { useDispatch, useSelect } from "@wordpress/data";
import { fireEvent, render, screen } from "../test-utils";
import { BulkEditorFooter } from "../../src/bulk-editor/components/bulk-editor-footer";

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

	beforeEach( () => {
		requestSwitch = jest.fn();
		useDispatch.mockReturnValue( { requestSwitch } );
		mockCurrentPage( 1 );
	} );

	it( "renders the result range for the current page", () => {
		mockCurrentPage( 2 );

		render( <BulkEditorFooter colSpan={ 3 } total={ 197 } totalPages={ 10 } isPending={ false } /> );

		// Page 2 with a page size of 20 spans results 21–40 of 197.
		expect( screen.getByText( /Showing/ ) ).toHaveTextContent( "Showing 21 to 40 of 197 results" );
	} );

	it( "caps the last result number at the total on the final page", () => {
		mockCurrentPage( 10 );

		render( <BulkEditorFooter colSpan={ 3 } total={ 197 } totalPages={ 10 } isPending={ false } /> );

		expect( screen.getByText( /Showing/ ) ).toHaveTextContent( "Showing 181 to 197 of 197 results" );
	} );

	it( "requests a guarded page switch when a page button is clicked", () => {
		mockCurrentPage( 1 );

		render( <BulkEditorFooter colSpan={ 3 } total={ 197 } totalPages={ 10 } isPending={ false } /> );

		fireEvent.click( screen.getByRole( "button", { name: "3" } ) );

		expect( requestSwitch ).toHaveBeenCalledWith( { kind: "page", target: 3 } );
	} );

	it( "renders nothing when there are no results", () => {
		const { container } = render( <BulkEditorFooter colSpan={ 3 } total={ 0 } totalPages={ 0 } isPending={ false } /> );

		expect( container ).toBeEmptyDOMElement();
	} );
} );
