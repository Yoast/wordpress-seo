import { useSelect } from "@wordpress/data";
import { useMemo } from "@wordpress/element";
import { Root } from "@yoast/ui-library";
import { ImageAltNotice } from "./image-alt-notice";
import { noop, get } from "lodash";
import { useProductImage, useProductGallery, useVariationImages } from "../hooks";
import { countImagesMissingAlt, shouldHideNotice } from "../helpers";

/**
 * The App component is the main entry point for the product image alt notice feature.
 *
 * Subscribes to the WooCommerce products store and hides the notice when all
 * images have alt text.
 *
 * @param {object}   props           The component props.
 * @param {string}   props.className Additional class names for styling.
 *
 * @returns {JSX.Element|null} The rendered component, or null when no images are missing alt text.
 */
export const App = ( { className, location } ) => {
	const { isRtl } = useSelect( ( select ) => {
		const selectors = select( "yoast-seo/editor" );
		return {
			isRtl: selectors.getPreference( "isRtl", false ),
		};
	}, [] );
	const initialVariationImages = get( window, "wpseoProductImageAlt.variationImages", [] );

	const { featuredImage, isLoadingFeaturedImageAlt } = useProductImage();
	const { galleryImages, isLoadingProductGalleryAlts } = useProductGallery();
	const { variationImages, isLoadingVariationImagesAlts } = useVariationImages( initialVariationImages );

	const isLoading = isLoadingFeaturedImageAlt || isLoadingProductGalleryAlts || isLoadingVariationImagesAlts;

	const imagesWithoutAlt = useMemo( () =>
		countImagesMissingAlt( { featuredImage, galleryImages, variationImages } )
	, [ featuredImage, galleryImages, variationImages ] );

	const hideNotice = useMemo( () =>
		shouldHideNotice( location, featuredImage, galleryImages, variationImages )
	, [ location, featuredImage, galleryImages, variationImages ] );

	if ( hideNotice || isLoading ) {
		return null;
	}

	return (
		<Root context={ { isRtl } }>
			<ImageAltNotice
				numberOfImagesMissingAlt={ imagesWithoutAlt }
				className={ className }
				onClick={ noop }
			/>
		</Root>
	);
};
