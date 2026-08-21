/* eslint-disable complexity */
/**
 * The function returns boolean indicating whether the notice should be rendered based on the provided parameters.
 *
 * @param {string} location - The location where the notice might be rendered.
 * @param {object|null} featuredImage - The product's featured image, or null.
 * @param {Array} galleryImages - An array of gallery images.
 * @param {Array} variationImages - An array of variation images.
 * @returns {boolean} - Whether the notice should be rendered.
 */
export const shouldHideNotice = ( location, featuredImage, galleryImages = [], variationImages = [] ) => {
	if ( location === "product-image" && ( featuredImage?.alt || ! featuredImage ) ) {
		return true;
	}

	const countGalleryImagesWithoutAlt = galleryImages.filter( ( img ) => ! img.alt ).length;
	const countVariationImagesWithoutAlt = variationImages.filter( ( v ) => v.image && ! v.image.alt ).length;

	if ( location === "product-gallery" && countGalleryImagesWithoutAlt === 0 ) {
		return true;
	}

	if ( location === "product-variations" && countVariationImagesWithoutAlt === 0 ) {
		return true;
	}

	return false;
};
