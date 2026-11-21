/* eslint-disable camelcase -- `schema_framework_enabled` is a script-data key emitted by Integrations_Page. */
import { beforeEach, describe, expect, it } from "@jest/globals";
import { PluginIntegration } from "../../src/integrations-page/plugin-integration";
import { render, screen } from "../test-utils";

jest.mock( "@wordpress/data", () => ( {
	useSelect: jest.fn( select => select( () => ( {
		selectLink: jest.fn( link => link ),
	} ) ) ),
	registerStore: jest.fn(),
} ) );

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
	beforeEach( () => {
		window.wpseoIntegrationsData = { schema_framework_enabled: false };
	} );

	it( "shows a Schema API partner the Schema Framework link instead of its plugin status", () => {
		render( <PluginIntegration integration={ integration } isActive={ false } isSchemaAPIIntegration={ true } /> );

		expect( screen.getByRole( "link", { name: /^Schema Framework disabled/ } ) ).toBeInTheDocument();
		expect( screen.queryByText( "Plugin not detected" ) ).not.toBeInTheDocument();
	} );

	it( "leaves a card that isn't a Schema API partner alone", () => {
		render( <PluginIntegration integration={ integration } isActive={ false } isSchemaAPIIntegration={ false } /> );

		expect( screen.queryByRole( "link", { name: /Schema Framework disabled/ } ) ).not.toBeInTheDocument();
		expect( screen.getByText( "Plugin not detected" ) ).toBeInTheDocument();
	} );
} );
