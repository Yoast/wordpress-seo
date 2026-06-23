import { render, screen } from "../test-utils";
import { UpsellModal } from "../../src/bulk-editor/components/upsell-modal";

const baseProps = {
	isOpen: true,
	onClose: () => {},
	upsellLabel: "Unlock with Yoast SEO Premium",
	upsellLink: "https://yoa.st/bulk-editor-ai-upsell?platform=wordpress",
	ctbId: "f6a84663-465f-4cb5-8ba5-f7a6d72224b2",
};

describe( "UpsellModal", () => {
	it( "renders the heading, body and the upsell CTA with its link and click-to-buy attributes", () => {
		render( <UpsellModal { ...baseProps } /> );

		expect( screen.getByRole( "heading", { name: "Generate Metadata in Bulk" } ) ).toBeInTheDocument();
		expect( screen.getByText( /Instantly create SEO titles/ ) ).toBeInTheDocument();

		const cta = screen.getByRole( "link", { name: /Unlock with Yoast SEO Premium/ } );
		expect( cta ).toHaveAttribute( "href", baseProps.upsellLink );
		expect( cta ).toHaveAttribute( "target", "_blank" );
		expect( cta ).toHaveAttribute( "data-action", "load-nfd-ctb" );
		expect( cta ).toHaveAttribute( "data-ctb-id", baseProps.ctbId );
	} );

	it( "uses the provided label (the WooCommerce SEO variant)", () => {
		render( <UpsellModal { ...baseProps } upsellLabel="Unlock with Yoast WooCommerce SEO" /> );

		expect( screen.getByRole( "link", { name: /Unlock with Yoast WooCommerce SEO/ } ) ).toBeInTheDocument();
	} );

	it( "omits the click-to-buy attributes when no ctbId is given", () => {
		render( <UpsellModal { ...baseProps } ctbId={ undefined } /> );

		const cta = screen.getByRole( "link", { name: /Unlock with Yoast SEO Premium/ } );
		expect( cta ).not.toHaveAttribute( "data-action" );
		expect( cta ).not.toHaveAttribute( "data-ctb-id" );
	} );

	it( "renders nothing when closed", () => {
		render( <UpsellModal { ...baseProps } isOpen={ false } /> );

		expect( screen.queryByRole( "heading", { name: "Generate Metadata in Bulk" } ) ).not.toBeInTheDocument();
	} );
} );
