import { DummyImageAltTextTable } from "./upsell-dummy-table";
import { ImageAltTextUpsellCard } from "./upsell-card";

/**
 * The "Image alt text" tab content without Yoast WooCommerce SEO: the upsell card on top of a faded impression of
 * the add-on's tab. Both are always visible; the card cannot be dismissed.
 *
 * @returns {JSX.Element} The upsell block.
 */
export const ImageAltTextUpsell = () => (
	<div className="yst-grid">
		<div className="yst-col-start-1 yst-row-start-1 yst-min-w-0">
			<DummyImageAltTextTable />
		</div>
		<div className="yst-relative yst-z-10 yst-col-start-1 yst-row-start-1 yst-min-w-0 yst-flex yst-items-center yst-justify-center yst-p-4 sm:yst-p-6">
			<ImageAltTextUpsellCard />
		</div>
	</div>
);
