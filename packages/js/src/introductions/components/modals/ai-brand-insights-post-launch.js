import { useSelect } from "@wordpress/data";
import { useMemo } from "@wordpress/element";
import { __, sprintf } from "@wordpress/i18n";
import { Button, useModalContext } from "@yoast/ui-library";
import { STORE_NAME_INTRODUCTIONS } from "../../constants";
import { Modal } from "../modal";

/**
 * @param {Object} thumbnail The thumbnail: img props.
 * @param {string} buttonLink The button link.
 * @param {string} buttonLabel The button label.
 * @param {string} productName The product name.
 * @param {string} description The description for the introduction
 * @param {string} ctbId The click to buy to register for this upsell instance.
 * @returns {JSX.Element} The element.
 */
const AiBrandInsightsPostLaunchContent = ( {
	thumbnail,
	buttonLink,
	buttonLabel = __( "Discover Brand Insights now", "wordpress-seo" ),
	productName = sprintf(
		/* translators: %1$s expands to Yoast SEO AI+. */
		__( "New - Upgrade to %1$s", "wordpress-seo" ),
		"Yoast SEO AI+"
	),
} ) => {
	const { onClose, initialFocus } = useModalContext();

	const description = __( "Track visibility, control perception, and stay ahead - tools to manage your AI presence are now live!", "wordpress-seo" );

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
						className="yst-grow"
						size="extra-large"
						variant="ai-primary"
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

/**
 * @returns {JSX.Element} The element.
 */
export const AiBrandInsightsPostLaunch = () => {
	const imageLink = useSelect( select => select( STORE_NAME_INTRODUCTIONS ).selectImageLink( "ai-brand-insights-pre-launch.png" ), [] );
	const joinWishlistLink = useSelect( select => select( STORE_NAME_INTRODUCTIONS )
		.selectLink( "https://yoa.st/ai-brand-insights-introduction-post-launch/" ), [] );
	const thumbnail = useMemo( () => ( {
		src: imageLink,
		width: "432",
		height: "243",
	} ), [ imageLink ] );

	return (
		<Modal>
			<AiBrandInsightsPostLaunchContent
				buttonLink={ joinWishlistLink }
				thumbnail={ thumbnail }
			/>
		</Modal>
	);
};
