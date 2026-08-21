/**
 * Counts the number of product images missing alt text across featured, gallery, and variation images.
 *
 * @param {object|null} featuredImage   The product's featured image, or null.
 * @param {Array}       galleryImages   The product's gallery images.
 * @param {Array}       variationImages Variation image entries, each with a nullable `image` property.
 *
 * @returns {number} The count of images missing alt text.
 */
export const countImagesMissingAlt = ( { featuredImage, galleryImages = [], variationImages = [] } ) => {
	return [
		featuredImage,
		...galleryImages,
		...variationImages.map( ( v ) => v.image ),
	]
		.filter( Boolean )
		.filter( ( img ) => ! img.alt )
		.length;
};
