import { beforeEach, describe, expect, it } from "@jest/globals";
import { SiteKitSetupWidget } from "../../../src/dashboard/widgets/site-kit-setup-widget";
import { fireEvent, render, screen, waitFor } from "../../test-utils";
import { MockDataProvider } from "../__mocks__/data-provider";
import { MockRemoteDataProvider } from "../__mocks__/remote-data-provider";
import { MockDataTracker } from "../__mocks__/data-tracker";

describe( "SiteKitSetupWidget", () => {
	let dataProvider;
	let dataTracker;

	const remoteDataProvider = new MockRemoteDataProvider( {} );
	const steps = [
		"INSTALL",
		"ACTIVATE",
		"SET UP",
		"CONNECT",
	];

	beforeEach( () => {
		dataProvider = new MockDataProvider();
		dataTracker = new MockDataTracker();
		remoteDataProvider.fetchJson.mockClear();
	} );

	it( "renders the widget with install button", () => {
		render( <SiteKitSetupWidget
			dataProvider={ dataProvider }
			dataTracker={ dataTracker }
			remoteDataProvider={ remoteDataProvider }
		/> );
		const installLink = screen.getByRole( "link", { name: /Install Site Kit by Google/i } );
		expect( installLink ).toBeInTheDocument();
		expect( installLink ).toHaveAttribute( "href", "https://example.com/install" );
	} );

	it( "renders the widget with learn more link", () => {
		render( <SiteKitSetupWidget
			dataProvider={ dataProvider }
			dataTracker={ dataTracker }
			remoteDataProvider={ remoteDataProvider }
		/> );
		const learnMoreLink = screen.getByRole( "link", { name: /Learn more/i } );
		expect( learnMoreLink ).toBeInTheDocument();
		expect( learnMoreLink ).toHaveAttribute( "href", "https://example.com/google-site-kit-learn-more" );
	} );

	it( "renders the widget with activate button", () => {
		dataProvider = new MockDataProvider( {
			siteKitConfiguration: {
				connectionStepsStatuses: {
					isInstalled: true,
				},
			},
		} );
		render( <SiteKitSetupWidget
			dataProvider={ dataProvider }
			dataTracker={ dataTracker }
			remoteDataProvider={ remoteDataProvider }
		/> );
		const activateLink = screen.getByRole( "link", { name: /Activate Site Kit by Google/i } );
		expect( activateLink ).toBeInTheDocument();
		expect( activateLink ).toHaveAttribute( "href", "https://example.com/activate" );
	} );

	it( "renders the widget with setup button", () => {
		dataProvider = new MockDataProvider( {
			siteKitConfiguration: {
				connectionStepsStatuses: {
					isInstalled: true,
					isActive: true,
				},
			},
		} );
		render( <SiteKitSetupWidget
			dataProvider={ dataProvider }
			dataTracker={ dataTracker }
			remoteDataProvider={ remoteDataProvider }
		/> );
		const setupLink = screen.getByRole( "link", { name: /Set up Site Kit by Google/i } );
		expect( setupLink ).toBeInTheDocument();
		expect( setupLink ).toHaveAttribute( "href", "https://example.com/isSetup" );
	} );

	it( "renders the widget with connect button", () => {
		dataProvider = new MockDataProvider( {
			siteKitConfiguration: {
				connectionStepsStatuses: {
					isInstalled: true,
					isActive: true,
					isSetupCompleted: true,
				},
			},
		} );
		render( <SiteKitSetupWidget
			dataProvider={ dataProvider }
			dataTracker={ dataTracker }
			remoteDataProvider={ remoteDataProvider }
		/> );
		expect( screen.getByRole( "button", { name: /Connect Site Kit by Google/i } ) ).toBeInTheDocument();
	} );

	it( "opens the grant consent modal when clicking on connect", () => {
		dataProvider = new MockDataProvider( {
			siteKitConfiguration: {
				connectionStepsStatuses: {
					isInstalled: true,
					isActive: true,
					isSetupCompleted: true,
				},
			},
		} );
		render( <SiteKitSetupWidget
			dataProvider={ dataProvider }
			dataTracker={ dataTracker }
			remoteDataProvider={ remoteDataProvider }
		/> );
		const connectButton = screen.getByRole( "button", { name: /Connect Site Kit by Google/i } );
		fireEvent.click( connectButton );
		expect( screen.getByRole( "button", { name: /Grant consent/i } ) ).toBeInTheDocument();
	} );

	it( "requests consent when clicking on grant consent", async() => {
		dataProvider = new MockDataProvider( {
			siteKitConfiguration: {
				connectionStepsStatuses: {
					isInstalled: true,
					isActive: true,
					isSetupCompleted: true,
				},
			},
		} );
		remoteDataProvider.fetchJson.mockResolvedValueOnce( { success: true } );
		render( <SiteKitSetupWidget
			dataProvider={ dataProvider }
			dataTracker={ dataTracker }
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
				connectionStepsStatuses: {
					isInstalled: true,
					isActive: true,
					isSetupCompleted: true,
				},
			},
		} );
		remoteDataProvider.fetchJson.mockResolvedValueOnce( { success: false } );
		render( <SiteKitSetupWidget
			dataProvider={ dataProvider }
			dataTracker={ dataTracker }
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
				connectionStepsStatuses: {
					isInstalled: true,
					isActive: true,
					isSetupCompleted: true,
				},
			},
		} );
		remoteDataProvider.fetchJson.mockRejectedValueOnce( new Error( "Failed to fetch" ) );
		render( <SiteKitSetupWidget
			dataProvider={ dataProvider }
			dataTracker={ dataTracker }
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

	it( "should render the widget with dismiss button when connected and dismiss the widget when 'Got it' button is clicked", () => {
		remoteDataProvider.fetchJson.mockResolvedValueOnce( { success: true } );
		dataProvider = new MockDataProvider( {
			siteKitConfiguration: {
				connectionStepsStatuses: {
					isInstalled: true,
					isActive: true,
					isSetupCompleted: true,
					isConsentGranted: true,
				},
			},
		} );
		render( <SiteKitSetupWidget
			dataProvider={ dataProvider }
			dataTracker={ dataTracker }
			remoteDataProvider={ remoteDataProvider }
		/> );
		const dismissButton = screen.getByRole( "button", { name: /Got it/i } );
		expect( dismissButton ).toBeInTheDocument();
		fireEvent.click( dismissButton );

		expect( dataTracker.track ).not.toHaveBeenCalledWith( { setupWidgetTemporarilyDismissed: "yes" } );
		expect( dataProvider.setSiteKitConfigurationDismissed ).toHaveBeenCalledWith( true );
	} );

	it( "should permanently dismiss the widget and track the it when 'Remove permanently' is clicked", async() => {
		dataProvider = new MockDataProvider( {
			siteKitConfiguration: {
				connectionStepsStatuses: {
					isInstalled: false,
				},
			},
		} );
		render( <SiteKitSetupWidget
			dataProvider={ dataProvider }
			dataTracker={ dataTracker }
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
		// Check the tracker is called with the correct parameters.
		expect( dataTracker.track ).toHaveBeenCalledWith( { setupWidgetPermanentlyDismissed: "yes" } );

		expect( dataProvider.setSiteKitConfigurationDismissed ).toHaveBeenCalledWith( true );
	} );

	it( "should dismiss the widget until next visit and track it when 'Remove until next visit' is clicked", async() => {
		dataProvider = new MockDataProvider( {
			siteKitConfiguration: {
				connectionStepsStatuses: {
					isInstalled: false,
				},
			},
		} );
		render( <SiteKitSetupWidget
			dataProvider={ dataProvider }
			dataTracker={ dataTracker }
			remoteDataProvider={ remoteDataProvider }
		/> );
		fireEvent.click( screen.getByRole( "button", { name: /Open Site Kit widget dropdown menu/i } ) );
		const removeButton = screen.getByRole( "menuitem", { name: /Remove until next visit/i, type: "button" } );
		fireEvent.click( removeButton );
		// Check the tracker is called with the correct parameters.
		expect( dataTracker.track ).toHaveBeenCalledWith( { setupWidgetTemporarilyDismissed: "yes" } );

		expect( dataProvider.setSiteKitConfigurationDismissed ).toHaveBeenCalledWith( true );
	} );

	describe( "should show the warning and disable the button when a user doesn't have the capability to install plugins", () => {
		it.each( [
			[ "plugin not installed", { isInstalled: false, isActive: false, isSetupCompleted: false, label: "Install Site Kit by Google"  } ],
			[ "plugin not active", { isInstalled: true, isActive: false, isSetupCompleted: false, label: "Activate Site Kit by Google" } ],
			[ "setup not completed", { isInstalled: true, isActive: true, isSetupCompleted: false, label: "Set up Site Kit by Google" } ],
		] )( "when %s", ( _, { isInstalled, isActive, isSetupCompleted, label } ) => {
			dataProvider = new MockDataProvider( {
				siteKitConfiguration: {
					connectionStepsStatuses: {
						isInstalled,
						isActive,
						isSetupCompleted,
					},
					capabilities: {
						installPlugins: false,
						viewSearchConsoleData: false,
					},
				},
			} );
			const { getByText } = render( <SiteKitSetupWidget
				dataProvider={ dataProvider }
				dataTracker={ dataTracker }
				remoteDataProvider={ remoteDataProvider }
			/> );
			const link = screen.getByText( label );
			expect( link ).not.toHaveAttribute( "href" );
			expect( link ).toHaveAttribute( "aria-disabled", "true" );
			expect( getByText( "Please contact your WordPress admin to install, activate, and set up the Site Kit by Google plugin." ) ).toBeInTheDocument();
		} );
	} );

	it( "should show the warning and disable the button before connecting if a user doesn't have the permission to view site kit data", () => {
		dataProvider = new MockDataProvider( {
			siteKitConfiguration: {
				connectionStepsStatuses: {
					isInstalled: true,
					isActive: true,
					isSetupCompleted: true,
				},
				capabilities: {
					installPlugins: true,
					viewSearchConsoleData: false,
				},
			},
		} );
		const { getByRole, getByText } = render( <SiteKitSetupWidget
			dataProvider={ dataProvider }
			dataTracker={ dataTracker }
			remoteDataProvider={ remoteDataProvider }
		/> );
		const button = getByRole( "button", { name: /Connect Site Kit by Google/i } );
		expect( button ).toBeInTheDocument();
		expect( button ).toBeDisabled();
		expect( getByText( "You don’t have view access to Site Kit by Google. Please contact the admin who set it up." ) ).toBeInTheDocument();
	} );

	it.each(
		[
			[ "not granted and not activated", {
				isInstalled: true,
				isActive: false,
				isSetupCompleted: false,
				isConsentGranted: false,
				alertMessage: "You are using an outdated version of the Site Kit by Google plugin. Please update to the latest version to connect Yoast SEO with Site Kit by Google.",
			} ],
			[ "not granted and setup was not completed", {
				isInstalled: true,
				isActive: true,
				isSetupCompleted: false,
				isConsentGranted: false,
				alertMessage: "You are using an outdated version of the Site Kit by Google plugin. Please update to the latest version to connect Yoast SEO with Site Kit by Google.",
			} ],
			[ "not granted", {
				isInstalled: true,
				isActive: true,
				isSetupCompleted: true,
				isConsentGranted: false,
				alertMessage: "You are using an outdated version of the Site Kit by Google plugin. Please update to the latest version to connect Yoast SEO with Site Kit by Google.",
			} ],
			[ "granted", {
				isInstalled: true,
				isActive: true,
				isSetupCompleted: true,
				isConsentGranted: true,
				alertMessage: "Your current version of the Site Kit by Google plugin is no longer compatible with Yoast SEO. Please update to the latest version to restore the connection.",
			} ],
		]
	)( "should show alert and update button when version is not supported and consent was %s", ( _, { isConsentGranted, alertMessage } ) => {
		dataProvider = new MockDataProvider( {
			siteKitConfiguration: {
				isVersionSupported: false,
				connectionStepsStatuses: {
					isInstalled: true,
					isActive: true,
					isSetupCompleted: true,
					isConsentGranted,
				},
			},
		} );
		const { getByRole, getByText, queryByText } = render( <SiteKitSetupWidget
			dataProvider={ dataProvider }
			dataTracker={ dataTracker }
			remoteDataProvider={ remoteDataProvider }
		/> );

		// Check that the widget copy is always for the unconnected state.
		const unconnectedText = getByText( "Here's what you'll unlock:" );
		expect( unconnectedText ).toBeInTheDocument();
		const title = getByText( "Expand your dashboard with insights from Google!" );
		expect( title ).toBeInTheDocument();
		const description = getByText( "Bring together powerful tools like Google Analytics and Search Console for a complete overview of your website's performance, all in one seamless dashboard." );
		expect( description ).toBeInTheDocument();

		// Check stepper is not rendered.
		steps.forEach( ( step ) => {
			expect( queryByText( step ) ).not.toBeInTheDocument();
		} );

		const link = getByRole( "link", { name: /Update Site Kit by Google/i } );
		expect( link ).toBeInTheDocument();
		expect( link ).toHaveAttribute( "href", "https://example.com/update" );
		expect( getByText( alertMessage ) ).toBeInTheDocument();
	} );

	it.each(
		[
			[ "site kit plugin is not yet activated", {
				isInstalled: true,
				isActive: false,
			} ],
			[ "site kit plugin is not installed", {
				isInstalled: false,
				isActive: false,
			} ],
		]
	)( "should not show alert and update button when version is not supported and %s", ( _, { isInstalled, isActive } ) => {
		dataProvider = new MockDataProvider( {
			siteKitConfiguration: {
				isVersionSupported: false,
				connectionStepsStatuses: {
					isInstalled,
					isActive,
					isSetupCompleted: false,
					isConsentGranted: false,
				},
			},
		} );
		const { queryByRole, queryByText, getByText } = render( <SiteKitSetupWidget
			dataProvider={ dataProvider }
			dataTracker={ dataTracker }
			remoteDataProvider={ remoteDataProvider }
		/> );

		// Check stepper is rendered.
		steps.forEach( ( step ) => {
			expect( getByText( step ) ).toBeInTheDocument();
		} );
		expect( queryByRole( "link", { name: /Update Site Kit by Google/i } ) ).not.toBeInTheDocument();
		expect( queryByText( "You are using an outdated version of the Site Kit by Google plugin. Please update to the latest version to connect Yoast SEO with Site Kit by Google." ) ).not.toBeInTheDocument();
	} );

	describe( "should track the current step on widget load when setup was already loaded", () => {
		it.each( [
			[ "plugin not installed", { isInstalled: false, isActive: false, isSetupCompleted: false, stepName: "install" } ],
			[ "plugin not active", { isInstalled: true, isActive: false, isSetupCompleted: false, stepName: "activate" } ],
			[ "setup not completed", { isInstalled: true, isActive: true, isSetupCompleted: false, stepName: "setup" } ],
			[ "consent not granted", { isInstalled: true, isActive: true, isSetupCompleted: true, stepName: "grantConsent" } ],
		] )( "should track configuration step on load when %s", ( _, { isInstalled, isActive, isSetupCompleted, stepName } ) => {
			dataProvider = new MockDataProvider( {
				siteKitConfiguration: {
					connectionStepsStatuses: {
						isInstalled,
						isActive,
						isSetupCompleted,
						isConsentGranted: false,
					},
				},
			} );
			render( <SiteKitSetupWidget
				dataProvider={ dataProvider }
				dataTracker={ dataTracker }
				remoteDataProvider={ remoteDataProvider }
			/> );

			expect( dataTracker.track ).toHaveBeenCalledWith( { lastInteractionStage: stepName } );
		} );

		describe( "should track the current step on widget load when setup was not loaded before", () => {
			it.each( [
				[ "plugin not installed", { isInstalled: false, isActive: false, isSetupCompleted: false, stepName: "install" } ],
				[ "plugin not active", { isInstalled: true, isActive: false, isSetupCompleted: false, stepName: "activate" } ],
				[ "setup not completed", { isInstalled: true, isActive: true, isSetupCompleted: false, stepName: "setup" } ],
				[ "consent not granted", { isInstalled: true, isActive: true, isSetupCompleted: true, stepName: "grantConsent" } ],
			] )( "should track configuration step on load when %s", ( _, { isInstalled, isActive, isSetupCompleted, stepName } ) => {
				dataProvider = new MockDataProvider( {
					siteKitConfiguration: {
						connectionStepsStatuses: {
							isInstalled,
							isActive,
							isSetupCompleted,
							isConsentGranted: false,
						},
					},
				} );
				dataTracker = new MockDataTracker(
					{
						data: {
							setupWidgetTemporarilyDismissed: "yes",
							setupWidgetPermanentlyDismissed: "no",
							setupWidgetLoaded: "no",
							firstInteractionStage: "install",
							lastInteractionStage: "install",
						},
						endpoint: dataProvider.getEndpoint( "setupStepsTracking" ),
					},
					remoteDataProvider
				);
				render( <SiteKitSetupWidget
					dataProvider={ dataProvider }
					dataTracker={ dataTracker }
					remoteDataProvider={ remoteDataProvider }
				/> );

				expect( dataTracker.track ).toHaveBeenCalledWith(  {
					setupWidgetLoaded: "yes",
					firstInteractionStage: stepName,
					lastInteractionStage: stepName,
				} );
			} );
		} );
	} );
} );
