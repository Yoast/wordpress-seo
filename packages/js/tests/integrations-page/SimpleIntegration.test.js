import { describe, expect, it } from "@jest/globals";
import { SimpleIntegration } from "../../src/integrations-page/simple-integration";
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
	name: "The Events Calendar",
	claim: <span>Get rich results for your events in Google search</span>,
	learnMoreLink: "https://yoa.st/integrations-about-tec",
	logoLink: "https://yoa.st/integrations-logo-tec",
	slug: "tec",
	description: "The Events Calendar integrates with Yoast SEO's Schema API.",
	isPremium: false,
	isNew: false,
	isMultisiteAvailable: true,
	logo: LogoStub,
};

describe( "SimpleIntegration", () => {
	describe( "the Schema partner chip", () => {
		it( "shows the chip when the integration is a Schema API partner", () => {
			render( <SimpleIntegration integration={ integration } isSchemaPartner={ true } /> );

			expect( screen.getByText( "Schema partner" ) ).toBeInTheDocument();
		} );

		it( "does not show the chip by default", () => {
			render( <SimpleIntegration integration={ integration } /> );

			expect( screen.queryByText( "Schema partner" ) ).not.toBeInTheDocument();
		} );

		it( "does not show the chip when the integration is not a Schema API partner", () => {
			render( <SimpleIntegration integration={ integration } isSchemaPartner={ false } /> );

			expect( screen.queryByText( "Schema partner" ) ).not.toBeInTheDocument();
		} );

		it( "keeps showing the chip when the Schema framework is disabled", () => {
			render( <SimpleIntegration integration={ integration } isSchemaPartner={ true } isSchemaFrameworkDisabled={ true } /> );

			expect( screen.getByText( "Schema partner" ) ).toBeInTheDocument();
		} );
	} );

	it( "still renders the claim and description alongside the chip", () => {
		render( <SimpleIntegration integration={ integration } isSchemaPartner={ true } /> );

		expect( screen.getByRole( "heading", { name: "Get rich results for your events in Google search" } ) ).toBeInTheDocument();
		expect( screen.getByText( /integrates with Yoast SEO's Schema API/ ) ).toBeInTheDocument();
	} );
} );
