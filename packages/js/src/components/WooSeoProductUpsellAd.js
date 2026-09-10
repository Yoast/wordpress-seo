import LockOpenIcon from "@heroicons/react/outline/LockOpenIcon";
import CheckCircleIcon from "@heroicons/react/solid/CheckCircleIcon";
import ShoppingCartIcon from "@heroicons/react/solid/ShoppingCartIcon";
import { useSelect } from "@wordpress/data";
import { __, sprintf } from "@wordpress/i18n";
import { Button, Title, useSvgAria } from "@yoast/ui-library";

const STORE_NAME_EDITOR = "yoast-seo/editor";

/**
 * The ID for the Yoast WooCommerce SEO upsell ad.
 * @type {string}
 */
const WOO_SEO_CTB_ID = "5b32250e-e6f0-44ae-ad74-3cefc8e427f9";

/**
 * Renders an upsell ad for Yoast WooCommerce SEO at the top of the product editor metabox.
 *
 * Only renders for product posts when WooCommerce is active and Yoast WooCommerce SEO is not.
 *
 * @returns {JSX.Element|null} The upsell ad, or null when it should not be shown.
 */
export const WooSeoProductUpsellAd = () => {
	const svgAriaProps = useSvgAria();
	const { isWooSeoProductUpsell, upsellLink } = useSelect( ( select ) => {
		const editorSelect = select( STORE_NAME_EDITOR );
		return {
			isWooSeoProductUpsell: editorSelect.getIsWooSeoUpsell() && editorSelect.getIsProduct(),
			upsellLink: editorSelect.selectLink( "https://yoa.st/woo-seo-product-editor-upsell" ),
		};
	}, [] );

	if ( ! isWooSeoProductUpsell ) {
		return null;
	}

	const benefits = [
		__( "Product schema for price, reviews, and availability", "wordpress-seo" ),
		__( "GTIN and SKU assessments", "wordpress-seo" ),
		__( "Image alt text assessments", "wordpress-seo" ),
		__( "Bulk AI-generated alt text for product images", "wordpress-seo" ),
	];

	return (
		<div className="yst-root">
			<div
				id="woo-seo-product-upsell-ad"
				className="yst-border yst-border-woo-light yst-border-opacity-30 yst-rounded-lg yst-shadow-md yst-p-4"
			>
				<Title as="h4" className="yst-text-woo-light yst-text-base yst-font-medium yst-mb-2 yst-flex yst-gap-2">
					Yoast WooCommerce SEO
					<ShoppingCartIcon className="yst-w-5 yst-scale-x-[-1]" { ...svgAriaProps } />
				</Title>
				<p>
					{ __( "Get ecommerce schema, product-specific assessments, and AI-generated image alt text, all in one plan.", "wordpress-seo" ) }
				</p>
				<ul className="yst-mt-2 yst-mb-1 yst-flex yst-flex-col yst-gap-1">
					{ benefits.map( ( benefit ) => (
						<li key={ benefit } className="yst-flex yst-items-start yst-gap-2">
							<CheckCircleIcon className="yst-w-[18px] yst-h-[18px] yst-mt-px yst-shrink-0 yst-text-green-500" { ...svgAriaProps } />
							{ benefit }
						</li>
					) ) }
				</ul>
				<Button
					variant="upsell"
					as="a"
					href={ upsellLink }
					target="_blank"
					rel="noopener noreferrer"
					className="yst-mt-2"
					data-action="load-nfd-ctb"
					data-ctb-id={ WOO_SEO_CTB_ID }
				>
					<LockOpenIcon className="yst-w-4 yst-me-1.5" { ...svgAriaProps } />
					{ sprintf(
						/* translators: %s expands to Yoast WooCommerce SEO. */
						__( "Get %s", "wordpress-seo" ),
						"Yoast WooCommerce SEO"
					) }
				</Button>
			</div>
		</div>
	);
};

