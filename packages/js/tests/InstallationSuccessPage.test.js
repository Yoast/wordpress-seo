import { InstallationSuccessPage } from "../src/installation-success";
import { render } from "./test-utils";

describe( "InstallationSuccessPage", () => {
	it( "should render the text 'Your site is now easier for search engines to find.'", () => {
		global.window.wpseoInstallationSuccess = {
			pluginUrl: "http://wordpress.test/wp-content/plugins/wordpress-seo",
			firstTimeConfigurationUrl: "http://wordpress.test/wp-admin/admin.php?page=wpseo_dashboard#/first-time-configuration",
			dashboardUrl: "http://wordpress.test/wp-admin/admin.php?page=wpseo_dashboard",
		};

		const { queryByText } = render( <InstallationSuccessPage /> );
		expect( queryByText( "Your site is now easier for search engines to find." ) ).toBeInTheDocument();
	} );
	it( "should match the snapshot", () => {
		const { container } = render( <InstallationSuccessPage /> );
		expect( container ).toMatchSnapshot();
	} );
} );
