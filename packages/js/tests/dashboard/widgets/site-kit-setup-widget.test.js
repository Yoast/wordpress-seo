import { render, screen, fireEvent } from "@testing-library/react";
import { MockDataProvider } from "../__mocks__/data-provider";
import { SiteKitSetupWidget } from "../../../src/dashboard/widgets/site-kit-setup-widget";

describe( "SiteKitSetupWidget", () => {
	let dataProvider;
	const onRemove = jest.fn();

	const defaultData = {
		installUrl: "https://example.com/install",
		activateUrl: "https://example.com/activate",
		setupUrl: "https://example.com/isSetup",
		isInstalled: false,
		isActive: false,
		isSetupCompleted: false,
		isConnected: false,
	};

	it( "renders the widget with install button", () => {
		dataProvider = new MockDataProvider();
		render( <SiteKitSetupWidget dataProvider={ dataProvider } /> );
		const installLink = screen.getByRole( "link", { name: /Install Site Kit by Google/i } );
		expect( installLink ).toBeInTheDocument();
		expect( installLink ).toHaveAttribute( "href", defaultData.installUrl );
	} );

	it( "renders the widget with learn more link", () => {
		render( <SiteKitSetupWidget dataProvider={ dataProvider } /> );
		const learnMoreLink = screen.getByRole( "link", { name: /Learn more/i } );
		expect( learnMoreLink ).toBeInTheDocument();
		expect( learnMoreLink ).toHaveAttribute( "href", "https://example.com/google-site-kit-learn-more" );
	} );

	it( "renders the widget with activate button", () => {
		dataProvider = new MockDataProvider( {
			siteKitConfiguration: {
				...defaultData,
				isInstalled: true,
			},
		} );
		render( <SiteKitSetupWidget dataProvider={ dataProvider } /> );
		const activateLink = screen.getByRole( "link", { name: /Activate Site Kit by Google/i } );
		expect( activateLink ).toBeInTheDocument();
		expect( activateLink ).toHaveAttribute( "href", defaultData.activateUrl );
	} );

	it( "renders the widget with setup button", () => {
		dataProvider = new MockDataProvider( {
			siteKitConfiguration: {
				...defaultData,
				isInstalled: true,
				isActive: true,
			},
		} );
		render( <SiteKitSetupWidget dataProvider={ dataProvider } /> );
		const setupLink = screen.getByRole( "link", { name: /Set up Site Kit by Google/i } );
		expect( setupLink ).toBeInTheDocument();
		expect( setupLink ).toHaveAttribute( "href", defaultData.setupUrl );
	} );

	it( "renders the widget with connect button", () => {
		dataProvider = new MockDataProvider( {
			siteKitConfiguration: {
				...defaultData,
				isInstalled: true,
				isActive: true,
				isSetupCompleted: true,
			},
		} );
		render( <SiteKitSetupWidget dataProvider={ dataProvider } /> );
		expect( screen.getByRole( "button", { name: /Connect Site Kit by Google/i } ) ).toBeInTheDocument();
	} );

	it( "renders the widget with dismiss button when connected", () => {
		dataProvider = new MockDataProvider( {
			siteKitConfiguration: {
				...defaultData,
				isInstalled: true,
				isActive: true,
				isSetupCompleted: true,
				isConnected: true,
			},
		} );
		render( <SiteKitSetupWidget dataProvider={ dataProvider } onRemove={ onRemove } /> );
		const dismissButton = screen.getByRole( "button", { name: /Dismiss/i } );
		expect( dismissButton ).toBeInTheDocument();
		fireEvent.click( dismissButton );
		expect( onRemove ).toHaveBeenCalled();
	} );

	it( "opens the menu and calls onRemove when 'Remove until next visit' is clicked", () => {
		render( <SiteKitSetupWidget dataProvider={ dataProvider } onRemove={ onRemove } /> );
		fireEvent.click( screen.getByRole( "button", { name: /Open Site Kit widget dropdown menu/i } ) );
		const removeButton = screen.getByRole( "menuitem", { name: /Remove until next visit/i, type: "button" } );
		fireEvent.click( removeButton );
		expect( onRemove ).toHaveBeenCalled();
	} );

	it( "opens the menu and calls onRemovePermanently when 'Remove permanently' is clicked", () => {
		render( <SiteKitSetupWidget dataProvider={ dataProvider } onRemove={ onRemove }  /> );
		fireEvent.click( screen.getByRole( "button", { name: /Open Site Kit widget dropdown menu/i } ) );
		const removeButton = screen.getByRole( "menuitem", { name: /Remove permanently/i, type: "button" } );
		fireEvent.click( removeButton );
		expect( onRemove ).toHaveBeenCalled();
	} );
} );
