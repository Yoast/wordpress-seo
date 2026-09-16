import { useSelect } from "@wordpress/data";
import { STORE_NAME } from "../constants";
import { ImageAltTextUpsell } from "./image-alt-text-upsell";

/**
 * The "Image alt text" tab's fallback panel, rendered when nothing fills the image alt text slot.
 *
 * Without Yoast WooCommerce SEO that is the upsell.
 *
 * @returns {JSX.Element} The fallback panel.
 */
export const ImageAltTextPlaceholder = () => {
	const isWooSeoActive = useSelect( ( select ) => select( STORE_NAME ).selectPreference( "isWooSeoActive", false ), [] );

	if ( ! isWooSeoActive ) {
		return <ImageAltTextUpsell />;
	}

	return (
		<div className="yst-flex yst-items-center yst-justify-center yst-rounded-md yst-border yst-border-slate-200 yst-bg-slate-50 yst-p-8 yst-text-center" />
	);
};
