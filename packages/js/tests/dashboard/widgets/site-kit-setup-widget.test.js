import { beforeEach, describe, expect, it, jest } from "@jest/globals";
import { SiteKitSetupWidget } from "../../../src/dashboard/widgets/site-kit-setup-widget";
import { fireEvent, render, screen, waitFor } from "../../test-utils";
import { MockDataProvider } from "../__mocks__/data-provider";
import { MockRemoteDataProvider } from "../__mocks__/remote-data-provider";

describe( "SiteKitSetupWidget", () => {
	let dataProvider;
	const remoteDataProvider = new MockRemoteDataProvider( {} );
	const removeWidget = jest.fn();
	const addWidget = jest.fn();
	const props = {
		removeWidget,
		addWidget,
	};

	beforeEach( () => {
		dataProvider = new MockDataProvider();
		remoteDataProvider.fetchJson.mockClear();
		removeWidget.mockClear();
	} );

	it( "renders the widget with install button", () => {
		render( <SiteKitSetupWidget
			dataProvider={ dataProvider }
			remoteDataProvider={ remoteDataProvider }
			{ ...props }
		/> );
		const installLink = screen.getByRole( "link", { name: /Install Site Kit by Google/i } );
		expect( installLink ).toBeInTheDocument();
		expect( installLink ).toHaveAttribute( "href", "https://example.com/install" );
	} );

	it( "renders the widget with learn more link", () => {
		render( <SiteKitSetupWidget
			dataProvider={ dataProvider }
			remoteDataProvider={ remoteDataProvider }
			{ ...props }
		/> );
		const learnMoreLink = screen.getByRole( "link", { name: /Learn more/i } );
		expect( learnMoreLink ).toBeInTheDocument();
		expect( learnMoreLink ).toHaveAttribute( "href", "https://example.com/google-site-kit-learn-more" );
	} );

	it( "renders the widget with activate button", () => {
		dataProvider = new MockDataProvider( {
			siteKitConfiguration: {
				isInstalled: true,
			},
		} );
		render( <SiteKitSetupWidget
			dataProvider={ dataProvider }
			remoteDataProvider={ remoteDataProvider }
			{ ...props }
		/> );
		const activateLink = screen.getByRole( "link", { name: /Activate Site Kit by Google/i } );
		expect( activateLink ).toBeInTheDocument();
		expect( activateLink ).toHaveAttribute( "href", "https://example.com/activate" );
	} );

	it( "renders the widget with setup button", () => {
		dataProvider = new MockDataProvider( {
			siteKitConfiguration: {
				isInstalled: true,
				isActive: true,
			},
		} );
		render( <SiteKitSetupWidget
			dataProvider={ dataProvider }
			remoteDataProvider={ remoteDataProvider }
			{ ...props }
		/> );
		const setupLink = screen.getByRole( "link", { name: /Set up Site Kit by Google/i } );
		expect( setupLink ).toBeInTheDocument();
		expect( setupLink ).toHaveAttribute( "href", "https://example.com/isSetup" );
	} );

	it( "renders the widget with connect button", () => {
		dataProvider = new MockDataProvider( {
			siteKitConfiguration: {
				isInstalled: true,
				isActive: true,
				isSetupCompleted: true,
			},
		} );
		render( <SiteKitSetupWidget
			dataProvider={ dataProvider }
			remoteDataProvider={ remoteDataProvider }
			{ ...props }
		/> );
		expect( screen.getByRole( "button", { name: /Connect Site Kit by Google/i } ) ).toBeInTheDocument();
	} );

	it( "opens the grant consent modal when clicking on connect", () => {
		dataProvider = new MockDataProvider( {
			siteKitConfiguration: {
				isInstalled: true,
				isActive: true,
				isSetupCompleted: true,
			},
		} );
		render( <SiteKitSetupWidget
			dataProvider={ dataProvider }
			remoteDataProvider={ remoteDataProvider }
			{ ...props }
		/> );
		const connectButton = screen.getByRole( "button", { name: /Connect Site Kit by Google/i } );
		fireEvent.click( connectButton );
		expect( screen.getByRole( "button", { name: /Grant consent/i } ) ).toBeInTheDocument();
	} );

	it( "requests consent when clicking on grant consent", async() => {
		dataProvider = new MockDataProvider( {
			siteKitConfiguration: {
				isInstalled: true,
				isActive: true,
				isSetupCompleted: true,
			},
		} );
		remoteDataProvider.fetchJson.mockResolvedValueOnce( { success: true } );
		render( <SiteKitSetupWidget
			{ ...props }
			dataProvider={ dataProvider }
			remoteDataProvider={ remoteDataProvider }
		/> );
		fireEvent.click( screen.getByRole( "button", { name: /Connect Site Kit by Google/i } ) );

		fireEvent.click( screen.getByRole( "button", { name: /Grant consent/i } ) );
		await waitFor( () => {
			expect( screen.getByRole( "button", { name: /Got it!/i } ) ).toBeInTheDocument();
		} );

		expect( remoteDataProvider.fetchJson ).toHaveBeenCalledWith(
			"https://example.com/site-kit-consent-management",
			{ consent: "true" },
			expect.objectContaining( { method: "POST" } )
		);
	} );

	it( "stays on the modal when the consent request returns false", async() => {
		dataProvider = new MockDataProvider( {
			siteKitConfiguration: {
				isInstalled: true,
				isActive: true,
				isSetupCompleted: true,
			},
		} );
		remoteDataProvider.fetchJson.mockResolvedValueOnce( { success: false } );
		render( <SiteKitSetupWidget
			dataProvider={ dataProvider }
			remoteDataProvider={ remoteDataProvider }
			{ ...props }
		/> );
		fireEvent.click( screen.getByRole( "button", { name: /Connect Site Kit by Google/i } ) );

		const grantConsentButton = screen.getByRole( "button", { name: /Grant consent/i } );
		fireEvent.click( grantConsentButton );
		await waitFor( () => {
			expect( grantConsentButton ).toBeInTheDocument();
		} );
		expect( screen.queryByRole( "button", { name: /Got it!/i } ) ).not.toBeInTheDocument();
		expect( addWidget ).toHaveBeenCalledWith( "topPages" );

		expect( remoteDataProvider.fetchJson ).toHaveBeenCalledWith(
			"https://example.com/site-kit-consent-management",
			{ consent: "true" },
			expect.objectContaining( { method: "POST" } )
		);
	} );

	it( "stays on the modal when the consent request errors", async() => {
		dataProvider = new MockDataProvider( {
			siteKitConfiguration: {
				isInstalled: true,
				isActive: true,
				isSetupCompleted: true,
			},
		} );
		remoteDataProvider.fetchJson.mockRejectedValueOnce( new Error( "Failed to fetch" ) );
		render( <SiteKitSetupWidget
			dataProvider={ dataProvider }
			remoteDataProvider={ remoteDataProvider }
			{ ...props }
		/> );
		fireEvent.click( screen.getByRole( "button", { name: /Connect Site Kit by Google/i } ) );

		const grantConsentButton = screen.getByRole( "button", { name: /Grant consent/i } );
		fireEvent.click( grantConsentButton );
		await waitFor( () => {
			expect( grantConsentButton ).toBeInTheDocument();
		} );
		expect( screen.queryByRole( "button", { name: /Dismiss/i } ) ).not.toBeInTheDocument();

		expect( remoteDataProvider.fetchJson ).toHaveBeenCalledWith(
			"https://example.com/site-kit-consent-management",
			{ consent: "true" },
			expect.objectContaining( { method: "POST" } )
		);
	} );

	it( "renders the widget with dismiss button when connected", () => {
		remoteDataProvider.fetchJson.mockResolvedValueOnce( { success: true } );
		dataProvider = new MockDataProvider( {
			siteKitConfiguration: {
				isInstalled: true,
				isActive: true,
				isSetupCompleted: true,
				isConnected: true,
			},
		} );
		render( <SiteKitSetupWidget
			dataProvider={ dataProvider }
			remoteDataProvider={ remoteDataProvider }
			{ ...props }
		/> );
		const dismissButton = screen.getByRole( "button", { name: /Got it/i } );
		expect( dismissButton ).toBeInTheDocument();
		fireEvent.click( dismissButton );
		expect( removeWidget ).toHaveBeenCalledWith( "siteKitSetup" );
	} );

	it( "opens the menu and calls dismissPermanently and removeWidget when 'Remove permanently' is clicked", async() => {
		dataProvider = new MockDataProvider( {
			siteKitConfiguration: {
				isInstalled: true,
				isActive: true,
				isSetupCompleted: true,
			},
		} );
		render( <SiteKitSetupWidget
			dataProvider={ dataProvider }
			remoteDataProvider={ remoteDataProvider }
			{ ...props }
		/> );
		fireEvent.click( screen.getByRole( "button", { name: /Open Site Kit widget dropdown menu/i } ) );
		const removeButton = screen.getByRole( "menuitem", { name: /Remove permanently/i, type: "button" } );
		fireEvent.click( removeButton );
		expect( removeWidget ).toHaveBeenCalled();
		expect( remoteDataProvider.fetchJson ).toHaveBeenCalledWith(
			"https://example.com/site-kit-configuration-dismissal",
			// eslint-disable-next-line camelcase
			{ is_dismissed: "true" },
			expect.objectContaining( { method: "POST" } )
		);
		expect( dataProvider.setSiteKitConfigurationDismissed ).toHaveBeenCalledWith( true );
	} );
} );
