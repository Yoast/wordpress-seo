import { LockOpenIcon } from "@heroicons/react/outline";
import { ArrowNarrowRightIcon } from "@heroicons/react/solid";
import { __, sprintf } from "@wordpress/i18n";
import { safeCreateInterpolateElement } from "../../helpers/i18n";
import { Button, useModalContext } from "@yoast/ui-library";
import PropTypes from "prop-types";
import { OutboundLink } from ".";

/**
 * @param {string} learnMoreLink The learn more link.
 * @param {Object} thumbnail The thumbnail: img props.
 * @param {string} buttonLink The button link.
 * @param {string} buttonLabel The button label.
 * @param {string} newToText The new to text.
 * @param {string|JSX.Element} bundleNote The bundle note.
 * @param {string} ctbId The click to buy to register for this upsell instance.
 * @returns {JSX.Element} The element.
 */
export const GoogleDocsAddonUpsell = ( {
	learnMoreLink,
	thumbnail,
	buttonLink,
	buttonLabel,
	newToText,
	isPremium,
	bundleNote,
	ctbId,
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
				<img
					className="yst-w-full yst-h-auto yst-rounded-md"
					alt=""
					loading="lazy"
					decoding="async"
					{ ...thumbnail }
				/>
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
								/* translators: %s: Yoast SEO Google Docs Add-On" */
								__( "%s - incl. in Premium", "wordpress-seo" ),
								"Yoast SEO Google Docs Add-On"
							)
						}
					</h3>
					<div className="yst-mt-2 yst-text-slate-600 yst-text-sm">
						{ safeCreateInterpolateElement(
							sprintf(
								/* translators: %1$s is a break tag; %2$s and %3$s are anchor tags; %4$s is the arrow icon. */
								__(
									"Optimize as you draft for SEO, inclusivity, and readability. The Yoast SEO Google Docs add-on lets you export content ready for WordPress, no reformatting required.%1$s%2$sLearn more%3$s%4$s",
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
					{
						isPremium ? (
							<Button
								as="a"
								className="yst-grow"
								size="extra-large"
								variant="primary"
								href={ buttonLink }
								target="_blank"
								ref={ initialFocus }
							>
								{ buttonLabel }
								<span className="yst-sr-only">
									{
									/* translators: Hidden accessibility text. */
										__( "(Opens in a new browser tab)", "wordpress-seo" )
									}
								</span>
							</Button>
						) : (
							<Button
								as="a"
								className="yst-grow"
								size="extra-large"
								variant="upsell"
								href={ buttonLink }
								target="_blank"
								ref={ initialFocus }
								data-action="load-nfd-ctb"
								data-ctb-id={ ctbId }
							>
								<LockOpenIcon className="yst--ms-1 yst-me-2 yst-h-5 yst-w-5" />
								{ buttonLabel }
								<span className="yst-sr-only">
									{
										/* translators: Hidden accessibility text. */
										__( "(Opens in a new browser tab)", "wordpress-seo" )
									}
								</span>
							</Button>
						)
					}
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
GoogleDocsAddonUpsell.propTypes = {
	learnMoreLink: PropTypes.string.isRequired,
	buttonLink: PropTypes.string.isRequired,
	thumbnail: PropTypes.shape( {
		src: PropTypes.string.isRequired,
		width: PropTypes.string,
		height: PropTypes.string,
	} ).isRequired,
	buttonLabel: PropTypes.string,
	newToText: PropTypes.string,
	isPremium: PropTypes.bool,
	bundleNote: PropTypes.oneOfType( [
		PropTypes.string,
		PropTypes.element,
	] ),
	ctbId: PropTypes.string,
};

GoogleDocsAddonUpsell.defaultProps = {
	buttonLabel: sprintf(
		/* translators: %1$s expands to Yoast SEO Premium. */
		__( "Unlock with %1$s", "wordpress-seo" ),
		"Yoast SEO Premium"
	),
	newToText: "Yoast SEO Premium",
	isPremium: false,
	bundleNote: "",
	ctbId: "f6a84663-465f-4cb5-8ba5-f7a6d72224b2",
};
