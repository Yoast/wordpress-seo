import { useSelect } from "@wordpress/data";
import { STORE_NAME } from "../../constants";
import { DummyImageAltTextTable } from "./upsell-dummy-table";
import { ImageAltTextUpsellCard } from "./upsell-card";
import { WooSeoUpdateNotice } from "./woo-seo-update-notice";

/**
 * The "Image alt text" tab content while Yoast WooCommerce SEO is not supplying the tab itself.
 *
 * Without the add-on, the upsell card on top of a faded impression of the add-on's tab. With a version that
 * predates the tab, a notice asking to update it. A supported version fills the slot itself, so the panel stays
 * empty while its script is still loading.
 *
 * @returns {JSX.Element|null} The upsell block, the update notice, or nothing.
 */
export const ImageAltTextUpsell = () => {
	const { isWooSeoActive, isWooSeoVersionSupported } = useSelect( ( select ) => {
		const store = select( STORE_NAME );
		return {
			isWooSeoActive: store.selectPreference( "isWooSeoActive", false ),
			isWooSeoVersionSupported: store.selectPreference( "isWooSeoVersionSupported", false ),
		};
	}, [] );

	if ( isWooSeoActive ) {
		return isWooSeoVersionSupported ? null : <WooSeoUpdateNotice />;
	}

	return (
		<div className="yst-grid">
			<div className="yst-col-start-1 yst-row-start-1 yst-min-w-0">
				<DummyImageAltTextTable />
			</div>
			<div className="yst-relative yst-z-10 yst-col-start-1 yst-row-start-1 yst-min-w-0 yst-flex yst-items-center yst-justify-center yst-p-4 sm:yst-p-6">
				<ImageAltTextUpsellCard />
			</div>
		</div>
	);
};
