import Search from "../../src/settings/components/search";
import "../__mocks__/intersection-observer";
import "../__mocks__/navigator";
import { fireEvent, render, screen, waitFor } from "../test-utils";

jest.mock( "@wordpress/data", () => ( {
	useSelect: select => select( () => ( {
		selectQueryableSearchIndex: () => ( {
			test: {
				fieldId: "id",
				fieldLabel: "Item",
				keywords: "test",
				route: "/group",
				routeLabel: "Group",
			},
		} ),
	} ) ),
} ) );

jest.mock( "react-router-dom", () => ( {
	useNavigate: jest.fn(),
} ) );

describe( "Search", () => {
	beforeEach( () => {
		global.navigator.userAgent = "Mozilla/5.0 (Macintosh)";
		render( <Search /> );
	} );

	it( "should have a search button", () => {
		const button = screen.getByRole( "button" );
		expect( button ).toHaveTextContent( "Quick search..." );
		expect( button ).toMatchSnapshot();
	} );

	describe( "modal", () => {
		beforeEach( async() => {
			fireEvent.click( screen.getByRole( "button" ) );
			await screen.findByRole( "dialog" );
		} );

		it( "should open", () => {
			const modal = screen.getByRole( "dialog" );
			expect( modal ).toBeTruthy();
			expect( modal ).toMatchSnapshot();
		} );

		it( "should contain a combobox", () => {
			const input = screen.getByRole( "combobox" );
			expect( input.placeholder ).toBe( "Search..." );
			expect( input ).toHaveFocus();
		} );

		describe( "close button", () => {
			it( "should be present", () => {
				expect( screen.getByRole( "button", { name: "Close" } ) ).toBeTruthy();
			} );

			it( "should close on click", async() => {
				expect( screen.getByRole( "dialog" ) ).toBeTruthy();
				fireEvent.click( screen.getByRole( "button", { name: "Close" } ) );
				expect( screen.queryByRole( "dialog" ) ).toBe( null );
			} );
		} );

		it( "should contain title and description", () => {
			expect( screen.getByText( "Search" ) ).toBeTruthy();
			expect( screen.getByText( "Please enter a search term with at least 2 characters." ) ).toBeTruthy();
		} );

		it( "should show search results", async() => {
			fireEvent.change( screen.getByRole( "combobox" ), { target: { value: "test" } } );
			await waitFor( () => {
				const items = screen.getAllByRole( "presentation" );
				expect( items.length ).toBe( 2 );
				expect( items[ 0 ] ).toHaveTextContent( "Group" );
				expect( items[ 1 ] ).toHaveTextContent( "Item" );
				expect( screen.getByRole( "listbox" ) ).toMatchSnapshot();
			}, { timeout: 1000 } );
		} );

		it( "should show no results found", async() => {
			fireEvent.change( screen.getByRole( "combobox" ), { target: { value: "somethingthatisnotfound" } } );
			expect( screen.getByText( "No results found" ) ).toBeTruthy();
			expect( screen.getByText( "We couldn’t find anything with that term." ) ).toBeTruthy();
		} );
	} );
} );
