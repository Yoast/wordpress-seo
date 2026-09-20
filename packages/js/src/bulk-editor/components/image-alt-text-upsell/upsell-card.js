import LockClosedIcon from "@heroicons/react/outline/LockClosedIcon";
import { useSelect } from "@wordpress/data";
import { __ } from "@wordpress/i18n";
import { Button, useSvgAria } from "@yoast/ui-library";
import { ReactComponent as YoastIcon } from "../../../../images/Yoast_icon_kader.svg";
import { IMAGE_ALT_TEXT_UPSELL_LINK, PRODUCT_CONTENT_TYPE, STORE_NAME } from "../../constants";
import { useAiUpsell } from "../../hooks/use-ai-upsell";

const TITLE_ID = "yoast-bulk-editor-image-alt-text-upsell-title";

// The card's visual, relative to the plugin URL: the add-on's alt text review flow with AI suggestions.
const VISUAL_PATH = "/images/bulk-editor-image-alt-text-upsell.jpg";

/**
 * The Yoast WooCommerce SEO upsell card for the "Image alt text" tab.
 *
 * Always visible, therefore a plain section rather than a dialog.
 *
 * @returns {JSX.Element} The upsell card.
 */
export const ImageAltTextUpsellCard = () => {
	const svgAriaProps = useSvgAria();
	// The label and click-to-buy id are the Woo ones the bulk AI upsell uses; only the shortlink is specific to this tab.
	const { upsellLabel, ctbId } = useAiUpsell( PRODUCT_CONTENT_TYPE );
	const { upsellLink, pluginUrl } = useSelect( ( select ) => ( {
		upsellLink: select( STORE_NAME ).selectLink( IMAGE_ALT_TEXT_UPSELL_LINK ),
		pluginUrl: select( STORE_NAME ).selectPreference( "pluginUrl", "" ),
	} ), [] );
	const ctbProps = ctbId ? { "data-action": "load-nfd-ctb", "data-ctb-id": ctbId } : {};

	return (
		<section
			aria-labelledby={ TITLE_ID }
			className="yst-w-full yst-max-w-3xl yst-overflow-hidden yst-rounded-2xl yst-bg-white yst-shadow-2xl"
		>
			{ /* Decorative: the heading and description carry the meaning, so the image is hidden from assistive technology. */ }
			<img
				src={ pluginUrl + VISUAL_PATH }
				alt=""
				width="864"
				height="488"
				loading="lazy"
				className="yst-block yst-w-full yst-h-auto yst-bg-slate-100"
			/>
			<div className="yst-flex yst-flex-col yst-items-center yst-gap-6 yst-px-6 yst-pb-8 yst-pt-6 yst-text-center sm:yst-px-10 sm:yst-pb-10">
				<div className="yst-flex yst-flex-col yst-items-center yst-gap-4">
					<span className="yst-flex yst-items-center yst-gap-2 yst-text-xs yst-font-medium yst-uppercase yst-tracking-wider yst-text-slate-500">
						<YoastIcon className="yst-h-4 yst-w-4 yst-shrink-0 yst-fill-primary-500" { ...svgAriaProps } />
						<span>Yoast WooCommerce SEO</span>
					</span>
					<div className="yst-flex yst-flex-col yst-items-center yst-gap-2">
						<h3 id={ TITLE_ID } className="yst-m-0 yst-text-lg yst-font-medium yst-text-slate-900">
							{ __( "From flagged to fixed: image alt text across your whole catalog", "wordpress-seo" ) }
						</h3>
						<p className="yst-m-0 yst-max-w-lg yst-text-sm yst-text-slate-600">
							{ __(
								"Generate accurate alt text for every product image in your catalog, grounded in your product data and the photo itself. Preview every suggestion before it saves, so you decide what goes live.",
								"wordpress-seo"
							) }
						</p>
					</div>
				</div>
				<Button
					as="a"
					variant="upsell"
					size="extra-large"
					href={ upsellLink }
					target="_blank"
					rel="noopener noreferrer"
					className="yst-w-full yst-max-w-lg"
					{ ...ctbProps }
				>
					<LockClosedIcon className="yst--ms-1 yst-me-2 yst-h-5 yst-w-5" { ...svgAriaProps } />
					{ upsellLabel }
					<span className="yst-sr-only">{ __( "(Opens in a new browser tab)", "wordpress-seo" ) }</span>
				</Button>
			</div>
		</section>
	);
};
