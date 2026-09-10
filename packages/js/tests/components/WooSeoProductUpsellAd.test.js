import { useSelect } from "@wordpress/data";
import { WooSeoProductUpsellAd } from "../../src/components/WooSeoProductUpsellAd";
import { render, screen } from "../test-utils";

jest.mock( "@wordpress/data", () => ( {
	useSelect: jest.fn(),
} ) );

/**
 * Points useSelect at a fake editor store.
 *
 * @param {Object} [overrides] Selector return values to override.
 * @param {boolean} [overrides.isWooSeoUpsell=true] Whether WooCommerce is active without Yoast WooCommerce SEO on a product entity.
 * @param {boolean} [overrides.isProduct=true] Whether the post type is a product.
 *
 * @returns {void}
 */
const mockEditorStore = ( { isWooSeoUpsell = true, isProduct = true } = {} ) => {
	const editorSelect = {
		getIsWooSeoUpsell: () => isWooSeoUpsell,
		getIsProduct: () => isProduct,
		selectLink: ( link ) => `${ link }?shortlink=1`,
	};
	useSelect.mockImplementation( ( mapSelect ) => mapSelect( () => editorSelect ) );
};

describe( "WooSeoProductUpsellAd", () => {
	afterEach( () => {
		useSelect.mockReset();
	} );

	it( "renders the Yoast WooCommerce SEO card for a product without the add-on", () => {
		mockEditorStore();
		render( <WooSeoProductUpsellAd /> );

		expect( screen.getByRole( "heading", { name: "Yoast WooCommerce SEO" } ) ).toBeInTheDocument();
		expect( screen.getByText(
			"Get ecommerce schema, product-specific assessments, and AI-generated image alt text, all in one plan."
		) ).toBeInTheDocument();

		const benefits = screen.getAllByRole( "listitem" ).map( ( item ) => item.textContent );
		expect( benefits ).toEqual( [
			"Product schema for price, reviews, and availability",
			"GTIN and SKU assessments",
			"Image alt text assessments",
			"Bulk AI-generated alt text for product images",
		] );
	} );

	it( "links the button to the shortlink with the Yoast WooCommerce SEO click-to-buy", () => {
		mockEditorStore();
		render( <WooSeoProductUpsellAd /> );

		const button = screen.getByRole( "link", { name: "Get Yoast WooCommerce SEO" } );
		expect( button ).toHaveAttribute( "href", "https://yoa.st/woo-seo-product-editor-upsell?shortlink=1" );
		expect( button ).toHaveAttribute( "target", "_blank" );
		expect( button ).toHaveAttribute( "data-action", "load-nfd-ctb" );
		expect( button ).toHaveAttribute( "data-ctb-id", "5b32250e-e6f0-44ae-ad74-3cefc8e427f9" );
	} );

	it( "renders nothing when Yoast WooCommerce SEO is active or WooCommerce is not", () => {
		mockEditorStore( { isWooSeoUpsell: false } );
		const { container } = render( <WooSeoProductUpsellAd /> );

		expect( container ).toBeEmptyDOMElement();
	} );

	it( "renders nothing on product terms, only on the product editor itself", () => {
		mockEditorStore( { isProduct: false } );
		const { container } = render( <WooSeoProductUpsellAd /> );

		expect( container ).toBeEmptyDOMElement();
	} );
} );
