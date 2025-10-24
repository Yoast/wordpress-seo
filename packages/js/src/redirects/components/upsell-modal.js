import { LockOpenIcon } from "@heroicons/react/outline";
import { __, sprintf } from "@wordpress/i18n";
import { Button, useModalContext } from "@yoast/ui-library";
import { VideoFlow } from "../../shared-admin/components";

/**
 * @param {string} learnMoreLink The learn more link.
 * @param {Object} thumbnail The thumbnail: img props.
 * @param {Object} wistiaEmbedPermission The value, status and set for the Wistia embed permission.
 * @param {string} upsellLink The upsell link.
 * @param {string} [upsellLabel] The upsell label.
 * @param {string} [newToText] The new to text.
 * @param {string} [ctbId] The click to buy to register for this upsell instance.
 * @returns {JSX.Element} The element.
 */
export const UpsellModal = ( {
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
	const { initialFocus } = useModalContext();
	return (
		<>
			<div className="yst-introduction-gradient yst-text-center">
				<div className="yst-relative yst-w-full">
					<VideoFlow
						videoId="th5fg52ry8"
						thumbnail={ thumbnail }
						wistiaEmbedPermission={ wistiaEmbedPermission }
						hasPadding={ false }
					/>
				</div>
				<div className="yst-mt-6 yst-text-xs yst-font-medium yst-flex yst-flex-col yst-items-center">
					<span className="yst-modal-uppercase yst-flex yst-gap-2 yst-items-center">
						<span className="yst-logo-icon" />
						{ newToText }
					</span>
				</div>
			</div>
			<div className="yst-px-10 yst-pb-4 yst-flex yst-flex-col yst-items-center">
				<div className="yst-mt-4 yst-mx-1.5 yst-text-center">
					<h3 className="yst-text-slate-900 yst-text-lg yst-font-medium">
						{
							__( "Fix broken links before they hurt your SEO", "wordpress-seo" )
						}
					</h3>
					<div className="yst-mt-2 yst-text-slate-600 yst-text-sm">
						{
							sprintf(
								/* translators: %1$s translates to Yoast SEO Premium’s */
								__(
									"Deleted or moved a page? Broken links send visitors to dead ends and cost you valuable traffic. %1$s Redirect Manager automatically sends them to the right page",
									"wordpress-seo"
								),
								"Yoast SEO Premium's"
							) }
					</div>
				</div>
				<div className="yst-w-full yst-flex yst-mt-6 yst-mb-6">
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
			</div>
		</>
	);
};
