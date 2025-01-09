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
 * @param {string} upsellLabel The upsell label.
 * @returns {JSX.Element} The element.
 */
export const AiFixAssessmentsUpsell = ( {
	learnMoreLink,
	thumbnail,
	wistiaEmbedPermission,
	upsellLink,
	upsellLabel,
} ) => {
	const { onClose, initialFocus } = useModalContext();

	const learnMoreLinkStructure = {
		a: <OutboundLink
			href={ learnMoreLink }
			className="yst-inline-flex yst-items-center yst-gap-1 yst-no-underline yst-font-medium"
			variant="primary"
		/>,
		ArrowNarrowRightIcon: <ArrowNarrowRightIcon className="yst-w-4 yst-h-4 rtl:yst-rotate-180" />,
		br: <br />,
	};

	return (
		<>
			<div className="yst-px-10 yst-pt-10 yst-introduction-gradient yst-text-center">
				<div className="yst-relative yst-w-full">
					<VideoFlow
						videoId="vun9z1dpfh"
						thumbnail={ thumbnail }
						wistiaEmbedPermission={ wistiaEmbedPermission }
					/>
					<Badge className="yst-absolute yst-end-4 yst-text-center yst-justify-center" variant="info" style={ { top: "-8px" } }>
						{ __( "Beta", "wordpress-seo-premium" ) }
					</Badge>
				</div>
				<div className="yst-mt-6 yst-text-xs yst-font-medium yst-flex yst-flex-col yst-items-center">
					<span className="yst-introduction-modal-uppercase yst-flex yst-gap-2 yst-items-center">
						<span className="yst-logo-icon" />
						Yoast SEO Premium
					</span>
				</div>
			</div>
			<div className="yst-px-10 yst-pb-4 yst-flex yst-flex-col yst-items-center">
				<div className="yst-mt-4 yst-mx-1.5 yst-text-center">
					<h3 className="yst-text-slate-900 yst-text-lg yst-font-medium">
						{
							sprintf(
								/* translators: %s: Expands to "Yoast AI" */
								__( "Optimize your SEO content with %s", "wordpress-seo" ),
								"Yoast AI"
							)
						}
					</h3>
					<div className="yst-mt-2 yst-text-slate-600 yst-text-sm">
						{ createInterpolateElement(
							sprintf(
								/* translators: %1$s is a break tag; %2$s and %3$s are anchor tags; %4$s is the arrow icon. */
								__(
									"Make content editing a breeze! Optimize your SEO content with quick, actionable suggestions at the click of a button.%1$s%2$sLearn more%3$s%4$s",
									"wordpress-seo"
								),
								"<br/>",
								"<a>",
								"<ArrowNarrowRightIcon />",
								"</a>"
							),
							learnMoreLinkStructure
						) }
					</div>
				</div>
				<div className="yst-w-full yst-flex yst-mt-6">
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
AiFixAssessmentsUpsell.propTypes = {
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
	upsellLabel: PropTypes.string,
};

AiFixAssessmentsUpsell.defaultProps = {
	upsellLabel: sprintf(
		/* translators: %1$s expands to Yoast SEO Premium. */
		__( "Unlock with %1$s", "wordpress-seo" ),
		"Yoast SEO Premium"
	),
};
