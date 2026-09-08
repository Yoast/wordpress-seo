import { describe, expect, it } from "@jest/globals";
import { NlwebIntegration } from "../../src/integrations-page/nlweb-integration";
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
	name: "NLWeb",
	claim: <span>Make your site conversational with <strong>NLWeb</strong></span>,
	learnMoreLink: "https://yoast.com/integrations/nlweb/",
	logoLink: "https://yoast.com/integrations/nlweb/",
	slug: "nlweb",
	description: "NLWeb, Microsoft's open protocol, lets AI agents and assistants query your site in natural language.",
	isPremium: false,
	isNew: true,
	isMultisiteAvailable: true,
	logo: LogoStub,
};

describe( "NlwebIntegration", () => {
	it( "renders the integration component", () => {
		render( <NlwebIntegration integration={ integration } isActive={ false } /> );

		expect( screen.getByRole( "heading", { name: "Make your site conversational with NLWeb" } ) ).toBeInTheDocument();
		expect( screen.getByText( /Microsoft's open protocol/ ) ).toBeInTheDocument();
	} );

	it( "shows the New badge", () => {
		render( <NlwebIntegration integration={ integration } isActive={ false } /> );

		expect( screen.getByText( "New" ) ).toBeInTheDocument();
	} );

	it( "shows 'Integration active' when the Schema aggregation endpoint is enabled", () => {
		render( <NlwebIntegration integration={ integration } isActive={ true } /> );

		expect( screen.getByText( "Integration active" ) ).toBeInTheDocument();
		expect( screen.queryByRole( "link", { name: "Enable in Site features" } ) ).not.toBeInTheDocument();
	} );

	it( "shows the 'Enable in Site features' button when the Schema aggregation endpoint is disabled", () => {
		render( <NlwebIntegration integration={ integration } isActive={ false } /> );

		expect( screen.getByRole( "link", { name: "Enable in Site features" } ) ).toBeInTheDocument();
		expect( screen.queryByText( "Integration active" ) ).not.toBeInTheDocument();
	} );

	it( "points the button at the Schema aggregation endpoint setting", () => {
		render( <NlwebIntegration integration={ integration } isActive={ false } /> );

		expect( screen.getByRole( "link", { name: "Enable in Site features" } ) ).toHaveAttribute(
			"href",
			expect.stringContaining( "page=wpseo_page_settings#/site-features#card-wpseo-enable_schema_aggregation_endpoint" )
		);
	} );

	it( "does not offer a toggle, since the Site features setting owns the option", () => {
		render( <NlwebIntegration integration={ integration } isActive={ false } /> );

		expect( screen.queryByRole( "checkbox" ) ).not.toBeInTheDocument();
		expect( screen.queryByRole( "switch" ) ).not.toBeInTheDocument();
	} );
} );
