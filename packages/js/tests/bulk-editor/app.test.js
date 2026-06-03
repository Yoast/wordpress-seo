import { fireEvent, render, screen } from "../test-utils";
import App from "../../src/bulk-editor/app";
import registerStore from "../../src/bulk-editor/store";

describe( "App", () => {
	beforeAll( () => {
		registerStore();
	} );

	it( "renders the page header", () => {
		render( <App /> );

		expect( screen.getByRole( "heading", { level: 1, name: "Bulk editor" } ) ).toBeInTheDocument();
	} );

	it( "renders the tabs with Search appearance active by default", () => {
		render( <App /> );

		expect( screen.getByRole( "tab", { name: "Search appearance" } ) ).toHaveAttribute( "aria-selected", "true" );
		expect( screen.getByRole( "tabpanel" ) ).toHaveTextContent( "The Search appearance fields will be editable here." );
	} );

	it( "switches the panel when the Social appearance tab is activated", () => {
		render( <App /> );

		fireEvent.click( screen.getByRole( "tab", { name: "Social appearance" } ) );

		expect( screen.getByRole( "tab", { name: "Social appearance" } ) ).toHaveAttribute( "aria-selected", "true" );
		expect( screen.getByRole( "tabpanel" ) ).toHaveTextContent( "The Social appearance fields will be editable here." );
	} );
} );
