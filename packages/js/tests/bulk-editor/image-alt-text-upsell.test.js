import { useSelect } from "@wordpress/data";
import { render, screen } from "../test-utils";
import { ImageAltTextUpsell } from "../../src/bulk-editor/components/image-alt-text-upsell";
import { FIELD_SET_IMAGE_ALT_TEXT, FIELD_SET_SEARCH, IMAGE_ALT_TEXT_UPSELL_LINK } from "../../src/bulk-editor/constants";

const mockUseAiUpsell = jest.fn();
jest.mock( "../../src/bulk-editor/hooks/use-ai-upsell", () => ( {
	useAiUpsell: ( ...args ) => mockUseAiUpsell( ...args ),
} ) );

// The block reads its preferences and the card its shortlink from the store; useSelect is fully mocked so the
// store never needs registering.
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

/**
 * Points the store mock at the given preferences.
 *
 * @param {Object} preferences Partial preference overrides; unset keys fall back to the caller's default.
 *
 * @returns {void}
 */
const mockStore = ( preferences = {}, activeFieldSet = FIELD_SET_IMAGE_ALT_TEXT ) => {
	useSelect.mockImplementation( ( selector ) => selector( () => ( {
		selectLink: ( link ) => link + LINK_PARAMS,
		selectPreference: ( key, defaultValue ) => ( key in preferences ? preferences[ key ] : defaultValue ),
		selectActiveFieldSet: () => activeFieldSet,
	} ) ) );
};

describe( "ImageAltTextUpsell", () => {
	beforeEach( () => {
		mockUseAiUpsell.mockReturnValue( wooUpsell );
		// Without the add-on, which is what every upsell assertion below is about.
		mockStore( { isWooSeoActive: false } );
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

	describe( "with Yoast WooCommerce SEO active", () => {
		const UPDATE_URL = "https://example.com/wp-admin/update.php?action=upgrade-plugin&plugin=wpseo-woocommerce%2Fwpseo-woocommerce.php&_wpnonce=abc";

		it( "asks to update an add-on whose version predates the tab, instead of upselling it", () => {
			mockStore( { isWooSeoActive: true, isWooSeoVersionSupported: false, wooSeoUpdateUrl: UPDATE_URL } );

			render( <ImageAltTextUpsell /> );

			expect( screen.queryByRole( "heading", { name: /From flagged to fixed/ } ) ).not.toBeInTheDocument();
			expect( screen.getByRole( "dialog" ) ).toBeInTheDocument();
			expect( screen.getByRole( "heading", { name: "Your plugin needs an update" } ) ).toBeInTheDocument();
			expect( screen.getByText( /please update Yoast WooCommerce SEO to the latest version/ ) ).toBeInTheDocument();

			const link = screen.getByRole( "link", { name: /Update now/ } );
			expect( link ).toHaveAttribute( "href", UPDATE_URL );
			expect( link ).toHaveAttribute( "target", "_blank" );
		} );

		it( "hides the update link from users who may not update plugins", () => {
			mockStore( { isWooSeoActive: true, isWooSeoVersionSupported: false, wooSeoUpdateUrl: "" } );

			render( <ImageAltTextUpsell /> );

			expect( screen.getByRole( "dialog" ) ).toBeInTheDocument();
			expect( screen.queryByRole( "link", { name: /Update now/ } ) ).not.toBeInTheDocument();
			expect( screen.getByRole( "button", { name: "Close" } ) ).toBeInTheDocument();
		} );

		it( "keeps the modal closed while another tab is shown, since the panel stays mounted", () => {
			mockStore(
				{ isWooSeoActive: true, isWooSeoVersionSupported: false, wooSeoUpdateUrl: UPDATE_URL },
				FIELD_SET_SEARCH
			);

			render( <ImageAltTextUpsell /> );

			expect( screen.queryByRole( "dialog" ) ).not.toBeInTheDocument();
		} );

		it( "overlays nothing on a supported version, whose own script fills the slot", () => {
			mockStore( { isWooSeoActive: true, isWooSeoVersionSupported: true } );

			render( <ImageAltTextUpsell /> );

			expect( screen.queryByRole( "dialog" ) ).not.toBeInTheDocument();
			expect( screen.queryByRole( "heading", { name: /From flagged to fixed/ } ) ).not.toBeInTheDocument();
			expect( screen.queryByRole( "link" ) ).not.toBeInTheDocument();
		} );
	} );
} );
