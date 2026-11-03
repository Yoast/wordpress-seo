/* eslint-disable camelcase -- `schema_framework_enabled` is a script-data key emitted by Integrations_Page. */
import { beforeEach, describe, expect, it } from "@jest/globals";
import { SimpleIntegration } from "../../src/integrations-page/simple-integration";
import { render, screen, within } from "../test-utils";

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
			window.wpseoIntegrationsData = { schema_framework_enabled: false };
			render( <SimpleIntegration integration={ integration } isSchemaPartner={ true } /> );

			expect( screen.getByText( "Schema partner" ) ).toBeInTheDocument();
		} );
	} );

	it( "still renders the claim and description alongside the chip", () => {
		render( <SimpleIntegration integration={ integration } isSchemaPartner={ true } /> );

		expect( screen.getByRole( "heading", { name: "Get rich results for your events in Google search" } ) ).toBeInTheDocument();
		expect( screen.getByText( /integrates with Yoast SEO's Schema API/ ) ).toBeInTheDocument();
	} );

	describe( "with the Schema Framework disabled", () => {
		beforeEach( () => {
			window.wpseoIntegrationsData = { schema_framework_enabled: false };
		} );

		it( "links a Schema API partner to the Schema Framework settings instead of rendering its children", () => {
			render( <SimpleIntegration integration={ integration } isSchemaPartner={ true }><span>Plugin not detected</span></SimpleIntegration> );

			const link = screen.getByRole( "link", { name: /^Schema Framework disabled/ } );
			expect( link ).toHaveAttribute( "href", "admin.php?page=wpseo_page_settings#/schema-framework" );
			expect( link ).toHaveAttribute( "id", "tec-schema-framework-link" );
			expect( screen.queryByText( "Plugin not detected" ) ).not.toBeInTheDocument();
		} );

		it( "tells screen reader users where the link leads", () => {
			render( <SimpleIntegration integration={ integration } isSchemaPartner={ true } /> );

			const link = screen.getByRole( "link", { name: /^Schema Framework disabled/ } );
			expect( link ).toHaveAccessibleName( /Go to the Schema Framework settings/ );
			expect( within( link ).getByText( "(Go to the Schema Framework settings)" ) ).toHaveClass( "yst-sr-only" );
		} );

		it( "renders the children of a card that isn't a Schema API partner", () => {
			render( <SimpleIntegration integration={ integration }><span>Plugin not detected</span></SimpleIntegration> );

			expect( screen.queryByRole( "link", { name: /Schema Framework disabled/ } ) ).not.toBeInTheDocument();
			expect( screen.getByText( "Plugin not detected" ) ).toBeInTheDocument();
		} );

		it( "shows the alert in the body instead, alongside its children, when opted in", () => {
			render(
				<SimpleIntegration integration={ integration } isSchemaPartner={ true } showSchemaFrameworkAlertInBody={ true }>
					<span>Plugin not detected</span>
				</SimpleIntegration>
			);

			const link = screen.getByRole( "link", { name: /^Schema Framework disabled/ } );
			expect( link ).toHaveAttribute( "href", "admin.php?page=wpseo_page_settings#/schema-framework" );
			expect( link ).toHaveAttribute( "id", "tec-schema-framework-link" );
			expect( screen.getByText( "Plugin not detected" ) ).toBeInTheDocument();
		} );
	} );

	describe( "with the Schema Framework enabled", () => {
		beforeEach( () => {
			window.wpseoIntegrationsData = { schema_framework_enabled: true };
		} );

		it( "renders a Schema API partner's children", () => {
			render( <SimpleIntegration integration={ integration } isSchemaPartner={ true }><span>Integration active</span></SimpleIntegration> );

			expect( screen.queryByRole( "link", { name: /Schema Framework disabled/ } ) ).not.toBeInTheDocument();
			expect( screen.getByText( "Integration active" ) ).toBeInTheDocument();
		} );
	} );
} );
