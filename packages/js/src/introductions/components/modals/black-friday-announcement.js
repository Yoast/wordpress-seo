import { useSelect } from "@wordpress/data";
import { useMemo } from "@wordpress/element";
import { __, sprintf } from "@wordpress/i18n";
import { Button, useModalContext } from "@yoast/ui-library";
import { SparklesIcon } from "@heroicons/react/outline";
import { STORE_NAME_INTRODUCTIONS } from "../../constants";
import { Modal } from "../modal";
import { get } from "lodash";

/**
 * @param {Object} thumbnail The thumbnail: img props.
 * @param {string} buttonLink The button link.
 * @param {string} description The description for the introduction
 * @param {Boolean} isWoo Whether the user has WooCommerce enabled.
 * @returns {JSX.Element} The element.
 */
const BlackFridayAnnouncementContent = ( {
	thumbnail,
	buttonLink,
	description =  __( "Track visibility, control perception, and stay ahead - tools to manage your AI presence are coming soon!", "wordpress-seo" ),
	isWooEnabled,
} ) => {
	const { onClose, initialFocus } = useModalContext();

	const productName = useMemo( () => {
		return isWooEnabled ? "Yoast WooCommerce SEO" : "Yoast SEO Premium";
	}, [ isWooEnabled ] );

	const buttonLabel = useMemo( () => {
		const product = isWooEnabled ? "WooCommerce SEO" : "Premium";

		return sprintf(
			/* translators: %1$s expands to either Premium or WooCommerce SEO. */
			__( "Get %1$s with 30%% off", "wordpress-seo" ),
			product
		);
	}, [ isWooEnabled ] );

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
							__( "Black Friday: Our biggest sale just dropped!", "wordpress-seo" )
						}
					</h3>
					<div className="yst-mt-2 yst-text-slate-600 yst-text-sm">
						<p>{ description }</p>
					</div>
				</div>
				<div className="yst-w-full yst-flex yst-mt-6">
					<Button
						as="a"
						className="yst-grow yst-border-slate-200 yst-ai-insights-waitlist-button"
						size="extra-large"
						variant="upsell"
						href={ buttonLink }
						target="_blank"
						ref={ initialFocus }
					>
						<SparklesIcon className="yst--ms-1 yst-me-2 yst-h-5 yst-w-5 yst-text-white" />
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
export const BlackFridayAnnouncement = () => {
	const imageLink = useSelect( select => select( STORE_NAME_INTRODUCTIONS ).selectImageLink( "ai-brand-insights-pre-launch.png" ), [] );
	const joinWishlistLink = useSelect( select => select( STORE_NAME_INTRODUCTIONS ).selectLink( "https://yoa.st/ai-brand-insights-introduction-pre-launch/" ), [] );
	const isWooEnabled = useMemo( () => Boolean( get( window, "wpseoIntroductions.isWooEnabled", false ) ), [] );

	const thumbnail = useMemo( () => ( {
		src: imageLink,
		width: "432",
		height: "243",
	} ), [ imageLink ] );

	return (
		<Modal>
			<BlackFridayAnnouncementContent
				buttonLink={ joinWishlistLink }
				thumbnail={ thumbnail }
				isWooEnabled={ isWooEnabled }
			/>
		</Modal>
	);
};
