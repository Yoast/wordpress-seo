import { render, screen } from "../test-utils";
import { UpsellModal } from "../../src/bulk-editor/components/upsell-modal";

const mockUseAiUpsell = jest.fn();
jest.mock( "../../src/bulk-editor/hooks/use-ai-upsell", () => ( {
	useAiUpsell: ( ...args ) => mockUseAiUpsell( ...args ),
} ) );

const defaultUpsell = {
	upsellLabel: "Unlock with Yoast SEO Premium",
	upsellLink: "https://yoa.st/bulk-editor-ai-upsell?platform=wordpress",
	ctbId: "f6a84663-465f-4cb5-8ba5-f7a6d72224b2",
	learnMoreLink: "https://yoa.st/bulk-editor-learn-more?platform=wordpress",
};

const baseProps = {
	isOpen: true,
	onClose: () => {},
	contentType: "post",
};

describe( "UpsellModal", () => {
	beforeEach( () => {
		mockUseAiUpsell.mockReturnValue( defaultUpsell );
	} );

	it( "renders the heading, body and the upsell CTA with its link and click-to-buy attributes", () => {
		render( <UpsellModal { ...baseProps } /> );

		expect( screen.getByRole( "heading", { name: "Generate Metadata in Bulk" } ) ).toBeInTheDocument();
		expect( screen.getByText( /Instantly create SEO titles/ ) ).toBeInTheDocument();

		const cta = screen.getByRole( "link", { name: /Unlock with Yoast SEO Premium/ } );
		expect( cta ).toHaveAttribute( "href", defaultUpsell.upsellLink );
		expect( cta ).toHaveAttribute( "target", "_blank" );
		expect( cta ).toHaveAttribute( "data-action", "load-nfd-ctb" );
		expect( cta ).toHaveAttribute( "data-ctb-id", defaultUpsell.ctbId );
	} );

	it( "renders the learn more link", () => {
		render( <UpsellModal { ...baseProps } /> );

		const learnMore = screen.getByRole( "link", { name: /Learn more/ } );
		expect( learnMore ).toHaveAttribute( "href", defaultUpsell.learnMoreLink );
		expect( learnMore ).toHaveAttribute( "target", "_blank" );
	} );

	it( "omits the learn more link when useAiUpsell returns no learnMoreLink", () => {
		mockUseAiUpsell.mockReturnValue( { ...defaultUpsell, learnMoreLink: undefined } );

		render( <UpsellModal { ...baseProps } /> );

		expect( screen.queryByRole( "link", { name: /Learn more/ } ) ).not.toBeInTheDocument();
	} );

	it( "uses the WooCommerce SEO label for product content type", () => {
		mockUseAiUpsell.mockReturnValue( { ...defaultUpsell, upsellLabel: "Unlock with Yoast WooCommerce SEO" } );

		render( <UpsellModal { ...baseProps } contentType="product" /> );

		expect( screen.getByRole( "link", { name: /Unlock with Yoast WooCommerce SEO/ } ) ).toBeInTheDocument();
	} );

	it( "omits the click-to-buy attributes when useAiUpsell returns no ctbId", () => {
		mockUseAiUpsell.mockReturnValue( { ...defaultUpsell, ctbId: undefined } );

		render( <UpsellModal { ...baseProps } /> );

		const cta = screen.getByRole( "link", { name: /Unlock with Yoast SEO Premium/ } );
		expect( cta ).not.toHaveAttribute( "data-action" );
		expect( cta ).not.toHaveAttribute( "data-ctb-id" );
	} );

	it( "renders nothing when closed", () => {
		render( <UpsellModal { ...baseProps } isOpen={ false } /> );

		expect( screen.queryByRole( "heading", { name: "Generate Metadata in Bulk" } ) ).not.toBeInTheDocument();
	} );
} );
