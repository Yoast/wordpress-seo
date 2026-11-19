import LockOpenIcon from "@heroicons/react/outline/LockOpenIcon";
import ArrowNarrowRightIcon from "@heroicons/react/solid/ArrowNarrowRightIcon";
import { __, sprintf } from "@wordpress/i18n";
import { Badge, Button, useModalContext } from "@yoast/ui-library";
import { OutboundLink, VideoFlow } from ".";
import { safeCreateInterpolateElement } from "../../helpers/i18n";

/**
 * @param {Object} props Component props.
 * @param {string} props.learnMoreLink The learn more link.
 * @param {string} props.upsellLink The upsell link.
 * @param {Object} props.thumbnail The thumbnail: img props.
 * @param {string} props.thumbnail.src The thumbnail image URL.
 * @param {string} [props.thumbnail.width] The thumbnail width.
 * @param {string} [props.thumbnail.height] The thumbnail height.
 * @param {Object} props.wistiaEmbedPermission The value, status and set for the Wistia embed permission.
 * @param {boolean} props.wistiaEmbedPermission.value Whether the Wistia embed permission is granted.
 * @param {string} props.wistiaEmbedPermission.status The async status of storing the permission.
 * @param {Function} props.wistiaEmbedPermission.set Stores the Wistia embed permission.
 * @param {string} [props.upsellLabel] The upsell label.
 * @param {string} [props.newToText="Yoast SEO Premium"] The new to text.
 * @param {string} [props.ctbId="f6a84663-465f-4cb5-8ba5-f7a6d72224b2"] The click to buy to register for this upsell instance.
 *
 * @returns {JSX.Element} The element.
 */
export const AIOptimizeUpsell = ( {
	learnMoreLink,
	thumbnail,
	wistiaEmbedPermission,
	upsellLink,
	upsellLabel = sprintf(
		/* translators: %1$s expands to Yoast SEO Premium. */
		__( "Unlock with %1$s", "wordpress-seo" ),
		"Yoast SEO Premium"
	),
	newToText = "Yoast SEO Premium",
	ctbId = "f6a84663-465f-4cb5-8ba5-f7a6d72224b2",
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
						{ __( "Beta", "wordpress-seo" ) }
					</Badge>
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
						{
							sprintf(
								/* translators: %s: Expands to "Yoast AI" */
								__( "Optimize your SEO content with %s", "wordpress-seo" ),
								"Yoast AI"
							)
						}
					</h3>
					<div className="yst-mt-2 yst-text-slate-600 yst-text-sm">
						{ safeCreateInterpolateElement(
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
						data-action="load-nfd-ctb"
						data-ctb-id={ ctbId }
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
