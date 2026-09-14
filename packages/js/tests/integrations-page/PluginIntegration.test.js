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
const { PluginIntegration } = require( "../../src/integrations-page/plugin-integration" );

/**
 * Stands in for the SVG logo, which is mocked away by the Jest svg transform.
 * @returns {JSX.Element} An empty logo.
 */
const LogoStub = () => <span />;

const integration = {
	name: "The Events Calendar",
	claim: <span>Get rich results for your events in Google search</span>,
	learnMoreLink: "https://yoa.st/integrations-about-tec",
	logoLink: "https://yoa.st/integrations-logo-tec",
	slug: "tec",
	description: "The Events Calendar integrates with Yoast SEO's Schema API to get rich snippets for your events!",
	isPremium: false,
	isNew: false,
	isMultisiteAvailable: true,
	logo: LogoStub,
};

describe( "PluginIntegration with the Schema Framework disabled", () => {
	it( "links a Schema API partner's 'Schema Framework disabled' notice to the Schema Framework settings", () => {
		render( <PluginIntegration integration={ integration } isActive={ false } isSchemaAPIIntegration={ true } /> );

		const link = screen.getByRole( "link", { name: /^Schema Framework disabled/ } );
		expect( link ).toHaveAttribute( "href", "admin.php?page=wpseo_page_settings#/schema-framework" );
		expect( link ).toHaveAttribute( "id", "tec-schema-framework-link" );
		expect( screen.queryByText( "Plugin not detected" ) ).not.toBeInTheDocument();
	} );

	it( "tells screen reader users where the notice leads", () => {
		render( <PluginIntegration integration={ integration } isActive={ false } isSchemaAPIIntegration={ true } /> );

		const link = screen.getByRole( "link", { name: /^Schema Framework disabled/ } );
		expect( link ).toHaveAccessibleName( /Go to the Schema Framework settings/ );
		expect( within( link ).getByText( "(Go to the Schema Framework settings)" ) ).toHaveClass( "yst-sr-only" );
	} );

	it( "leaves a card that isn't a Schema API partner alone", () => {
		render( <PluginIntegration integration={ integration } isActive={ false } isSchemaAPIIntegration={ false } /> );

		expect( screen.queryByRole( "link", { name: /Schema Framework disabled/ } ) ).not.toBeInTheDocument();
		expect( screen.getByText( "Plugin not detected" ) ).toBeInTheDocument();
	} );
} );
