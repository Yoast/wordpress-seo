import { __, sprintf } from "@wordpress/i18n";
import { Button, useModalContext } from "@yoast/ui-library";
import PropTypes from "prop-types";
import { ReactComponent as AiSparkleIcon } from "../../../../../images/ai-sparkle.svg";

/**
 * @param {Object} thumbnail The thumbnail: img props.
 * @param {string} buttonLink The button link.
 * @param {string} buttonLabel The button label.
 * @param {string} productName The product name.
 * @param {string} description The description for the introduction
 * @param {string} ctbId The click to buy to register for this upsell instance.
 * @returns {JSX.Element} The element.
 */
export const AiBrandInsightsPreLaunch = ( {
	thumbnail,
	buttonLink,
	buttonLabel = __( "Join the waitlist", "wordpress-seo" ),
	productName = sprintf(
		/* translators: %1$s expands to Yoast AI brand insights. */
		__( "Introducing %1$s", "wordpress-seo" ),
		"Yoast AI brand insights"
	),
	description =  __( "Track visibility, control perception, and stay ahead - tools to manage your AI presence are coming soon!", "wordpress-seo" ),
} ) => {
	const { onClose, initialFocus } = useModalContext();

	return (
		<>
			<div className="yst-px-10 yst-pt-10 yst-introduction-gradient yst-text-center">
				<img
					className="yst-w-full yst-h-auto yst-rounded-md yst-drop-shadow-md"
					alt={ __( "Web chart showing aspects of brand visibility in AI responses", "wordpress-seo" ) }
					loading="lazy"
					decoding="async"
					{ ...thumbnail }
				/>
				<div className="yst-mt-6 yst-text-xs yst-font-medium yst-flex yst-flex-col yst-items-center">
					<span className="yst-introduction-modal-uppercase yst-flex yst-gap-2 yst-items-center">
						<span className="yst-ai-insights-icon" />
						{ productName }
					</span>
				</div>
			</div>
			<div className="yst-px-10 yst-pb-4 yst-flex yst-flex-col yst-items-center">
				<div className="yst-mt-4 yst-mx-1.5 yst-text-center">
					<h3 className="yst-text-slate-900 yst-text-lg yst-font-medium">
						{
							__( "How does your brand show up in AI responses?", "wordpress-seo" )
						}
					</h3>
					<div className="yst-mt-2 yst-text-slate-600 yst-text-sm">
						<p>{ description }</p>
					</div>
				</div>
				<div className="yst-w-full yst-flex yst-mt-6">
					<Button
						as="a"
						className="yst-grow yst-gap-2 yst-border-slate-200 yst-ai-insights-waitlist-button"
						size="extra-large"
						variant="upsell"
						href={ buttonLink }
						target="_blank"
						ref={ initialFocus }
					>
						<AiSparkleIcon className="yst-mt-[1px]" />
						{ buttonLabel }
						<span className="yst-sr-only">
							{
								/* translators: Hidden accessibility text. */
								__( "(Opens in a new browser tab)", "wordpress-seo" )
							}
						</span>
					</Button>
				</div>
				<Button
					className="yst-mt-2"
					variant="tertiary"
					onClick={ onClose }
				>
					{ __( "Close", "wordpress-seo" ) }
				</Button>
			</div>
		</>
	);
};
AiBrandInsightsPreLaunch.propTypes = {
	buttonLink: PropTypes.string.isRequired,
	thumbnail: PropTypes.shape( {
		src: PropTypes.string.isRequired,
		width: PropTypes.string,
		height: PropTypes.string,
	} ).isRequired,
	buttonLabel: PropTypes.string,
	productName: PropTypes.string,
	description: PropTypes.string,
	ctbId: PropTypes.string,
};
