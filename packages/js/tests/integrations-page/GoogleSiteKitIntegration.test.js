import React from "react";
import { render, screen } from "../test-utils";
import { GoogleSiteKitIntegration } from "../../src/integrations-page/google-site-kit-integration";
import { expect } from "@jest/globals";

describe( "GoogleSiteKitIntegration", () => {
	it( "renders the integration component", () => {
		render( <GoogleSiteKitIntegration /> );
		expect( screen.getByText( "Site Kit by Google" ) ).toBeInTheDocument();
	} );

	it( "shows 'Install Site Kit by Google' link when not installed", () => {
		window.wpseoIntegrationsData = {
			googleSiteKit: {
				isActive: false,
				afterSetup: false,
				isInstalled: false,
				isConnected: false,
			},
		};
		render( <GoogleSiteKitIntegration /> );
		const link = screen.getByRole( "link", { name: "Install Site Kit by Google" } );
		expect( link ).toBeInTheDocument();
		expect( link ).toHaveAttribute( "href", "/wp-admin/plugin-install.php?s=google%2520site%2520kit&tab=search&type=term" );
		expect( screen.getByText( "Plugin not detected" ) ).toBeInTheDocument();
	} );

	it( "shows 'Activate Site Kit by Google' button when installed but not active", () => {
		window.wpseoIntegrationsData = {
			googleSiteKit: {
				isActive: false,
				afterSetup: false,
				isInstalled: true,
				isConnected: false,
			},
		};
		render( <GoogleSiteKitIntegration /> );
		const link = screen.getByRole( "link", { name: "Activate Site Kit by Google" } );
		expect( link ).toBeInTheDocument();
		expect( link ).toHaveAttribute( "href", "/wp-admin/plugins.php" );
		expect( screen.getByText( "Plugin not detected" ) ).toBeInTheDocument();
	} );

	it( "shows 'Set up Site Kit by Google' button when active but not set up", () => {
		window.wpseoIntegrationsData = {
			googleSiteKit: {
				isActive: true,
				afterSetup: false,
				isInstalled: true,
				isConnected: false,
			},
		};
		render( <GoogleSiteKitIntegration /> );
		const link = screen.getByRole( "link", { name: "Set up Site Kit by Google" } );
		expect( link ).toBeInTheDocument();
		expect( link ).toHaveAttribute( "href", "/wp-admin/admin.php?page=googlesitekit-splash" );
		expect( screen.getByText( "Not connected" ) ).toBeInTheDocument();
	} );

	it( "shows 'Connect Site Kit by Google' button when set up but not connected", () => {
		window.wpseoIntegrationsData = {
			googleSiteKit: {
				isActive: true,
				afterSetup: true,
				isInstalled: true,
				isConnected: false,
			},
		};
		render( <GoogleSiteKitIntegration /> );
		expect( screen.getByRole( "button", { name: "Connect Site Kit by Google" } ) ).toBeInTheDocument();
		expect( screen.getByText( "Not connected" ) ).toBeInTheDocument();
	} );

	it( "shows 'Disconnect' button when connected", () => {
		window.wpseoIntegrationsData = {
			googleSiteKit: {
				isActive: true,
				afterSetup: true,
				isInstalled: true,
				isConnected: true,
			},
		};
		render( <GoogleSiteKitIntegration /> );
		expect( screen.getByRole( "button", { name: "Disconnect" } ) ).toBeInTheDocument();
		expect( screen.getByText( "Successfully connected" ) ).toBeInTheDocument();
	} );
} );
