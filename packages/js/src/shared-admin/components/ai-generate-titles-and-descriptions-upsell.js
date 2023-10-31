/* eslint-disable complexity */
import { LockOpenIcon } from "@heroicons/react/outline";
import { ArrowNarrowRightIcon } from "@heroicons/react/solid";
import { createInterpolateElement } from "@wordpress/element";
import { useSelect } from "@wordpress/data";
import { __, sprintf } from "@wordpress/i18n";
import { Badge, Button, useModalContext } from "@yoast/ui-library";
import PropTypes from "prop-types";
import { OutboundLink, VideoFlow } from ".";

const STORE = "yoast-seo/editor";

/**
 * @param {string} learnMoreLink The learn more link.
 * @param {Object} thumbnail The thumbnail: img props.
 * @param {Object} wistiaEmbedPermission The value, status and set for the Wistia embed permission.
 * @returns {JSX.Element} The element.
 */
export const AiGenerateTitlesAndDescriptionsUpsell = ( { learnMoreLink, thumbnail, wistiaEmbedPermission } ) => {
	const { onClose, initialFocus } = useModalContext();
	const upsellLinkPremium = useSelect( select => select( STORE ).selectLink( "https://yoa.st/ai-generator-upsell" ), [] );
	const upsellLinkWooPremiumBundle = useSelect( select => select( STORE ).selectLink( "https://yoa.st/ai-generator-upsell-woo-seo-premium-bundle" ), [] );
	const upsellLinkWoo = useSelect( select => select( STORE ).selectLink( "https://yoa.st/ai-generator-upsell-woo-seo" ), [] );
	const isPremium = useSelect( select => select( STORE ).getIsPremium(), [] );
	const isWooSeoUpsell = useSelect( select => select( STORE ).getIsWooSeoUpsell(), [] );
	const isProduct = useSelect( select => select( STORE ).getIsProduct(), [] );

	const wooSeoNoPremium = isProduct && ! isWooSeoUpsell && ! isPremium;
	const isProductCopy = isWooSeoUpsell || wooSeoNoPremium;
	let upsellLink = upsellLinkPremium;
	let newToText = sprintf(
		/* translators: %1$s expands to Yoast SEO Premium. */
		__( "New to %1$s", "wordpress-seo" ),
		"Yoast SEO Premium"
	);
	const learnMoreLinkStructure = {
		// eslint-disable-next-line jsx-a11y/anchor-has-content
		a: <OutboundLink
			href={ learnMoreLink }
			className="yst-inline-flex yst-items-center yst-gap-1 yst-no-underline yst-font-medium"
			variant="primary"
		/>,
		ArrowNarrowRightIcon: <ArrowNarrowRightIcon className="yst-w-4 yst-h-4 rtl:yst-rotate-180" />,
	};

	let upsellLabel = sprintf(
		/* translators: %1$s expands to Yoast SEO Premium. */
		__( "Unlock with %1$s", "wordpress-seo" ),
		"Yoast SEO Premium"
	);
	let bundleNote = "";
	let title = __( "Generate titles & descriptions with Yoast AI!", "wordpress-seo" );


	if ( isProductCopy ) {
		const upsellPremiumWooLabel = sprintf(
			/* translators: %1$s expands to Yoast SEO Premium, %2$s expands to Yoast WooCommerce SEO. */
			__( "%1$s + %2$s", "wordpress-seo" ),
			"Yoast SEO Premium",
			"Yoast WooCommerce SEO"
		);
		newToText = sprintf(
			/* translators: %1$s expands to Yoast SEO Premium and Yoast WooCommerce SEO. */
			__( "New to %1$s", "wordpress-seo" ),
			upsellPremiumWooLabel
		);
		title = __( "Generate product titles & descriptions with AI!", "wordpress-seo" );
		if ( ! isPremium && isWooSeoUpsell ) {
			upsellLabel = `${sprintf(
				/* translators: %1$s expands to Woo Premium bundle. */
				__( "Unlock with the %1$s", "wordpress-seo" ),
				"Woo Premium bundle"
			)}*`;
			bundleNote = <div className="yst-text-xs yst-text-slate-500 yst-mt-2">
				{ `*${upsellPremiumWooLabel}` }
			</div>;
			upsellLink = upsellLinkWooPremiumBundle;
		}
		if ( isPremium ) {
			upsellLabel = sprintf(
				/* translators: %1$s expands to Yoast WooCommerce SEO. */
				__( "Unlock with %1$s", "wordpress-seo" ),
				"Yoast WooCommerce SEO"
			);
			upsellLink = upsellLinkWoo;
		}
	}

	return (
		<div className="yst-flex yst-flex-col yst-items-center yst-p-10">
			<div className="yst-relative yst-w-full">
				<VideoFlow
					videoId="vmrahpfjxp"
					thumbnail={ thumbnail }
					wistiaEmbedPermission={ wistiaEmbedPermission }
				/>
				<Badge className="yst-absolute yst-top-0 yst-right-2 yst-mt-2 yst-ml-2" variant="info">Beta</Badge>
			</div>
			<div className="yst-mt-6 yst-text-xs yst-font-medium">
				<span className="yst-introduction-modal-uppercase">
					{ newToText }
				</span>

				{ ! isProductCopy && <span className="yst-uppercase yst-text-slate-700"> 21.0</span> }
			</div>
			<div className="yst-mt-4 yst-mx-1.5 yst-text-center">
				<h3 className="yst-text-slate-900 yst-text-lg yst-font-medium">
					{ title }
				</h3>
				<div className="yst-mt-2 yst-text-slate-600 yst-text-sm">
					{ isProductCopy ? createInterpolateElement(
						sprintf(
							/* translators: %1$s and %2$s are anchor tag; %3$s is the arrow icon. */
							__(
								"Speed up your workflow with generative AI. Get high-quality product title and description suggestions for your search and social appearance. %1$sLearn more%2$s%3$s",
								"wordpress-seo"
							),
							"<a>",
							"<ArrowNarrowRightIcon />",
							"</a>"
						),
						learnMoreLinkStructure
					)
						: createInterpolateElement(
							sprintf(
							/* translators: %1$s and %2$s are anchor tag; %3$s is the arrow icon. */
								__(
									"Speed up your workflow with generative AI. Get high-quality title and description suggestions for your search and social appearance. %1$sLearn more%2$s%3$s",
									"wordpress-seo"
								),
								"<a>",
								"<ArrowNarrowRightIcon />",
								"</a>"
							),
							learnMoreLinkStructure
						) }
				</div>
			</div>
			<div className="yst-w-full yst-flex yst-mt-10">
				<Button
					as="a"
					className="yst-grow"
					size="large"
					variant="upsell"
					href={ upsellLink }
					target="_blank"
					ref={ initialFocus }
				>
					<LockOpenIcon className="yst--ml-1 yst-mr-2 yst-h-5 yst-w-5" />
					{ upsellLabel }
					<span className="yst-sr-only">
						{
							/* translators: Hidden accessibility text. */
							__( "(Opens in a new browser tab)", "wordpress-seo" )
						}
					</span>
				</Button>
			</div>
			{ bundleNote }
			<Button
				as="a"
				className="yst-mt-4"
				variant="tertiary"
				onClick={ onClose }
			>
				{ __( "Close", "wordpress-seo" ) }
			</Button>
		</div>
	);
};
AiGenerateTitlesAndDescriptionsUpsell.propTypes = {
	learnMoreLink: PropTypes.string.isRequired,
	thumbnail: PropTypes.shape( {
		src: PropTypes.string.isRequired,
		width: PropTypes.string,
		height: PropTypes.string,
	} ).isRequired,
	wistiaEmbedPermission: PropTypes.shape( {
		value: PropTypes.bool.isRequired,
		status: PropTypes.string.isRequired,
		set: PropTypes.func.isRequired,
	} ).isRequired,
};
