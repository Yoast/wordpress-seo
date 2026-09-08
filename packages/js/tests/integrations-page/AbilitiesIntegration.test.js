import { describe, expect, it } from "@jest/globals";
import { AbilitiesIntegration } from "../../src/integrations-page/abilities-integration";
import { render, screen } from "../test-utils";

jest.mock( "@wordpress/data", () => ( {
	useSelect: jest.fn( select => select( () => ( {
		selectLink: jest.fn( link => `https://yoa.st/${ link }` ),
	} ) ) ),
	registerStore: jest.fn(),
} ) );

/**
 * Stands in for the SVG logo, which is mocked away by the Jest svg transform.
 * @returns {JSX.Element} An empty logo.
 */
const LogoStub = () => <span />;

const integration = {
	name: "Abilities API",
	claim: <span>Expose <strong>Yoast SEO</strong> data to AI tools and workflows</span>,
	learnMoreLink: "https://developer.yoast.com/features/yoast-abilities-api/overview/",
	logoLink: "https://developer.yoast.com/features/yoast-abilities-api/overview/",
	slug: "abilities",
	description: "WordPress's Abilities API lets AI assistants and automations discover and read Yoast SEO's content analysis scores directly.",
	isPremium: false,
	isNew: true,
	isMultisiteAvailable: true,
	logo: LogoStub,
};

describe( "AbilitiesIntegration", () => {
	it( "renders the integration component", () => {
		render( <AbilitiesIntegration integration={ integration } isActive={ true } /> );

		expect( screen.getByRole( "heading", { name: "Expose Yoast SEO data to AI tools and workflows" } ) ).toBeInTheDocument();
		expect( screen.getByText( /Abilities API lets AI assistants/ ) ).toBeInTheDocument();
	} );

	it( "shows the New badge", () => {
		render( <AbilitiesIntegration integration={ integration } isActive={ true } /> );

		expect( screen.getByText( "New" ) ).toBeInTheDocument();
	} );

	it( "shows 'Integration active' when the Abilities API is available", () => {
		render( <AbilitiesIntegration integration={ integration } isActive={ true } /> );

		expect( screen.getByText( "Integration active" ) ).toBeInTheDocument();
		expect( screen.queryByText( "Requires WordPress 6.9 or newer" ) ).not.toBeInTheDocument();
	} );

	it( "names the WordPress version requirement when the Abilities API is unavailable", () => {
		render( <AbilitiesIntegration integration={ integration } isActive={ false } /> );

		expect( screen.getByText( "Requires WordPress 6.9 or newer" ) ).toBeInTheDocument();
		expect( screen.queryByText( "Integration active" ) ).not.toBeInTheDocument();
	} );

	it( "does not fall back to the generic 'Plugin not detected' wording", () => {
		render( <AbilitiesIntegration integration={ integration } isActive={ false } /> );

		expect( screen.queryByText( "Plugin not detected" ) ).not.toBeInTheDocument();
	} );

	it( "does not offer a toggle, since the abilities register themselves", () => {
		render( <AbilitiesIntegration integration={ integration } isActive={ true } /> );

		expect( screen.queryByRole( "checkbox" ) ).not.toBeInTheDocument();
		expect( screen.queryByRole( "switch" ) ).not.toBeInTheDocument();
	} );
} );
