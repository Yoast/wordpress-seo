import { describe, expect, it } from "@jest/globals";
import apiFetch from "@wordpress/api-fetch";
import { SiteKitIntegration } from "../../src/integrations-page/site-kit-integration";
import { act, render, screen } from "../test-utils";

jest.mock( "@wordpress/data", () => ( {
	useSelect: jest.fn( select => select( () => ( {
		selectLink: jest.fn( link => `https://yoa.st/${ link }` ),
	} ) ) ),
} ) );

jest.mock( "@wordpress/api-fetch", () => ( {
	__esModule: true,
	"default": jest.fn(),
} ) );

/**
 * Mock response for the fetch call.
 * @param {*} body Whatever the parsed JSON should be.
 * @param {number} [status=200] The status code.
 * @returns {{json: (function(): *), status: number, ok: boolean}} What our fetch handler expects.
 */
const mockResponse = ( body, status = 200 ) => ( { json: () => body, status, ok: status >= 200 && status < 400 } );

describe( "SiteKitIntegration", () => {
	const urlsProps = {
		installUrl: "/wp-admin/update.php?action=install-plugin&plugin=google-site-kit&_wpnonce=8b2868f15d",
		activateUrl: "/wp-admin/plugins.php?action=activate&plugin=google-site-kit%2Fgoogle-site-kit.php&_wpnonce=0a752c1514",
		setupUrl: "/wp-admin/admin.php?page=googlesitekit-splash",
		consentManagementUrl: "/wp-json/yoast/v1/site_kit_manage_consent",
		capabilities: { installPlugins: true, viewDashboard: true },
	};
	it( "renders the integration component", () => {
		render( <SiteKitIntegration
			isActive={ false }
			isSetupCompleted={ false }
			isInstalled={ false }
			initialIsConsentGranted={ false }
			{ ...urlsProps }
		/> );
		expect( screen.getByText( "Site Kit by Google" ) ).toBeInTheDocument();
	} );

	it.each( [
		[ "not installed, not active, not after setup, and not connected", false, false, false, false ],
		[ "not installed, not active, after setup, and not connected", false, false, true, false ],
		[ "not installed, not active, after setup, and connected", false, false, true, true ],
	] )( "shows 'Install Site Kit by Google' link when not installed when %s", ( _title, isInstalled, isActive, isSetupCompleted, initialIsConsentGranted = {} ) => {
		render( <SiteKitIntegration
			isActive={ isActive }
			isSetupCompleted={ isSetupCompleted }
			isInstalled={ isInstalled }
			initialIsConsentGranted={ initialIsConsentGranted }
			{ ...urlsProps }
		/> );
		const link = screen.getByRole( "link", { name: "Install Site Kit by Google" } );
		expect( link ).toBeInTheDocument();
		expect( link ).toHaveAttribute( "href", "/wp-admin/update.php?action=install-plugin&plugin=google-site-kit&_wpnonce=8b2868f15d" );
	} );

	it.each( [
		[ "installed, not active, not after setup, and not connected", true, false, false, false ],
		[ "installed, not active, after setup, and not connected", true, false, true, false ],
		[ "installed, not active, after setup, and connected", true, false, true, true ],
	] )( "shows 'Activate Site Kit by Google' button when installed but not active when %s", ( _title, isInstalled, isActive, isSetupCompleted, initialIsConsentGranted = {} ) => {
		render( <SiteKitIntegration
			isActive={ isActive }
			isSetupCompleted={ isSetupCompleted }
			isInstalled={ isInstalled }
			initialIsConsentGranted={ initialIsConsentGranted }
			{ ...urlsProps }
		/> );
		const link = screen.getByRole( "link", { name: "Activate Site Kit by Google" } );
		expect( link ).toBeInTheDocument();
		expect( link )
			.toHaveAttribute( "href", "/wp-admin/plugins.php?action=activate&plugin=google-site-kit%2Fgoogle-site-kit.php&_wpnonce=0a752c1514" );
	} );

	it( "shows 'Set up Site Kit by Google' button when active but not set up", () => {
		render( <SiteKitIntegration
			isActive={ true } isSetupCompleted={ false } isInstalled={ true } initialIsConsentGranted={ false } { ...urlsProps }
		/> );
		const link = screen.getByRole( "link", { name: "Set up Site Kit by Google" } );
		expect( link ).toBeInTheDocument();
		expect( link ).toHaveAttribute( "href", "/wp-admin/admin.php?page=googlesitekit-splash" );
	} );

	it( "shows 'Connect Site Kit by Google' button when set up but not connected", () => {
		render( <SiteKitIntegration
			isActive={ true } isSetupCompleted={ true } isInstalled={ true } initialIsConsentGranted={ false } { ...urlsProps }
		/> );
		expect( screen.getByRole( "button", { name: "Connect Site Kit by Google" } ) ).toBeInTheDocument();
	} );

	it( "shows 'Disconnect' button when connected", () => {
		render( <SiteKitIntegration
			isActive={ true } isSetupCompleted={ true } isInstalled={ true }
			initialIsConsentGranted={ true } { ...urlsProps }
		/> );
		expect( screen.getByRole( "button", { name: "Disconnect" } ) ).toBeInTheDocument();
		expect( screen.getByText( "Successfully connected" ) ).toBeInTheDocument();
	} );

	it( "opens a modal to grant consent when clicking on 'Connect Site Kit by Google' button", async() => {
		apiFetch.mockResolvedValueOnce( mockResponse( { success: true } ) );
		render( <SiteKitIntegration
			isActive={ true }
			isSetupCompleted={ true }
			isInstalled={ true }
			initialIsConsentGranted={ false }
			{ ...urlsProps }
		/> );
		const connectButton = screen.getByRole( "button", { name: "Connect Site Kit by Google" } );

		await act( () => {
			connectButton.click();
		} );

		const consentDialog = screen.getByRole( "dialog" );
		expect( consentDialog ).toBeInTheDocument();

		const grantConsentButton = screen.getByRole( "button", { name: "Grant consent" } );
		expect( grantConsentButton ).toBeInTheDocument();

		expect( screen.getByRole( "button", { name: "Close" } ) ).toBeInTheDocument();

		await act( () => {
			grantConsentButton.click();
		} );

		expect( apiFetch ).toHaveBeenCalledWith( expect.objectContaining( {
			url: urlsProps.consentManagementUrl,
			method: "POST",
			data: { consent: "true" },
		} ) );
		expect( consentDialog ).not.toBeInTheDocument();
		expect( screen.getByRole( "button", { name: "Disconnect" } ) ).toBeInTheDocument();
	} );

	it( "opens a modal to disconnect when clicking on 'Disconnect' button when connected and dismissing the modal", async() => {
		apiFetch.mockResolvedValueOnce( mockResponse( { success: true } ) );
		render( <SiteKitIntegration
			isActive={ true }
			isSetupCompleted={ true }
			isInstalled={ true }
			initialIsConsentGranted={ true }
			{ ...urlsProps }
		/> );
		const disconnectButton = screen.getByRole( "button", { name: "Disconnect" } );

		await act( () => {
			disconnectButton.click();
		} );

		const disconnectDialog = screen.getByRole( "dialog" );
		expect( disconnectDialog ).toBeInTheDocument();

		const dismissDisconnectButton = screen.getByRole( "button", { name: "Yes, disconnect" } );
		expect( dismissDisconnectButton ).toBeInTheDocument();

		expect( screen.getByRole( "button", { name: "No, stay connected" } ) ).toBeInTheDocument();

		await act( () => {
			dismissDisconnectButton.click();
		} );

		expect( apiFetch ).toHaveBeenCalledWith( expect.objectContaining( {
			url: urlsProps.consentManagementUrl,
			method: "POST",
			data: { consent: "false" },
		} ) );
		expect( disconnectDialog ).not.toBeInTheDocument();
		expect( screen.getByRole( "button", { name: "Connect Site Kit by Google" } ) ).toBeInTheDocument();
	} );

	describe( "should show warning when user don't have permission to install plugins and should disable the link", () => {
		it.each( [
			[ "not installed", { isInstalled: false, isActive: false, isSetupCompleted: false, label: "Install Site Kit by Google"  } ],
			[ "not active", { isInstalled: true, isActive: false, isSetupCompleted: false, label: "Activate Site Kit by Google" } ],
		//	[ "setup not completed", { isInstalled: true, isActive: true, isSetupCompleted: false, label: "Set up Site Kit by Google" } ],
		] )( "when site kit plugin %s", ( _, { isInstalled, isActive, isSetupCompleted, label } ) => {
			render( <SiteKitIntegration
				isActive={ isActive }
				isSetupCompleted={ isSetupCompleted }
				isInstalled={ isInstalled }
				initialIsConsentGranted={ false }
				{ ...urlsProps }
				capabilities={ { installPlugins: false, viewDashboard: false } }

			/> );
			const link = screen.getByText( label );
			expect( link ).not.toHaveAttribute( "href" );
			expect( screen.getByText( "Please contact your WordPress admin to install, activate, and set up the Site Kit by Google plugin." ) ).toBeInTheDocument();
		} );
	} );

	describe( "should show warning when user don't have permission to view dashboard and should disable the link", () => {
		it.each( [
			[ "no install plugins and no viewing dashboard", { installPlugins: false, viewDashboard: false } ],
			[ "only no viewing dashboard", { installPlugins: true, viewDashboard: false } ],
		] )( "when the capabilities are: %s", ( _, capabilities ) => {
			render( <SiteKitIntegration
				isInstalled={ true }
				isActive={ true }
				isSetupCompleted={ false }
				initialIsConsentGranted={ false }
				{ ...urlsProps }
				capabilities={ capabilities }

			/> );
			const link = screen.getByText( "Set up Site Kit by Google" );
			expect( link ).not.toHaveAttribute( "href" );
			expect( screen.getByText( "You don’t have view access to Site Kit by Google. Please contact the admin who set it up." ) ).toBeInTheDocument();
		} );
	} );
} );
