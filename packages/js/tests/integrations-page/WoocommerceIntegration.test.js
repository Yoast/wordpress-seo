/* eslint-disable camelcase -- `schema_framework_enabled` is a script-data key emitted by Integrations_Page. */
import { describe, expect, it } from "@jest/globals";
import { render, screen, within } from "../test-utils";

jest.mock( "@wordpress/data", () => ( {
	useSelect: jest.fn( select => select( () => ( {
		selectLink: jest.fn( link => link ),
	} ) ) ),
	registerStore: jest.fn(),
} ) );

// The card reads the Schema Framework flag when its module loads, so the flag is set before the module is required.
window.wpseoIntegrationsData = { schema_framework_enabled: false };
const { WoocommerceIntegration } = require( "../../src/integrations-page/woocommerce-integration" );

/**
 * Stands in for the SVG logo, which is mocked away by the Jest svg transform.
 * @returns {JSX.Element} An empty logo.
 */
const LogoStub = () => <span />;

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
	it( "links a Schema API partner's 'Schema Framework disabled' notice to the Schema Framework settings", () => {
		renderCard( true );

		const link = screen.getByRole( "link", { name: /^Schema Framework disabled/ } );
		expect( link ).toHaveAttribute( "href", "admin.php?page=wpseo_page_settings#/schema-framework" );
		expect( link ).toHaveAttribute( "id", "woocommerce-schema-framework-link" );
		expect( screen.queryByText( "Plugin not detected" ) ).not.toBeInTheDocument();
	} );

	it( "tells screen reader users where the notice leads", () => {
		renderCard( true );

		const link = screen.getByRole( "link", { name: /^Schema Framework disabled/ } );
		expect( link ).toHaveAccessibleName( /Go to the Schema Framework settings/ );
		expect( within( link ).getByText( "(Go to the Schema Framework settings)" ) ).toHaveClass( "yst-sr-only" );
	} );

	it( "leaves a card that isn't a Schema API partner alone", () => {
		renderCard( false );

		expect( screen.queryByRole( "link", { name: /Schema Framework disabled/ } ) ).not.toBeInTheDocument();
		expect( screen.getByText( "Plugin not detected" ) ).toBeInTheDocument();
	} );
} );
