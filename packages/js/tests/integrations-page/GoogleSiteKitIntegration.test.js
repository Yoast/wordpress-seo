import { render, screen } from "../test-utils";
import { GoogleSiteKitIntegration } from "../../src/integrations-page/google-site-kit-integration";

jest.mock( "@wordpress/data", () => ( {
	useSelect: jest.fn( () =>  [] ),
} ) );


describe( "GoogleSiteKitIntegration", () => {
	const urlsProps = {
		installUrl: "/wp-admin/update.php?action=install-plugin&plugin=google-site-kit&_wpnonce=8b2868f15d",
		activateUrl: "/wp-admin/plugins.php?action=activate&plugin=google-site-kit%2Fgoogle-site-kit.php&_wpnonce=0a752c1514",
		setupUrl: "/wp-admin/admin.php?page=googlesitekit-splash",
	};
	it( "renders the integration component", () => {
		render( <GoogleSiteKitIntegration
			isActive={ false }
			afterSetup={ false }
			isInstalled={ false }
			isConnected={ false }
			{ ...urlsProps }
		/> );
		expect( screen.getByText( "Site Kit by Google" ) ).toBeInTheDocument();
	} );

	it.each( [
		[ "not installed, not active, not after setup, and not connected", false, false, false, false ],
		[ "not installed, not active, after setup, and not connected", false, false, true, false ],
		[ "not installed, not active, after setup, and connected", false, false, true, true ],
	] )( "shows 'Install Site Kit by Google' link when not installed when %s", ( _title, isInstalled, isActive, afterSetup, isConnected ) => {
		render( <GoogleSiteKitIntegration
			isActive={ isActive }
			afterSetup={ afterSetup }
			isInstalled={ isInstalled }
			isConnected={ isConnected }
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
	] )( "shows 'Activate Site Kit by Google' button when installed but not active when %s", ( _title, isInstalled, isActive, afterSetup, isConnected ) => {
		render( <GoogleSiteKitIntegration
			isActive={ isActive }
			afterSetup={ afterSetup }
			isInstalled={ isInstalled }
			isConnected={ isConnected }
			{ ...urlsProps }
		/> );
		const link = screen.getByRole( "link", { name: "Activate Site Kit by Google" } );
		expect( link ).toBeInTheDocument();
		expect( link ).toHaveAttribute( "href", "/wp-admin/plugins.php?action=activate&plugin=google-site-kit%2Fgoogle-site-kit.php&_wpnonce=0a752c1514" );
	} );

	it( "shows 'Set up Site Kit by Google' button when active but not set up", () => {
		render( <GoogleSiteKitIntegration isActive={ true } afterSetup={ false } isInstalled={ true } isConnected={ false } { ...urlsProps } /> );
		const link = screen.getByRole( "link", { name: "Set up Site Kit by Google" } );
		expect( link ).toBeInTheDocument();
		expect( link ).toHaveAttribute( "href", "/wp-admin/admin.php?page=googlesitekit-splash" );
	} );

	it( "shows 'Connect Site Kit by Google' button when set up but not connected", () => {
		render( <GoogleSiteKitIntegration isActive={ true } afterSetup={ true } isInstalled={ true } isConnected={ false } { ...urlsProps } /> );
		expect( screen.getByRole( "button", { name: "Connect Site Kit by Google" } ) ).toBeInTheDocument();
	} );

	it( "shows 'Disconnect' button when connected", () => {
		render( <GoogleSiteKitIntegration isActive={ true } afterSetup={ true } isInstalled={ true } isConnected={ true } { ...urlsProps } /> );
		expect( screen.getByRole( "button", { name: "Disconnect" } ) ).toBeInTheDocument();
		expect( screen.getByText( "Successfully connected" ) ).toBeInTheDocument();
	} );
} );
