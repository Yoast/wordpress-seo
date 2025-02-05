import { render, screen, fireEvent } from "@testing-library/react";
import { SiteKitSetupWidget } from "../../../src/dashboard/components/site-kit-setup-widget";

describe( "SiteKitSetupWidget", () => {
	const defaultProps = {
		installUrl: "https://example.com/install",
		activateUrl: "https://example.com/activate",
		setupUrl: "https://example.com/isSetup",
		isConnected: false,
		isActive: false,
		isSetupCompleted: false,
		isInstalled: false,
		onRemove: jest.fn(),
		onRemovePermanently: jest.fn(),
		learnMoreLink: "https://example.com/learn-more",
	};

	it( "renders the widget with install button", () => {
		render( <SiteKitSetupWidget { ...defaultProps } /> );
		expect( screen.getByRole( "link", { name: /Install Site Kit by Google/i } ) ).toBeInTheDocument();
	} );

	it( "renders the widget with activate button", () => {
		render( <SiteKitSetupWidget { ...defaultProps } isInstalled={ true } /> );
		expect( screen.getByRole( "link", { name: /Activate Site Kit by Google/i } ) ).toBeInTheDocument();
	} );

	it( "renders the widget with setup button", () => {
		render( <SiteKitSetupWidget { ...defaultProps } isInstalled={ true } isActive={ true } /> );
		expect( screen.getByRole( "link", { name: /Set up Site Kit by Google/i } ) ).toBeInTheDocument();
	} );

	it( "renders the widget with connect button", () => {
		render( <SiteKitSetupWidget { ...defaultProps } isInstalled={ true } isActive={ true } isSetupCompleted={ true } /> );
		expect( screen.getByRole( "button", { name: /Connect Site Kit by Google/i } ) ).toBeInTheDocument();
	} );

	it( "renders the widget with dismiss button when connected", () => {
		render( <SiteKitSetupWidget { ...defaultProps } isInstalled={ true } isActive={ true } isSetupCompleted={ true } isConnected={ true } /> );
		expect( screen.getByRole( "button", { name: /Dismiss/i } ) ).toBeInTheDocument();
	} );

	it( "opens the menu and calls onRemove when 'Remove until next visit' is clicked", () => {
		render( <SiteKitSetupWidget { ...defaultProps } /> );
		fireEvent.click( screen.getByRole( "button", { name: /open menu/i } ) );
		const removeButton = screen.getByRole( "menuitem", { name: /Remove until next visit/i, type: "button" } );
		fireEvent.click( removeButton );
		expect( defaultProps.onRemove ).toHaveBeenCalled();
	} );

	it( "opens the menu and calls onRemovePermanently when 'Remove permanently' is clicked", () => {
		render( <SiteKitSetupWidget { ...defaultProps } /> );
		fireEvent.click( screen.getByRole( "button", { name: /open menu/i } ) );
		const removeButton = screen.getByRole( "menuitem", { name: /Remove permanently/i, type: "button" } );
		fireEvent.click( removeButton );
		expect( defaultProps.onRemovePermanently ).toHaveBeenCalled();
	} );
} );
