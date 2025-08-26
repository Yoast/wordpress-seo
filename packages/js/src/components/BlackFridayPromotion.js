/* eslint-disable complexity */

import { useSelect, dispatch } from "@wordpress/data";
import { __ } from "@wordpress/i18n";
import { addQueryArgs } from "@wordpress/url";
import PropTypes from "prop-types";
import { Button, Badge } from "@yoast/ui-library";
import { XIcon, ArrowNarrowRightIcon, ShoppingCartIcon } from "@heroicons/react/solid";
import { useCallback } from "@wordpress/element";
import { ReactComponent as CrownIcon } from "../../images/icon-crown.svg";
import classNames from "classnames";

/**
 * The BlackFridayPromotion component.
 *
 * @param {string} store The store to use. Defaults to {@code yoast-seo/editor}
 * @param {string} location Where the notice will be shown. Defaults to {@code sidebar}
 * @param {Object} props The props.
 *
 * @returns {JSX.Element} The BlackFridayPromotion component.
 */
export const BlackFridayPromotion = ( {
	store = "yoast-seo/editor",
	location = "sidebar",
} ) => {
	const alertKey = "black-friday-promotion";
	const isPremium = useSelect( select => select( store ).getIsPremium(), [ store ] );
	const linkParams = useSelect( select => select( store ).selectLinkParams(), [ store ] );
	const promotionActive = useSelect( select => select( store ).isPromotionActive( alertKey ), [ store ] );
	const isWooCommerceActive = useSelect( select => select( store ).getIsWooCommerceActive(), [ store ] );
	const isAlertDismissed = useSelect( select => select( store ).isAlertDismissed( alertKey ), [ store ] );
	const onDismiss = useCallback( () => {
		dispatch( store ).dismissAlert( alertKey );
	}, [ store, alertKey ] );
	const upsellLink = addQueryArgs( "https://yoa.st/black-friday-sale", linkParams );

	if ( isPremium ) {
		return null;
	}

	if ( ! promotionActive || isAlertDismissed ) {
		return null;
	}

	return (
		<div className="yst-root">
			<div
				className={
					classNames(
						location === "sidebar" ? "yst-mx-0" : "yst-mx-4",
						"yst-border yst-rounded-lg yst-p-4 yst-max-w-md yst-mt-6 yst-relative yst-shadow-sm",
						isWooCommerceActive ? "yst-border-woo-light" : "yst-border-primary-200" ) }
			>
				<Badge size="small"className="yst-text-[10px] yst-bg-black yst-text-amber-300 yst-absolute yst--top-2">
					{ __( "BLACK FRIDAY", "wordpress-seo" ) } </Badge>
				<button className="yst-absolute yst-top-4 yst-end-4" onClick={ onDismiss }>
					<XIcon className="yst-w-4 yst-text-slate-400 yst-shrink-0 yst--mt-0.5" />
					<div className="yst-sr-only">{ __( "Dismiss", "wordpress-seo" ) }</div>
				</button>
				<div
					className={
						classNames( location === "sidebar" ? "" : "yst-flex yst-justify-between yst-gap-3" ) }
				>
					<div className={ isWooCommerceActive ? "yst-text-woo-light" : "yst-text-primary-500" }>
						<div className="yst-text-2xl yst-font-bold">
							{ __( "30% OFF", "wordpress-seo" ) }
						</div>
						<div className="yst-flex yst-gap-2 yst-font-semibold yst-text-tiny">
							{ isWooCommerceActive
								? <>Yoast WooCommerce SEO <ShoppingCartIcon className="yst-w-4 yst-scale-x-[-1]" /></>
								: <> Yoast SEO Premium <CrownIcon className="yst-w-4" /></> }
						</div>
					</div>
					<div className="yst-flex yst-items-end">
						<Button
							as="a"
							className={ classNames(
								location === "sidebar" ? "yst-w-full" : "yst-w-[140px]",
								"yst-flex yst-gap-1 yst-w-[140px] yst-h-7 yst-mt-4" ) }
							variant="upsell"
							href={ upsellLink }
							target="_blank"
							rel="noreferrer"
						>
							{ __( "Buy now!", "wordpress-seo" ) }
							<ArrowNarrowRightIcon className="yst-w-4 rtl:yst-rotate-180" />
						</Button>
					</div>
				</div>
			</div>
		</div>
	);
};

BlackFridayPromotion.propTypes = {
	store: PropTypes.string,
	location: PropTypes.oneOf( [ "sidebar", "metabox" ] ),
};
