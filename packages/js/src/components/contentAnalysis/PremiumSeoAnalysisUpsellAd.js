import { __, sprintf } from "@wordpress/i18n";
import { useSelect } from "@wordpress/data";
import { Title, useSvgAria, Button } from "@yoast/ui-library";
import { ReactComponent as CrownIcon } from "../../../images/icon-crown.svg";
import { LockOpenIcon } from "@heroicons/react/outline";
import { safeCreateInterpolateElement } from "../../helpers/i18n";
import { WooSeoAnalysisUpsellAd } from "./WooSeoAnalysisUpsellAd";

const STORE_NAME_EDITOR = "yoast-seo/editor";

/**
 * Get the location key for the upsell link.
 *
 * @param {string} location The current location.
 * @param {boolean} isElementorEditor Whether the editor is Elementor.
 * @returns {string} The location key.
 */
export const getLocationKey = ( location, isElementorEditor ) => {
	if ( isElementorEditor ) {
		return "elementor";
	}
	return location;
};

/**
 * Renders an upsell ad for Yoast SEO Premium in the SEO analysis section.
 *
 * @param {string} location The location where the component is rendered.
 *
 * @returns {JSX.Element} The PremiumSEOAnalysisUpsellAd component.
 */
export const PremiumSeoAnalysisUpsellAd = ( { location } ) => {
	const { metaboxUrl, sidebarUrl, elementorUrl, isElementorEditor, isWooCommerceActive } = useSelect( ( select ) => {
		const { selectLink } = select( STORE_NAME_EDITOR );
		return {
			metaboxUrl: selectLink( "https://yoa.st/premium-seo-analysis-metabox" ),
			sidebarUrl: selectLink( "https://yoa.st/premium-seo-analysis-sidebar" ),
			elementorUrl: selectLink( "https://yoa.st/premium-seo-analysis-elementor" ),
			isElementorEditor: select( STORE_NAME_EDITOR ).getIsElementorEditor(),
			isWooCommerceActive: select( STORE_NAME_EDITOR ).getIsWooCommerceActive(),
		};
	}, [] );

	if ( isWooCommerceActive ) {
		return <WooSeoAnalysisUpsellAd location={ location } />;
	}

	const svgAriaProps = useSvgAria();
	const locationKey = getLocationKey( location, isElementorEditor );
	const upsellLinks = {
		metabox: metaboxUrl,
		sidebar: sidebarUrl,
		elementor: elementorUrl,
	};

	return (
		<div className="yst-root">
			<div id={ `premium-seo-analysis-upsell-ad-${ locationKey }` } className="yst-border yst-border-primary-200 yst-rounded-lg yst-shadow-md yst-p-4 yst-mt-2">
				<Title as="h3" variant="h3" className="yst-text-primary-500 yst-text-base yst-font-medium yst-mb-2 yst-flex yst-gap-2 yst-capitalize">
					{ __( "Premium SEO Analysis", "wordpress-seo" ) }
					<CrownIcon className="yst-w-4" { ...svgAriaProps } />
				</Title>
				<p>
					{ __(
						"Get deeper keyphrase insights and stronger headlines",
						"wordpress-seo"
					) }
				</p>
				<div className="yst-py-2 yst-ps-6">
					<ul className="yst-list-disc yst-list-outside marker:yst-mr-0">
						<li className="yst-mb-2 yst-list-item">{
							safeCreateInterpolateElement(
								sprintf(
									/* translators: 1: Bold open tag, 2: Bold close tag */
									__( "%1$sSynonyms & word form recognition:%2$s Write more natural, flowing content.", "wordpress-seo" ),
									"<strong>",
									"</strong>"
								), {
									strong: <strong />,
								}
							)
						}
						</li>
						<li className="yst-list-item">{
							safeCreateInterpolateElement(
								sprintf(
									/* translators: 1: Bold open tag, 2: Bold close tag */
									__( "%1$sExtra SEO assessments:%2$s See additional recommendation to improve your content.", "wordpress-seo" ),
									"<strong>",
									"</strong>"
								), {
									strong: <strong />,
								}
							)
						}</li>
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
					{ __( "Unlock with Premium", "wordpress-seo" ) }
				</Button>
			</div>
		</div>
	);
};
