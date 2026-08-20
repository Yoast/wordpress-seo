import { useSelect } from "@wordpress/data";

/**
 * 
 * @param {number} productId The ID of the product.
 * @returns {object} The product images.
 */
export const useProductImages = ( productId ) => {
	return useSelect( ( select ) => {
		const product = select( "wc/admin/products" ).getProduct( productId );

		const [ featuredImage = null, ...galleryImages ] = product?.images ?? [];

		const variations = select( "wc/admin/products/variations" )
			// eslint-disable-next-line camelcase
			.getProductVariations( { product_id: productId } ) ?? [];

		const variationImages = variations.map( ( v ) => ( {
			variationId: v.id,
			image: v.image ?? null,
		} ) );

		return {
			featuredImage,
			galleryImages,
			variationImages,
		};
	}, [ productId ] );
};
