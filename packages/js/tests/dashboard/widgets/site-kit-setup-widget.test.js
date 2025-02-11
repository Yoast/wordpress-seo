import { beforeEach, describe, expect, it, jest } from "@jest/globals";
import { SiteKitSetupWidget } from "../../../src/dashboard/widgets/site-kit-setup-widget";
import { act, fireEvent, render, screen } from "../../test-utils";
import { MockDataProvider } from "../__mocks__/data-provider";
import { MockRemoteDataProvider } from "../__mocks__/remote-data-provider";

describe( "SiteKitSetupWidget", () => {
	let dataProvider;
	const remoteDataProvider = new MockRemoteDataProvider( {} );
	const onRemove = jest.fn();

	beforeEach( () => {
		dataProvider = new MockDataProvider();
		remoteDataProvider.fetchJson.mockClear();
		onRemove.mockClear();
	} );

	it( "renders the widget with install button", () => {
		render( <SiteKitSetupWidget dataProvider={ dataProvider } remoteDataProvider={ remoteDataProvider } onRemove={ onRemove } /> );
		const installLink = screen.getByRole( "link", { name: /Install Site Kit by Google/i } );
		expect( installLink ).toBeInTheDocument();
		expect( installLink ).toHaveAttribute( "href", "https://example.com/install" );
	} );

	it( "renders the widget with learn more link", () => {
		render( <SiteKitSetupWidget dataProvider={ dataProvider } remoteDataProvider={ remoteDataProvider } onRemove={ onRemove } /> );
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
		render( <SiteKitSetupWidget dataProvider={ dataProvider } remoteDataProvider={ remoteDataProvider } onRemove={ onRemove } /> );
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
		render( <SiteKitSetupWidget dataProvider={ dataProvider } remoteDataProvider={ remoteDataProvider } onRemove={ onRemove } /> );
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
		render( <SiteKitSetupWidget dataProvider={ dataProvider } remoteDataProvider={ remoteDataProvider } onRemove={ onRemove } /> );
		expect( screen.getByRole( "button", { name: /Connect Site Kit by Google/i } ) ).toBeInTheDocument();
	} );

	it( "requests consent when clicking on connect", async() => {
		dataProvider = new MockDataProvider( {
			siteKitConfiguration: {
				isInstalled: true,
				isActive: true,
				isSetupCompleted: true,
			},
		} );
		remoteDataProvider.fetchJson.mockResolvedValue( { success: true } );
		render( <SiteKitSetupWidget dataProvider={ dataProvider } remoteDataProvider={ remoteDataProvider } onRemove={ onRemove } /> );
		const connectButton = screen.getByRole( "button", { name: /Connect Site Kit by Google/i } );

		// Await useEffect from the request.
		await act( () => {
			fireEvent.click( connectButton );
		} );
		expect( screen.getByRole( "button", { name: /Dismiss/i } ) ).toBeInTheDocument();

		expect( remoteDataProvider.fetchJson ).toHaveBeenCalledWith(
			"https://example.com/site-kit-consent-management",
			{ consent: "true" },
			expect.objectContaining( { method: "POST" } )
		);
	} );

	it( "stays on the connect when the consent request returns false", async() => {
		dataProvider = new MockDataProvider( {
			siteKitConfiguration: {
				isInstalled: true,
				isActive: true,
				isSetupCompleted: true,
			},
		} );
		remoteDataProvider.fetchJson.mockResolvedValue( { success: false } );
		render( <SiteKitSetupWidget dataProvider={ dataProvider } remoteDataProvider={ remoteDataProvider } onRemove={ onRemove } /> );
		const connectButton = screen.getByRole( "button", { name: /Connect Site Kit by Google/i } );

		// Await useEffect from the request.
		await act( () => {
			fireEvent.click( connectButton );
		} );
		expect( connectButton ).toBeInTheDocument();
		expect( screen.queryByRole( "button", { name: /Dismiss/i } ) ).not.toBeInTheDocument();

		expect( remoteDataProvider.fetchJson ).toHaveBeenCalledWith(
			"https://example.com/site-kit-consent-management",
			{ consent: "true" },
			expect.objectContaining( { method: "POST" } )
		);
	} );

	it( "stays on the connect when the consent request errors", async() => {
		dataProvider = new MockDataProvider( {
			siteKitConfiguration: {
				isInstalled: true,
				isActive: true,
				isSetupCompleted: true,
			},
		} );
		remoteDataProvider.fetchJson.mockRejectedValue( new Error( "Failed to fetch" ) );
		render( <SiteKitSetupWidget dataProvider={ dataProvider } remoteDataProvider={ remoteDataProvider } onRemove={ onRemove } /> );
		const connectButton = screen.getByRole( "button", { name: /Connect Site Kit by Google/i } );

		// Await useEffect from the request.
		await act( () => {
			fireEvent.click( connectButton );
		} );
		expect( connectButton ).toBeInTheDocument();
		expect( screen.queryByRole( "button", { name: /Dismiss/i } ) ).not.toBeInTheDocument();

		expect( remoteDataProvider.fetchJson ).toHaveBeenCalledWith(
			"https://example.com/site-kit-consent-management",
			{ consent: "true" },
			expect.objectContaining( { method: "POST" } )
		);
	} );

	it( "renders the widget with dismiss button when connected", () => {
		dataProvider = new MockDataProvider( {
			siteKitConfiguration: {
				isInstalled: true,
				isActive: true,
				isSetupCompleted: true,
				isConnected: true,
			},
		} );
		render( <SiteKitSetupWidget dataProvider={ dataProvider } remoteDataProvider={ remoteDataProvider } onRemove={ onRemove } /> );
		const dismissButton = screen.getByRole( "button", { name: /Dismiss/i } );
		expect( dismissButton ).toBeInTheDocument();
		fireEvent.click( dismissButton );
		expect( onRemove ).toHaveBeenCalled();
	} );

	it( "opens the menu and calls onRemove when 'Remove until next visit' is clicked", () => {
		render( <SiteKitSetupWidget dataProvider={ dataProvider } remoteDataProvider={ remoteDataProvider } onRemove={ onRemove } /> );
		fireEvent.click( screen.getByRole( "button", { name: /Open Site Kit widget dropdown menu/i } ) );
		const removeButton = screen.getByRole( "menuitem", { name: /Remove until next visit/i, type: "button" } );
		fireEvent.click( removeButton );
		expect( onRemove ).toHaveBeenCalled();
	} );

	it( "opens the menu and calls onRemovePermanently when 'Remove permanently' is clicked", () => {
		render( <SiteKitSetupWidget dataProvider={ dataProvider } remoteDataProvider={ remoteDataProvider } onRemove={ onRemove } /> );
		fireEvent.click( screen.getByRole( "button", { name: /Open Site Kit widget dropdown menu/i } ) );
		const removeButton = screen.getByRole( "menuitem", { name: /Remove permanently/i, type: "button" } );
		fireEvent.click( removeButton );
		expect( onRemove ).toHaveBeenCalled();
	} );
} );
