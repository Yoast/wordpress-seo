import { countImagesMissingAlt } from "../../../src/product-image-alt/helpers/count-images-missing-alt";

const img = ( alt ) => ( { id: 1, src: "https://example.com/img.jpg", alt } );

describe( "countImagesMissingAlt", () => {
	it( "returns 0 when every argument is omitted / null", () => {
		expect( countImagesMissingAlt( { featuredImage: null } ) ).toBe( 0 );
	} );

	it( "returns 0 when all images have alt text", () => {
		expect( countImagesMissingAlt( {
			featuredImage: img( "Featured alt" ),
			galleryImages: [ img( "Gallery alt" ) ],
			variationImages: [ { variationId: 1, image: img( "Variation alt" ) } ],
		} ) ).toBe( 0 );
	} );

	it( "counts a featured image with an empty alt", () => {
		expect( countImagesMissingAlt( { featuredImage: img( "" ) } ) ).toBe( 1 );
	} );

	it( "does not count a featured image that has alt text", () => {
		expect( countImagesMissingAlt( { featuredImage: img( "Alt" ) } ) ).toBe( 0 );
	} );

	it( "does not count a null featured image", () => {
		expect( countImagesMissingAlt( { featuredImage: null } ) ).toBe( 0 );
	} );

	it( "counts gallery images with an empty alt", () => {
		expect( countImagesMissingAlt( {
			galleryImages: [ img( "" ), img( "Has alt" ), img( "" ) ],
		} ) ).toBe( 2 );
	} );

	it( "skips variation entries whose image is null", () => {
		expect( countImagesMissingAlt( {
			variationImages: [
				{ variationId: 1, image: null },
				{ variationId: 2, image: img( "" ) },
			],
		} ) ).toBe( 1 );
	} );

	it( "sums missing alts across all image types", () => {
		expect( countImagesMissingAlt( {
			featuredImage: img( "" ),
			galleryImages: [ img( "" ), img( "Alt" ) ],
			variationImages: [ { variationId: 1, image: img( "" ) } ],
		} ) ).toBe( 3 );
	} );

	it( "defaults galleryImages and variationImages to empty arrays", () => {
		// Should not throw even when only featuredImage is passed.
		expect( countImagesMissingAlt( { featuredImage: img( "" ) } ) ).toBe( 1 );
	} );
} );
