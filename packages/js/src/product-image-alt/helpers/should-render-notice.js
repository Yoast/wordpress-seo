/**
 * The function returns boolean indicating whether the notice should be rendered based on the provided parameters.
 *
 * @param {string} location - The location where the notice might be rendered.
 * @param {object|null} featuredImage - The product's featured image, or null.
 * @param {number} imagesWithoutAlt - The number of images missing alt text.
 * @returns {boolean} - Whether the notice should be rendered.
 */
export const shouldHideNotice = ( location, featuredImage, galleryImages, variationImages ) => {
	if ( location === "product-image" && featuredImage?.alt ) {
		return true;
	}

	const countGalleryImagesWithoutAlt = galleryImages.filter( ( img ) => ! img.alt ).length;
	const countVariationImagesWithoutAlt = variationImages.filter( ( v ) => v.image && ! v.image.alt ).length;

	if ( countGalleryImagesWithoutAlt === 0 && countVariationImagesWithoutAlt === 0 ) {
		return true;
	}
	return false;
};
