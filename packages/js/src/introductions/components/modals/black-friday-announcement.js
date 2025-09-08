import { useSelect } from "@wordpress/data";
import { useMemo } from "@wordpress/element";
import { __, sprintf } from "@wordpress/i18n";
import { Button, useModalContext } from "@yoast/ui-library";
import { LockOpenIcon } from "@heroicons/react/outline";
import { STORE_NAME_INTRODUCTIONS } from "../../constants";
import { Modal } from "../modal";
import { get } from "lodash";

/**
 * @param {Object} thumbnail The thumbnail: img props.
 * @param {string} buttonLink The button link.
 * @param {Boolean} isWooEnabled Whether WooCommerce is enabled.
 * @returns {JSX.Element} The element.
 */
const BlackFridayAnnouncementContent = ( {
	thumbnail,
	buttonLink,
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

	const iconClass = useMemo( () => {
		return isWooEnabled ? "yst-cart-icon" : "yst-logo-icon";
	}, [ isWooEnabled ] );

	const introductionClass = useMemo( () => {
		return isWooEnabled ? "yst-woo-introduction-gradient" : "yst-introduction-gradient";
	}, [ isWooEnabled ] );

	const ctbId = useMemo( () => {
		return isWooEnabled ? "c7e7baa1-2020-420c-a427-89701700b607" : "f6a84663-465f-4cb5-8ba5-f7a6d72224b2";
	}, [ isWooEnabled ] );

	const description = useMemo( () => {
		/* eslint-disable stylistic/max-len */
		return isWooEnabled
			? sprintf(
				/* translators: %1$s expands to Premium, %2$s expands to Local, %3$s expands to News, %4$s expands to Video SEO, %5$s expands to Google. */
				__( "We added even more value than ever this year: %1$s, %2$s, %3$s, %4$s, and seamless %5$s Docs add-on, all included. If you've been waiting to upgrade, now’s the time..", "wordpress-seo" ),
				"Premium",
				"Local",
				"News",
				"Video SEO",
				"Google"
			)
			: sprintf(
				/* translators: %1$s expands to Local, %2$s expands to News, %3$s expands to Video SEO, %4$s expands to Google. */
				__( "We added even more value than ever this year: %1$s, %2$s, %3$s, and seamless %4$s Docs add-on, all included. If you've been waiting to upgrade, now’s the time.", "wordpress-seo" ),
				"Local",
				"News",
				"Video SEO",
				"Google"
			);
		/* eslint-enable stylistic/max-len */
	}, [ isWooEnabled ] );

	return (
		<>
			<div className={ `yst-px-10 yst-pt-10 yst-text-center ${introductionClass}` }>
				<img
					className="yst-w-full yst-h-auto yst-rounded-md yst-drop-shadow-md"
					alt={ __( "Thumbnail for the Black Friday announcement", "wordpress-seo" ) }
					loading="lazy"
					decoding="async"
					{ ...thumbnail }
				/>
				<div className="yst-mt-6 yst-text-xs yst-font-medium yst-flex yst-flex-col yst-items-center">
					<span className="yst-introduction-modal-uppercase yst-flex yst-gap-2 yst-items-center">
						<span className={ iconClass } />
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
						className="yst-grow yst-border-slate-200"
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
	const imageLink = useSelect( select => select( STORE_NAME_INTRODUCTIONS ).selectImageLink( "black-friday-2025.gif" ), [] );
	const isWooEnabled = useMemo( () => Boolean( get( window, "wpseoIntroductions.isWooEnabled", false ) ), [] );
	const buttonPremiumLink = useSelect( select => select( STORE_NAME_INTRODUCTIONS ).selectLink( "https://yoa.st/black-friday-modal-premium/" ), [] );
	const buttonWooLink = useSelect( select => select( STORE_NAME_INTRODUCTIONS ).selectLink( "https://yoa.st/black-friday-modal-ecommerce/" ), [] );

	const thumbnail = useMemo( () => ( {
		src: imageLink,
		width: "432",
		height: "243",
	} ), [ imageLink ] );

	return (
		<Modal>
			<BlackFridayAnnouncementContent
				buttonLink={ isWooEnabled ? buttonWooLink : buttonPremiumLink }
				thumbnail={ thumbnail }
				isWooEnabled={ isWooEnabled }
			/>
		</Modal>
	);
};
