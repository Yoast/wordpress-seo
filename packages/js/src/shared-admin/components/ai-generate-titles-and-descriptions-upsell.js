import { LockOpenIcon } from "@heroicons/react/outline";
import { ArrowNarrowRightIcon } from "@heroicons/react/solid";
import { createInterpolateElement } from "@wordpress/element";
import { __, sprintf } from "@wordpress/i18n";
import { Badge, Button, useModalContext } from "@yoast/ui-library";
import PropTypes from "prop-types";
import { OutboundLink, VideoFlow } from ".";

/**
 * @param {string} learnMoreLink The learn more link.
 * @param {Object} thumbnail The thumbnail: img props.
 * @param {Object} wistiaEmbedPermission The value, status and set for the Wistia embed permission.
 * @param {string} upsellLink The upsell link.
 * @param {boolean} isProductCopy Whether the upsell is for a product.
 * @param {string} title The title.
 * @param {string} upsellLabel The upsell label.
 * @param {string} newToText The new to text.
 * @param {string|JSX.Element } bundleNote The bundle note.
 * @returns {JSX.Element} The element.
 */
export const AiGenerateTitlesAndDescriptionsUpsell = ( {
	learnMoreLink,
	thumbnail,
	wistiaEmbedPermission,
	upsellLink,
	isProductCopy,
	title,
	upsellLabel,
	newToText,
	bundleNote,
} ) => {
	const { onClose, initialFocus } = useModalContext();

	const learnMoreLinkStructure = {
		a: <OutboundLink
			href={ learnMoreLink }
			className="yst-inline-flex yst-items-center yst-gap-1 yst-no-underline yst-font-medium"
			variant="primary"
		/>,
		ArrowNarrowRightIcon: <ArrowNarrowRightIcon className="yst-w-4 yst-h-4 rtl:yst-rotate-180" />,
	};

	return (
		<>
			<div className="yst-px-10 yst-pt-10 yst-introduction-gradient yst-text-center">
				<div className="yst-relative yst-w-full">
					<VideoFlow
						videoId="vmrahpfjxp"
						thumbnail={ thumbnail }
						wistiaEmbedPermission={ wistiaEmbedPermission }
					/>
					<Badge className="yst-absolute yst-top-2 yst-end-4" variant="info">Beta</Badge>
				</div>
				<div className="yst-mt-6 yst-text-xs yst-font-medium yst-flex yst-flex-col yst-items-center">
					<span className="yst-introduction-modal-uppercase yst-flex yst-gap-2 yst-items-center">
						<span className="yst-logo-icon" />
						{ newToText }
					</span>
				</div>
			</div>
			<div className="yst-px-10 yst-pb-4 yst-flex yst-flex-col yst-items-center">
				<div className="yst-mt-4 yst-mx-1.5 yst-text-center">
					<h3 className="yst-text-slate-900 yst-text-lg yst-font-medium">
						{ title }
					</h3>
					<div className="yst-mt-2 yst-text-slate-600 yst-text-sm">
						{ isProductCopy
							? createInterpolateElement(
								sprintf(
									/* translators: %1$s and %2$s are anchor tags; %3$s is the arrow icon. */
									__(
										"Let AI do some of the thinking for you and help you save time. Get high-quality suggestions for product titles and meta descriptions to make your content rank high and look good on social media. %1$sLearn more%2$s%3$s",
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
									/* translators: %1$s and %2$s are anchor tags; %3$s is the arrow icon. */
									__(
										"Let AI do some of the thinking for you and help you save time. Get high-quality suggestions for titles and meta descriptions to make your content rank high and look good on social media. %1$sLearn more%2$s%3$s",
										"wordpress-seo"
									),
									"<a>",
									"<ArrowNarrowRightIcon />",
									"</a>"
								),
								learnMoreLinkStructure
							)
						}
					</div>
				</div>
				<div className="yst-w-full yst-flex yst-mt-10">
					<Button
						as="a"
						className="yst-grow"
						size="extra-large"
						variant="upsell"
						href={ upsellLink }
						target="_blank"
						ref={ initialFocus }
					>
						<LockOpenIcon className="yst--ms-1 yst-me-2 yst-h-5 yst-w-5" />
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
		</>
	);
};
AiGenerateTitlesAndDescriptionsUpsell.propTypes = {
	learnMoreLink: PropTypes.string.isRequired,
	upsellLink: PropTypes.string.isRequired,
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
	title: PropTypes.string,
	upsellLabel: PropTypes.string,
	newToText: PropTypes.string,
	isProductCopy: PropTypes.bool,
	bundleNote: PropTypes.oneOfType( [
		PropTypes.string,
		PropTypes.element,
	] ),
};

AiGenerateTitlesAndDescriptionsUpsell.defaultProps = {
	title: __( "Use AI to write your titles & meta descriptions!", "wordpress-seo" ),
	upsellLabel: sprintf(
		/* translators: %1$s expands to Yoast SEO Premium. */
		__( "Unlock with %1$s", "wordpress-seo" ),
		"Yoast SEO Premium"
	),
	newToText: "Yoast SEO Premium",
	isProductCopy: false,
	bundleNote: "",
};
