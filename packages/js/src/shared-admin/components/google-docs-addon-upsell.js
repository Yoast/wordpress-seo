import { LockOpenIcon } from "@heroicons/react/outline";
import { __, sprintf } from "@wordpress/i18n";
import { safeCreateInterpolateElement } from "../../helpers/i18n";
import { Button, useModalContext } from "@yoast/ui-library";
import PropTypes from "prop-types";

/**
 * @param {Object} thumbnail The thumbnail: img props.
 * @param {string} buttonLink The button link.
 * @param {string} buttonLabel The button label.
 * @param {string} productName The product name.
 * @param {boolean} isPremium Whether the user has a premium license.
 * @param {string} ctbId The click to buy to register for this upsell instance.
 * @returns {JSX.Element} The element.
 */
export const GoogleDocsAddonUpsell = ( {
	thumbnail,
	buttonLink,
	buttonLabel = sprintf(
	/* translators: %1$s expands to Yoast SEO Premium. */
		__( "Unlock with %1$s", "wordpress-seo" ),
		"Yoast SEO Premium"
	),

	productName = "Yoast SEO Premium",
	isPremium = false,
	ctbId = "f6a84663-465f-4cb5-8ba5-f7a6d72224b2",
} ) => {
	const { onClose, initialFocus } = useModalContext();

	return (
		<>
			<div className="yst-px-10 yst-pt-10 yst-introduction-gradient yst-text-center">
				<img
					className="yst-w-full yst-h-auto yst-rounded-md"
					alt="Thumbnail for Yoast SEO Google Docs Add-On"
					loading="lazy"
					decoding="async"
					{ ...thumbnail }
				/>
				<div className="yst-mt-6 yst-text-xs yst-font-medium yst-flex yst-flex-col yst-items-center">
					<span className="yst-introduction-modal-uppercase yst-flex yst-gap-2 yst-items-center">
						<span className="yst-logo-icon" />
						{ productName }
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
							__(
								"Optimize as you draft for SEO, inclusivity, and readability. The Yoast SEO Google Docs add-on lets you export content ready for WordPress, no reformatting required.",
								"wordpress-seo"
							)
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
	productName: PropTypes.string,
	isPremium: PropTypes.bool,
	ctbId: PropTypes.string,
};
