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
 * @param {string} title The title.
 * @param {string} upsellLabel The upsell label.
 * @param {string} newToText The new to text.
 * @param {string|JSX.Element } bundleNote The bundle note.
 * @returns {JSX.Element} The element.
 */
export const AiFixAssessmentsUpsell = ( {
	learnMoreLink,
	thumbnail,
	wistiaEmbedPermission,
	upsellLink,
	title,
	upsellLabel,
	newToText,
	bundleNote,
} ) => {
	const { onClose, initialFocus } = useModalContext();

	const learnMoreLinkStructure = {
		// eslint-disable-next-line jsx-a11y/anchor-has-content
		a: <OutboundLink
			href={ learnMoreLink }
			className="yst-inline-flex yst-items-center yst-gap-1 yst-no-underline yst-font-medium"
			variant="primary"
		/>,
		ArrowNarrowRightIcon: <ArrowNarrowRightIcon className="yst-w-4 yst-h-4 rtl:yst-rotate-180" />,
	};

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
			</div>
			<div className="yst-mt-4 yst-mx-1.5 yst-text-center">
				<h3 className="yst-text-slate-900 yst-text-lg yst-font-medium">
					{ title }
				</h3>
				<div className="yst-mt-2 yst-text-slate-600 yst-text-sm">
					{ createInterpolateElement(
						sprintf(
							/* translators: %1$s and %2$s are anchor tags; %3$s is the arrow icon. */
							__(
								"Let AI fix assessments. %1$sLearn more%2$s%3$s",
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
					size="extra-large"
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
	title: PropTypes.string,
	upsellLabel: PropTypes.string,
	newToText: PropTypes.string,
	bundleNote: PropTypes.oneOfType( [
		PropTypes.string,
		PropTypes.element,
	] ),
};

AiFixAssessmentsUpsell.defaultProps = {
	title: __( "Use AI to fix assessments!", "wordpress-seo" ),
	upsellLabel: sprintf(
		/* translators: %1$s expands to Yoast SEO Premium. */
		__( "Unlock with %1$s", "wordpress-seo" ),
		"Yoast SEO Premium"
	),
	newToText: sprintf(
		/* translators: %1$s expands to Yoast SEO Premium. */
		__( "New in %1$s", "wordpress-seo" ),
		"Yoast SEO Premium"
	),
	bundleNote: "",
};