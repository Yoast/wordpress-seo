import { useDispatch } from "@wordpress/data";
import { fireEvent, render, screen } from "../test-utils";
import { SearchBox } from "../../src/bulk-editor/components/search-box";

jest.mock( "@wordpress/data", () => ( { useDispatch: jest.fn() } ) );

describe( "SearchBox", () => {
	let setSearch;

	beforeEach( () => {
		jest.useFakeTimers();
		setSearch = jest.fn();
		useDispatch.mockReturnValue( { setSearch } );
	} );

	afterEach( () => {
		jest.runOnlyPendingTimers();
		jest.useRealTimers();
	} );

	it( "renders an accessible search input and a content-type-aware placeholder", () => {
		render( <SearchBox contentTypeLabel="Pages" /> );

		const input = screen.getByLabelText( "Search posts" );
		expect( input ).toBeInTheDocument();
		expect( input ).toHaveAttribute( "placeholder", "Search for pages…" );
	} );

	it( "auto-searches the trimmed term after the debounce delay once it is long enough", () => {
		render( <SearchBox contentTypeLabel="Pages" /> );

		fireEvent.change( screen.getByLabelText( "Search posts" ), { target: { value: "  seo  " } } );
		// Nothing fires before the delay elapses.
		expect( setSearch ).not.toHaveBeenCalled();

		jest.advanceTimersByTime( 200 );

		expect( setSearch ).toHaveBeenCalledWith( "seo" );
	} );

	it( "does not auto-search while the term is below the minimum length", () => {
		render( <SearchBox contentTypeLabel="Pages" /> );

		fireEvent.change( screen.getByLabelText( "Search posts" ), { target: { value: "se" } } );
		jest.advanceTimersByTime( 200 );

		// 1-2 characters hold the previous results until the button is used.
		expect( setSearch ).not.toHaveBeenCalled();
	} );

	it( "auto-resets to the full list when the term is cleared", () => {
		render( <SearchBox contentTypeLabel="Pages" /> );
		const input = screen.getByLabelText( "Search posts" );

		// Search a term, then delete it back to empty.
		fireEvent.change( input, { target: { value: "seo" } } );
		jest.advanceTimersByTime( 200 );
		fireEvent.change( input, { target: { value: "" } } );
		jest.advanceTimersByTime( 200 );

		expect( setSearch ).toHaveBeenLastCalledWith( "" );
	} );

	it( "commits a single-character term immediately on submit, cancelling the pending auto-search", () => {
		render( <SearchBox contentTypeLabel="Pages" /> );

		fireEvent.change( screen.getByLabelText( "Search posts" ), { target: { value: "s" } } );
		fireEvent.click( screen.getByRole( "button", { name: "Search" } ) );
		jest.advanceTimersByTime( 200 );

		// A single dispatch from the button, none from the (cancelled) debounce.
		expect( setSearch ).toHaveBeenCalledTimes( 1 );
		expect( setSearch ).toHaveBeenCalledWith( "s" );
	} );

	it( "commits an empty term to clear the search on submit", () => {
		render( <SearchBox contentTypeLabel="Pages" /> );

		fireEvent.click( screen.getByRole( "button", { name: "Search" } ) );

		expect( setSearch ).toHaveBeenCalledWith( "" );
	} );
} );
