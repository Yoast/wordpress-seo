import { beforeEach, describe, expect, it } from "@jest/globals";
import { SiteKitSetupWidget } from "../../../src/dashboard/widgets/site-kit-setup-widget";
import { fireEvent, render, screen, waitFor } from "../../test-utils";
import { MockDataProvider } from "../__mocks__/data-provider";
import { MockRemoteDataProvider } from "../__mocks__/remote-data-provider";

describe( "SiteKitSetupWidget", () => {
	let dataProvider;
	const remoteDataProvider = new MockRemoteDataProvider( {} );

	beforeEach( () => {
		dataProvider = new MockDataProvider();
		remoteDataProvider.fetchJson.mockClear();
	} );

	it( "renders the widget with install button", () => {
		render( <SiteKitSetupWidget
			dataProvider={ dataProvider }
			remoteDataProvider={ remoteDataProvider }
		/> );
		const installLink = screen.getByRole( "link", { name: /Install Site Kit by Google/i } );
		expect( installLink ).toBeInTheDocument();
		expect( installLink ).toHaveAttribute( "href", "https://example.com/install" );
	} );

	it( "renders the widget with learn more link", () => {
		render( <SiteKitSetupWidget
			dataProvider={ dataProvider }
			remoteDataProvider={ remoteDataProvider }
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
			dataProvider={ dataProvider }
			remoteDataProvider={ remoteDataProvider }
		/> );
		fireEvent.click( screen.getByRole( "button", { name: /Connect Site Kit by Google/i } ) );

		fireEvent.click( screen.getByRole( "button", { name: /Grant consent/i } ) );

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
		/> );
		fireEvent.click( screen.getByRole( "button", { name: /Connect Site Kit by Google/i } ) );

		const grantConsentButton = screen.getByRole( "button", { name: /Grant consent/i } );
		fireEvent.click( grantConsentButton );
		await waitFor( () => {
			expect( grantConsentButton ).toBeInTheDocument();
		} );
		expect( screen.queryByRole( "button", { name: /Got it!/i } ) ).not.toBeInTheDocument();

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
				isConsentGranted: true,
			},
		} );
		render( <SiteKitSetupWidget
			dataProvider={ dataProvider }
			remoteDataProvider={ remoteDataProvider }
		/> );
		const dismissButton = screen.getByRole( "button", { name: /Got it/i } );
		expect( dismissButton ).toBeInTheDocument();
		fireEvent.click( dismissButton );
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
		/> );
		fireEvent.click( screen.getByRole( "button", { name: /Open Site Kit widget dropdown menu/i } ) );
		const removeButton = screen.getByRole( "menuitem", { name: /Remove permanently/i, type: "button" } );
		fireEvent.click( removeButton );
		expect( remoteDataProvider.fetchJson ).toHaveBeenCalledWith(
			"https://example.com/site-kit-configuration-dismissal",
			// eslint-disable-next-line camelcase
			{ is_dismissed: "true" },
			expect.objectContaining( { method: "POST" } )
		);
		expect( dataProvider.setSiteKitConfigurationDismissed ).toHaveBeenCalledWith( true );
	} );

	describe( "should show warning and disable button when user doesn't have the capability to install plugins", () => {
		it.each( [
			[ "plugin not installed", { isInstalled: false, isActive: false, isSetupCompleted: false, label: "Install Site Kit by Google"  } ],
			[ "plugin not active", { isInstalled: true, isActive: false, isSetupCompleted: false, label: "Activate Site Kit by Google" } ],
			[ "setup not completed", { isInstalled: true, isActive: true, isSetupCompleted: false, label: "Set up Site Kit by Google" } ],
		] )( "when %s", ( _, { isInstalled, isActive, isSetupCompleted, label } ) => {
			dataProvider = new MockDataProvider( {
				siteKitConfiguration: {
					isInstalled,
					isActive,
					isSetupCompleted,
					capabilities: {
						installPlugins: false,
						viewSearchConsoleData: false,
					},
				},
			} );
			const { getByText } = render( <SiteKitSetupWidget
				dataProvider={ dataProvider }
				remoteDataProvider={ remoteDataProvider }
			/> );
			const link = screen.getByText( label );
			expect( link ).not.toHaveAttribute( "href" );
			expect( getByText( "Please contact your WordPress admin to install, activate, and set up the Site Kit by Google plugin." ) ).toBeInTheDocument();
		} );
	} );

	it( "should show warning and disable button before connecting if user doesn't have the capability to view site kit data", () => {
		dataProvider = new MockDataProvider( {
			siteKitConfiguration: {
				isInstalled: true,
				isActive: true,
				isSetupCompleted: true,
				capabilities: {
					installPlugins: true,
					viewSearchConsoleData: false,
				},
			},
		} );
		const { getByRole, getByText } = render( <SiteKitSetupWidget
			dataProvider={ dataProvider }
			remoteDataProvider={ remoteDataProvider }
		/> );
		const button = getByRole( "button", { name: /Connect Site Kit by Google/i } );
		expect( button ).toBeInTheDocument();
		expect( button ).toBeDisabled();
		expect( getByText( "You don’t have view access to Site Kit by Google. Please contact the admin who set it up." ) ).toBeInTheDocument();
	} );
} );
