import { shouldHideNotice } from "../../../src/product-image-alt/helpers/should-hide-notice";

const img = ( alt ) => ( { id: 1, src: "", alt } );
const variation = ( alt ) => ( { variationId: 1, image: img( alt ) } );
const variationNoImage = () => ( { variationId: 1, image: null } );

describe( "shouldHideNotice", () => {
	describe( "product-image location", () => {
		it( "hides when there is no featured image", () => {
			expect( shouldHideNotice( "product-image", null ) ).toBe( true );
		} );

		it( "hides when the featured image has alt text", () => {
			expect( shouldHideNotice( "product-image", img( "Alt text" ) ) ).toBe( true );
		} );

		it( "shows when the featured image has an empty alt", () => {
			expect( shouldHideNotice( "product-image", img( "" ) ) ).toBe( false );
		} );
	} );

	describe( "product-gallery location", () => {
		it( "hides when the gallery is empty", () => {
			expect( shouldHideNotice( "product-gallery", null, [] ) ).toBe( true );
		} );

		it( "hides when all gallery images have alt text", () => {
			expect( shouldHideNotice( "product-gallery", null, [ img( "Alt" ) ] ) ).toBe( true );
		} );

		it( "shows when at least one gallery image is missing alt", () => {
			expect( shouldHideNotice( "product-gallery", null, [ img( "Alt" ), img( "" ) ] ) ).toBe( false );
		} );

		it( "shows when all gallery images are missing alt", () => {
			expect( shouldHideNotice( "product-gallery", null, [ img( "" ) ] ) ).toBe( false );
		} );
	} );

	describe( "product-variations location", () => {
		it( "hides when there are no variations", () => {
			expect( shouldHideNotice( "product-variations", null, [], [] ) ).toBe( true );
		} );

		it( "hides when all variation images have alt text", () => {
			expect( shouldHideNotice( "product-variations", null, [], [ variation( "Alt" ) ] ) ).toBe( true );
		} );

		it( "hides when no variation has an image", () => {
			expect( shouldHideNotice( "product-variations", null, [], [ variationNoImage() ] ) ).toBe( true );
		} );

		it( "shows when a variation image is missing alt", () => {
			expect( shouldHideNotice( "product-variations", null, [], [ variation( "" ) ] ) ).toBe( false );
		} );

		it( "shows when some variation images are missing alt", () => {
			expect( shouldHideNotice(
				"product-variations", null, [], [ variation( "Alt" ), variation( "" ) ]
			) ).toBe( false );
		} );
	} );

	it( "returns false for an unknown location", () => {
		expect( shouldHideNotice( "unknown-location", null ) ).toBe( false );
	} );

	it( "ignores featured image and gallery checks for non product-image locations", () => {
		// featured image without alt does not affect product-gallery result.
		expect( shouldHideNotice( "product-gallery", img( "" ), [] ) ).toBe( true );
	} );
} );
