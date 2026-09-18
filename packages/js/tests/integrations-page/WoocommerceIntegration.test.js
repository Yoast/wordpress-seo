/* eslint-disable camelcase -- `schema_framework_enabled` is a script-data key emitted by Integrations_Page. */
import { beforeEach, describe, expect, it } from "@jest/globals";
import { WoocommerceIntegration } from "../../src/integrations-page/woocommerce-integration";
import { render, screen } from "../test-utils";

jest.mock( "@wordpress/data", () => ( {
	useSelect: jest.fn( select => select( () => ( {
		selectLink: jest.fn( link => link ),
	} ) ) ),
	registerStore: jest.fn(),
} ) );

/**
 * Stands in for the SVG logo, which is mocked away by the Jest svg transform.
 *
 * @param {Object} props The props, forwarded so tests can inspect the greyscale class.
 *
 * @returns {JSX.Element} An empty logo.
 */
const LogoStub = ( props ) => <span data-testid="logo" { ...props } />;

const integration = {
	name: "WooCommerce",
	claim: <span>Get rich results for your products in Google search</span>,
	learnMoreLink: "https://yoa.st/integrations-about-woocommerce",
	logoLink: "https://yoa.st/integrations-logo-woocommerce",
	slug: "woocommerce",
	description: "WooCommerce integrates with Yoast SEO's Schema API.",
	isPremium: false,
	isNew: false,
	isMultisiteAvailable: true,
	logo: LogoStub,
	upsellLink: "https://yoa.st/integrations-get-woocommerce",
};

/**
 * Renders the WooCommerce card with WooCommerce itself not detected.
 *
 * @param {boolean} isSchemaAPIIntegration Whether the card is a Schema API partner.
 *
 * @returns {Object} The render result.
 */
const renderCard = ( isSchemaAPIIntegration ) => render(
	<WoocommerceIntegration
		integration={ integration }
		isActive={ false }
		isPrerequisiteActive={ false }
		activationLink="plugins.php"
		isSchemaAPIIntegration={ isSchemaAPIIntegration }
	/>
);

describe( "WoocommerceIntegration with the Schema Framework disabled", () => {
	beforeEach( () => {
		window.wpseoIntegrationsData = { schema_framework_enabled: false };
	} );

	it( "shows a Schema API partner the Schema Framework link alongside its plugin status", () => {
		renderCard( true );

		expect( screen.getByRole( "link", { name: /^Schema framework not active/ } ) ).toBeInTheDocument();
		expect( screen.getByText( "Plugin not detected" ) ).toBeInTheDocument();
	} );

	it( "leaves a card that isn't a Schema API partner alone", () => {
		renderCard( false );

		expect( screen.queryByRole( "link", { name: /Schema framework not active/ } ) ).not.toBeInTheDocument();
		expect( screen.getByText( "Plugin not detected" ) ).toBeInTheDocument();
	} );
} );

describe( "WoocommerceIntegration's plugin status", () => {
	beforeEach( () => {
		window.wpseoIntegrationsData = { schema_framework_enabled: true };
	} );

	it( "shows 'Integration active' only when Yoast WooCommerce SEO is installed and active", () => {
		render(
			<WoocommerceIntegration
				integration={ integration }
				isActive={ true }
				isInstalled={ true }
				isPrerequisiteActive={ true }
				activationLink="plugins.php"
			/>
		);

		expect( screen.getByText( "Integration active" ) ).toBeInTheDocument();
		expect( screen.queryByRole( "link", { name: /Buy Yoast WooCommerce SEO/ } ) ).not.toBeInTheDocument();
		expect( screen.queryByRole( "link", { name: /Activate Yoast WooCommerce SEO/ } ) ).not.toBeInTheDocument();
	} );

	it( "shows the upsell button when only WooCommerce is installed, not Yoast WooCommerce SEO", () => {
		render(
			<WoocommerceIntegration
				integration={ integration }
				isActive={ false }
				isInstalled={ false }
				isPrerequisiteActive={ true }
				activationLink="plugins.php"
			/>
		);

		expect( screen.getByRole( "link", { name: /Buy Yoast WooCommerce SEO/ } ) ).toBeInTheDocument();
		expect( screen.queryByText( "Integration active" ) ).not.toBeInTheDocument();
	} );

	it( "shows the activate button when Yoast WooCommerce SEO is installed but not active", () => {
		render(
			<WoocommerceIntegration
				integration={ integration }
				isActive={ false }
				isInstalled={ true }
				isPrerequisiteActive={ true }
				activationLink="plugins.php"
			/>
		);

		expect( screen.getByRole( "link", { name: /Activate Yoast WooCommerce SEO/ } ) ).toBeInTheDocument();
		expect( screen.queryByText( "Integration active" ) ).not.toBeInTheDocument();
	} );
} );

describe( "WoocommerceIntegration's logo", () => {
	beforeEach( () => {
		window.wpseoIntegrationsData = { schema_framework_enabled: true };
	} );

	it( "greys out the logo when WooCommerce itself isn't active, even though the Yoast WooCommerce SEO plugin file is flagged active", () => {
		render(
			<WoocommerceIntegration
				integration={ integration }
				isActive={ true }
				isInstalled={ true }
				isPrerequisiteActive={ false }
				activationLink="plugins.php"
			/>
		);

		expect( screen.getByTestId( "logo" ) ).toHaveClass( "yst-opacity-50", "yst-filter", "yst-grayscale" );
	} );

	it( "shows the logo in full color when both WooCommerce and Yoast WooCommerce SEO are active", () => {
		render(
			<WoocommerceIntegration
				integration={ integration }
				isActive={ true }
				isInstalled={ true }
				isPrerequisiteActive={ true }
				activationLink="plugins.php"
			/>
		);

		expect( screen.getByTestId( "logo" ) ).not.toHaveClass( "yst-opacity-50", "yst-filter", "yst-grayscale" );
	} );
} );
