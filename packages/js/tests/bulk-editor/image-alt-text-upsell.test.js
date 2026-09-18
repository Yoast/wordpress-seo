import { useSelect } from "@wordpress/data";
import { render, screen } from "../test-utils";
import { ImageAltTextUpsell } from "../../src/bulk-editor/components/image-alt-text-upsell";
import { IMAGE_ALT_TEXT_UPSELL_LINK } from "../../src/bulk-editor/constants";

const mockUseAiUpsell = jest.fn();
jest.mock( "../../src/bulk-editor/hooks/use-ai-upsell", () => ( {
	useAiUpsell: ( ...args ) => mockUseAiUpsell( ...args ),
} ) );

// The card resolves its own shortlink through the store; useSelect is fully mocked so the store never needs registering.
jest.mock( "@wordpress/data", () => ( {
	useSelect: jest.fn(),
} ) );

const wooUpsell = {
	upsellLabel: "Unlock with Yoast WooCommerce SEO",
	upsellLink: "https://yoa.st/bulk-editor-ai-upsell-woo?platform=wordpress",
	ctbId: "5b32250e-e6f0-44ae-ad74-3cefc8e427f9",
	learnMoreLink: "https://yoa.st/bulk-editor-learn-more?platform=wordpress",
};

const LINK_PARAMS = "?platform=wordpress&screen=wpseo_page_bulk_edit";

describe( "ImageAltTextUpsell", () => {
	beforeEach( () => {
		mockUseAiUpsell.mockReturnValue( wooUpsell );
		useSelect.mockImplementation( ( selector ) => selector( () => ( {
			selectLink: ( link ) => link + LINK_PARAMS,
		} ) ) );
	} );

	it( "renders the upsell copy for Yoast WooCommerce SEO", () => {
		render( <ImageAltTextUpsell /> );

		expect( mockUseAiUpsell ).toHaveBeenCalledWith( "product" );
		expect( screen.getByRole( "heading", { level: 3, name: "From flagged to fixed: image alt text across your whole catalog" } ) ).toBeInTheDocument();
		expect( screen.getByText( /Generate accurate alt text for every product image in your catalog/ ) ).toBeInTheDocument();
		expect( screen.getByText( "Yoast WooCommerce SEO" ) ).toBeInTheDocument();
		expect( screen.getByRole( "region", { name: "From flagged to fixed: image alt text across your whole catalog" } ) ).toBeInTheDocument();
	} );

	it( "links the call to action to the image alt text upsell shortlink with the click-to-buy attributes", () => {
		render( <ImageAltTextUpsell /> );

		const cta = screen.getByRole( "link", { name: /Unlock with Yoast WooCommerce SEO/ } );
		expect( cta ).toHaveAttribute( "href", IMAGE_ALT_TEXT_UPSELL_LINK + LINK_PARAMS );
		expect( cta ).toHaveAttribute( "target", "_blank" );
		expect( cta ).toHaveAttribute( "rel", "noopener noreferrer" );
		expect( cta ).toHaveAttribute( "data-action", "load-nfd-ctb" );
		expect( cta ).toHaveAttribute( "data-ctb-id", wooUpsell.ctbId );
	} );

	it( "omits the click-to-buy attributes without a ctbId", () => {
		mockUseAiUpsell.mockReturnValue( { ...wooUpsell, ctbId: undefined } );

		render( <ImageAltTextUpsell /> );

		const cta = screen.getByRole( "link", { name: /Unlock with Yoast WooCommerce SEO/ } );
		expect( cta ).not.toHaveAttribute( "data-action" );
		expect( cta ).not.toHaveAttribute( "data-ctb-id" );
	} );

	it( "renders no image while the visual is pending", () => {
		render( <ImageAltTextUpsell /> );

		expect( screen.getByRole( "region" ).querySelector( "img" ) ).toBeNull();
	} );

	it( "is not a dialog and cannot be dismissed", () => {
		render( <ImageAltTextUpsell /> );

		expect( screen.queryByRole( "dialog" ) ).not.toBeInTheDocument();
		expect( screen.queryByRole( "button" ) ).not.toBeInTheDocument();
		expect( screen.getAllByRole( "link" ) ).toHaveLength( 1 );
	} );

	it( "hides the dummy table from assistive technology and keeps it free of focusable elements", () => {
		const { container } = render( <ImageAltTextUpsell /> );

		const dummy = container.querySelector( "[aria-hidden='true']" );
		expect( dummy ).not.toBeNull();
		expect( dummy ).toHaveTextContent( "Classic Athletic Sneaker" );
		expect( dummy ).toHaveTextContent( "sneakers-featured-main.jpg" );
		expect( dummy.className ).toContain( "yst-pointer-events-none" );

		// The shapes are drawn with the ui-library's classes rather than its components, so there is nothing
		// focusable in here at all, which is what keeps the aria-hidden wrapper valid.
		expect( dummy.querySelectorAll( "a, button, input, select, textarea, [tabindex]" ) ).toHaveLength( 0 );
	} );

	it( "shows each dummy product's image count, with the missing alt count only when there is one", () => {
		const { container } = render( <ImageAltTextUpsell /> );

		// Title, image count and the red missing alt count (null when the product has none).
		const rows = Array.from( container.querySelectorAll( ".yst-content-tabs__tab" ) ).map( ( row ) => [
			row.querySelector( ".yst-truncate" ).textContent,
			row.querySelector( ".yst-text-slate-500" ).textContent,
			row.querySelector( ".yst-text-red-600" )?.textContent ?? null,
		] );
		expect( rows ).toEqual( [
			[ "Classic Athletic Sneaker", "4 images", "2 missing alt" ],
			[ "Retro Basketball Shoe", "5 images", "4 missing alt" ],
			[ "Lightweight Running Shoe", "3 images", "1 missing alt" ],
			[ "Casual Slip-On Sneaker", "2 images", "1 missing alt" ],
			[ "Trail Running Shoe", "5 images", null ],
			[ "Fashionable High-Top Sneaker", "7 images", "3 missing alt" ],
		] );
	} );
} );
