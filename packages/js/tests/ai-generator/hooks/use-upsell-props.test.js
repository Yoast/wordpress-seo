import { renderHook } from "@testing-library/react";
import { useSelect } from "@wordpress/data";
import { useUpsellProps } from "../../../src/ai-generator/hooks/use-upsell-props";

jest.mock( "@wordpress/data", () => ( {
	useSelect: jest.fn(),
} ) );

const upsellLinks = { premium: "https://yoa.st/premium", woo: "https://yoa.st/woo" };

/**
 * Mocks `useSelect` with the given editor selectors and AI store.
 *
 * @param {Object} editor The editor store values.
 * @param {Object|undefined} aiStore The AI store selectors, or undefined when the store is not registered.
 *
 * @returns {void}
 */
const mockStores = ( editor, aiStore ) => {
	useSelect.mockImplementation( selectFn => selectFn( storeName => {
		if ( storeName === "yoast-seo/editor" ) {
			return {
				getIsWooProductEntity: () => editor.isWooProductEntity,
				getIsProduct: () => editor.isProduct,
			};
		}
		return aiStore;
	} ) );
};

describe( "useUpsellProps", () => {
	it( "returns the Premium upsell when the AI store is not registered", () => {
		mockStores( { isWooProductEntity: false, isProduct: false } );

		const { result } = renderHook( () => useUpsellProps( upsellLinks ) );

		expect( result.current.upsellLink ).toBe( upsellLinks.premium );
		expect( result.current.newToText ).toBe( "Yoast SEO Premium" );
	} );

	it( "returns the Yoast WooCommerce SEO upsell on a product when the AI store is not registered", () => {
		mockStores( { isWooProductEntity: true, isProduct: true } );

		const { result } = renderHook( () => useUpsellProps( upsellLinks ) );

		expect( result.current.upsellLink ).toBe( upsellLinks.woo );
		expect( result.current.newToText ).toBe( "Yoast WooCommerce SEO" );
	} );

	it( "returns the Premium upsell on a product when there is a valid Yoast WooCommerce SEO subscription", () => {
		mockStores( { isWooProductEntity: true, isProduct: true }, { selectWooCommerceSubscription: () => true } );

		const { result } = renderHook( () => useUpsellProps( upsellLinks ) );

		expect( result.current.upsellLink ).toBe( upsellLinks.premium );
		expect( result.current.newToText ).toBe( "Yoast SEO Premium" );
	} );
} );
