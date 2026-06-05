import { dispatch } from "@wordpress/data";
import { fireEvent, render, screen } from "../test-utils";
import App from "../../src/bulk-editor/app";
import { FIELD_SET_SEARCH, STORE_NAME } from "../../src/bulk-editor/constants";
import { DataProvider } from "../../src/bulk-editor/services";
import registerStore from "../../src/bulk-editor/store";

const dataProvider = new DataProvider( {
	contentTypes: [
		{ name: "page", label: "Pages" },
		{ name: "post", label: "Posts" },
	],
	endpoints: {},
	links: {},
} );

describe( "App", () => {
	beforeAll( () => {
		registerStore();
	} );

	beforeEach( () => {
		// The store lives in the global registry: reset the view state so tests stay order-independent.
		dispatch( STORE_NAME ).setActiveFieldSet( FIELD_SET_SEARCH );
		dispatch( STORE_NAME ).setActiveContentType( "" );
	} );

	it( "renders the header, tabs and panel in a single card with the header separator", () => {
		const { container } = render( <App dataProvider={ dataProvider } /> );

		const papers = container.querySelectorAll( ".yst-paper" );
		expect( papers ).toHaveLength( 1 );
		expect( papers[ 0 ] ).toContainElement( screen.getByRole( "heading", { level: 1 } ) );
		expect( papers[ 0 ] ).toContainElement( screen.getByRole( "tablist", { name: "Bulk editor views" } ) );
		expect( papers[ 0 ] ).toContainElement( screen.getByRole( "tabpanel" ) );
		// The header carries the separator line between itself and the content.
		expect( screen.getByRole( "banner" ) ).toHaveClass( "yst-border-b" );
	} );

	it( "renders the page header for the first content type", () => {
		render( <App dataProvider={ dataProvider } /> );

		expect( screen.getByRole( "heading", { level: 1, name: "Bulk editor: Pages" } ) ).toBeInTheDocument();
		expect(
			screen.getByText( "The bulk editor for pages is a tool that you can use to quickly make changes to your search and social media appearance for multiple pages." )
		).toBeInTheDocument();
	} );

	it( "renders the content type navigation with the first content type active", () => {
		render( <App dataProvider={ dataProvider } /> );

		expect( screen.getByRole( "navigation", { name: "Bulk editor menu" } ) ).toBeInTheDocument();
		expect( screen.getByRole( "link", { name: "Back to Tools" } ) ).toHaveAttribute( "href", "admin.php?page=wpseo_tools" );
		expect( screen.getByRole( "button", { name: "Pages" } ) ).toHaveAttribute( "aria-current", "page" );
	} );

	it( "drives the header copy from the selected content type", () => {
		render( <App dataProvider={ dataProvider } /> );

		fireEvent.click( screen.getByRole( "button", { name: "Posts" } ) );

		expect( screen.getByRole( "button", { name: "Posts" } ) ).toHaveAttribute( "aria-current", "page" );
		expect( screen.getByRole( "heading", { level: 1, name: "Bulk editor: Posts" } ) ).toBeInTheDocument();
		expect(
			screen.getByText( "The bulk editor for posts is a tool that you can use to quickly make changes to your search and social media appearance for multiple posts." )
		).toBeInTheDocument();
	} );

	it( "renders the tabs with Search appearance active by default", () => {
		render( <App dataProvider={ dataProvider } /> );

		expect( screen.getByRole( "tab", { name: "Search appearance" } ) ).toHaveAttribute( "aria-selected", "true" );
		// The panel holds the field-set table for the active tab.
		expect( screen.getByRole( "columnheader", { name: "SEO title" } ) ).toBeInTheDocument();
		expect( screen.getByRole( "columnheader", { name: "Meta description" } ) ).toBeInTheDocument();
	} );

	it( "switches the panel when the Social appearance tab is activated", () => {
		render( <App dataProvider={ dataProvider } /> );

		fireEvent.click( screen.getByRole( "tab", { name: "Social appearance" } ) );

		expect( screen.getByRole( "tab", { name: "Social appearance" } ) ).toHaveAttribute( "aria-selected", "true" );
		expect( screen.getByRole( "columnheader", { name: "Social title" } ) ).toBeInTheDocument();
		expect( screen.getByRole( "columnheader", { name: "Social description" } ) ).toBeInTheDocument();
	} );
} );
