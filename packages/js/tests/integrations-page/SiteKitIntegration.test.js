import { render, screen, act } from "../test-utils";
import { SiteKitIntegration } from "../../src/integrations-page/site-kit-integration";

jest.mock( "@wordpress/data", () => ( {
	useSelect: jest.fn( () =>  [] ),
} ) );


describe( "SiteKitIntegration", () => {
	const urlsProps = {
		installUrl: "/wp-admin/update.php?action=install-plugin&plugin=google-site-kit&_wpnonce=8b2868f15d",
		activateUrl: "/wp-admin/plugins.php?action=activate&plugin=google-site-kit%2Fgoogle-site-kit.php&_wpnonce=0a752c1514",
		setupUrl: "/wp-admin/admin.php?page=googlesitekit-splash",
	};
	it( "renders the integration component", () => {
		render( <SiteKitIntegration
			isActive={ false }
			isSetupCompleted={ false }
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
	] )( "shows 'Install Site Kit by Google' link when not installed when %s", ( _title, isInstalled, isActive, isSetupCompleted, isConnected ) => {
		render( <SiteKitIntegration
			isActive={ isActive }
			isSetupCompleted={ isSetupCompleted }
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
	] )( "shows 'Activate Site Kit by Google' button when installed but not active when %s", ( _title, isInstalled, isActive, isSetupCompleted, isConnected ) => {
		render( <SiteKitIntegration
			isActive={ isActive }
			isSetupCompleted={ isSetupCompleted }
			isInstalled={ isInstalled }
			isConnected={ isConnected }
			{ ...urlsProps }
		/> );
		const link = screen.getByRole( "link", { name: "Activate Site Kit by Google" } );
		expect( link ).toBeInTheDocument();
		expect( link ).toHaveAttribute( "href", "/wp-admin/plugins.php?action=activate&plugin=google-site-kit%2Fgoogle-site-kit.php&_wpnonce=0a752c1514" );
	} );

	it( "shows 'Set up Site Kit by Google' button when active but not set up", () => {
		render( <SiteKitIntegration
			isActive={ true } isSetupCompleted={ false } isInstalled={ true } isConnected={ false } { ...urlsProps }
		/> );
		const link = screen.getByRole( "link", { name: "Set up Site Kit by Google" } );
		expect( link ).toBeInTheDocument();
		expect( link ).toHaveAttribute( "href", "/wp-admin/admin.php?page=googlesitekit-splash" );
	} );

	it( "shows 'Connect Site Kit by Google' button when set up but not connected", () => {
		render( <SiteKitIntegration
			isActive={ true } isSetupCompleted={ true } isInstalled={ true } isConnected={ false } { ...urlsProps }
		/> );
		expect( screen.getByRole( "button", { name: "Connect Site Kit by Google" } ) ).toBeInTheDocument();
	} );

	it( "shows 'Disconnect' button when connected", () => {
		render( <SiteKitIntegration isActive={ true } isSetupCompleted={ true } isInstalled={ true } isConnected={ true } { ...urlsProps } /> );
		expect( screen.getByRole( "button", { name: "Disconnect" } ) ).toBeInTheDocument();
		expect( screen.getByText( "Successfully connected" ) ).toBeInTheDocument();
	} );

	it( "opens a modal to disconnect when clicking on 'Disconnect' button when connected and dismissing the modal", () => {
		render( <SiteKitIntegration
			isActive={ true }
			isSetupCompleted={ true }
			isInstalled={ true }
			isConnected={ true } { ...urlsProps }
		/> );
		const disconnectButton = screen.getByRole( "button", { name: "Disconnect" } );

		act( () => {
			disconnectButton.click();
		} );

		const disconnectDialog = screen.getByRole( "dialog" );
		expect( disconnectDialog ).toBeInTheDocument();

		const dismissDisconnectButton = screen.getByRole( "button", { name: "Yes, disconnect" } );
		expect( dismissDisconnectButton ).toBeInTheDocument();

		expect( screen.getByRole( "button", { name: "No, stay connected" } ) ).toBeInTheDocument();

		act( () => {
			dismissDisconnectButton.click();
		} );

		expect( disconnectDialog ).not.toBeInTheDocument();
	} );
} );
