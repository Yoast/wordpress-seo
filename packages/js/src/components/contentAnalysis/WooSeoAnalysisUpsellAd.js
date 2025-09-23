import { __, sprintf } from "@wordpress/i18n";
import { Title, useSvgAria, Button } from "@yoast/ui-library";
import { LockOpenIcon, PhotographIcon, TagIcon, IdentificationIcon } from "@heroicons/react/outline";
import { ShoppingCartIcon } from "@heroicons/react/solid";
import { useSelect } from "@wordpress/data";
import { getLocationKey } from "./PremiumSeoAnalysisUpsellAd";

const STORE_NAME_EDITOR = "yoast-seo/editor";

/**
 * Renders an upsell ad for Woo SEO in the SEO analysis section.
 *
 * @param {string} location The location where the component is rendered.
 *
 * @returns {JSX.Element} The WooSeoAnalysisUpsellAd component.
 */
export const WooSeoAnalysisUpsellAd = ( { location } ) => {
	const svgAriaProps = useSvgAria();

	const list = [
		{ icon: PhotographIcon, text: __( "Image alt attributes", "wordpress-seo" ) },
		{ icon: TagIcon, text: __( "Product identifiers", "wordpress-seo" ) },
		{ icon: IdentificationIcon, text: __( "SKUs", "wordpress-seo" ) },
	];

	const { metaboxUrl, sidebarUrl, elementorUrl, isElementorEditor } = useSelect( ( select ) => {
		const { selectLink } = select( STORE_NAME_EDITOR );
		return {
			metaboxUrl: selectLink( "https://yoa.st/seo-analysis-metabox-woocommerce" ),
			sidebarUrl: selectLink( "https://yoa.st/seo-analysis-sidebar-woocommerce" ),
			elementorUrl: selectLink( "https://yoa.st/seo-analysis-woocommerce-elementor" ),
			isElementorEditor: select( STORE_NAME_EDITOR ).getIsElementorEditor(),
		};
	}, [] );

	const upsellLinks = {
		metabox: metaboxUrl,
		sidebar: sidebarUrl,
		elementor: elementorUrl,
	};

	const locationKey = getLocationKey( location, isElementorEditor );

	return (
		<div className="yst-root">
			<div id={ `woo-seo-analysis-upsell-ad-${ locationKey }` } className="yst-border yst-border-woo-light yst-rounded-lg yst-shadow-md yst-p-4 yst-mt-2 yst-border-opacity-30">
				<Title as="h3" variant="h3" className="yst-text-woo-light yst-text-base yst-font-medium yst-mb-2 yst-flex yst-gap-2">
					{ __( "Premium SEO analysis", "wordpress-seo" ) }
					<ShoppingCartIcon className="yst-w-5 yst-scale-x-[-1]" { ...svgAriaProps } />
				</Title>
				<p>
					{ __(
						"Benefit from all Premium SEO analyses, plus product-specific checks like:",
						"wordpress-seo"
					) }
				</p>
				<div className="yst-pt-2 yst-mb-1">
					<ul className="yst-font-semibold">
						{ list.map( ( item ) => (
							<li key={ item.text } className="yst-flex yst-items-center yst-gap-2 yst-mb-1">
								<item.icon className="yst-w-4 yst-text-slate-400" />
								{ item.text }
							</li>
						) ) }

					</ul>
				</div>
				<Button
					variant="upsell"
					as="a"
					href={ upsellLinks[ locationKey ] }
					target="_blank"
					rel="noopener noreferrer"
					className="yst-mt-2"
					data-action="load-nfd-ctb"
					data-ctb-id="f6a84663-465f-4cb5-8ba5-f7a6d72224b2"
				>
					<LockOpenIcon className="yst-w-4 yst-me-1.5" { ...svgAriaProps } />
					{ sprintf(
						/* translators: WooCommerce SEO */
						__( "Get %s", "wordpress-seo" ),
						"WooCommerce SEO"
					) }
				</Button>
			</div>
		</div>
	);
};
