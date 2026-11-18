import { renderHook } from "@testing-library/react";
import { AI_UPSELL } from "../../../src/bulk-editor/constants";
import { useAiUpsell } from "../../../src/bulk-editor/hooks/use-ai-upsell";
import registerStore from "../../../src/bulk-editor/store";

describe( "useAiUpsell", () => {
	beforeAll( () => {
		registerStore();
	} );

	it( "returns the Yoast SEO Premium upsell for non-product content types", () => {
		const { result } = renderHook( () => useAiUpsell( "post" ) );

		expect( result.current.upsellLabel ).toBe( "Unlock with Yoast SEO Premium" );
		expect( result.current.upsellLink ).toContain( AI_UPSELL.premium.link );
		expect( result.current.ctbId ).toBe( AI_UPSELL.premium.ctbId );
	} );

	it( "returns the Yoast WooCommerce SEO upsell on the product content type", () => {
		const { result } = renderHook( () => useAiUpsell( "product" ) );

		expect( result.current.upsellLabel ).toBe( "Unlock with Yoast WooCommerce SEO" );
		expect( result.current.upsellLink ).toContain( AI_UPSELL.woo.link );
		expect( result.current.ctbId ).toBe( AI_UPSELL.woo.ctbId );
	} );
} );
