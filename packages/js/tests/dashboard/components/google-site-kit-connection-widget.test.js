import { render, screen, fireEvent } from "@testing-library/react";
import { GoogleSiteKitConnectionWidget } from "../../../src/dashboard/components/google-site-kit-connection-widget";

jest.mock( "@wordpress/data", () => ( {
	useSelect: jest.fn( () =>  [] ),
} ) );

describe( "GoogleSiteKitConnectionWidget", () => {
	const defaultProps = {
		installUrl: "https://example.com/install",
		activateUrl: "https://example.com/activate",
		setupUrl: "https://example.com/setup",
		connected: false,
		active: false,
		setup: false,
		installed: false,
		onRemove: jest.fn(),
		onRemovePermanently: jest.fn(),
	};

	it( "renders the widget with install button", () => {
		render( <GoogleSiteKitConnectionWidget { ...defaultProps } /> );
		expect( screen.getByText( "Install Site Kit by Google" ) ).toBeInTheDocument();
	} );

	it( "renders the widget with activate button", () => {
		render( <GoogleSiteKitConnectionWidget { ...defaultProps } installed={ true } /> );
		expect( screen.getByText( "Activate Site Kit by Google" ) ).toBeInTheDocument();
	} );

	it( "renders the widget with setup button", () => {
		render( <GoogleSiteKitConnectionWidget { ...defaultProps } installed={ true } active={ true } /> );
		expect( screen.getByText( "Set up Site Kit by Google" ) ).toBeInTheDocument();
	} );

	it( "renders the widget with connect button", () => {
		render( <GoogleSiteKitConnectionWidget { ...defaultProps } installed={ true } active={ true } setup={ true } /> );
		expect( screen.getByText( "Connect Site Kit by Google" ) ).toBeInTheDocument();
	} );

	it( "renders the widget with dismiss button when connected", () => {
		render( <GoogleSiteKitConnectionWidget { ...defaultProps } installed={ true } active={ true } setup={ true } connected={ true } /> );
		expect( screen.getByText( "Dismiss" ) ).toBeInTheDocument();
	} );

	it( "opens the menu and calls onRemove when 'Remove until next visit' is clicked", () => {
		render( <GoogleSiteKitConnectionWidget { ...defaultProps } /> );
		fireEvent.click( screen.getByRole( "button", { name: /open menu/i } ) );
		fireEvent.click( screen.getByText( "Remove until next visit" ) );
		expect( defaultProps.onRemove ).toHaveBeenCalled();
	} );

	it( "opens the menu and calls onRemovePermanently when 'Remove permanently' is clicked", () => {
		render( <GoogleSiteKitConnectionWidget { ...defaultProps } /> );
		fireEvent.click( screen.getByRole( "button", { name: /open menu/i } ) );
		fireEvent.click( screen.getByText( "Remove permanently" ) );
		expect( defaultProps.onRemovePermanently ).toHaveBeenCalled();
	} );
} );
