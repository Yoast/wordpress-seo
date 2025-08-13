import { ArrowNarrowRightIcon } from "@heroicons/react/outline";
import { __, sprintf } from "@wordpress/i18n";
import { Button, Paper, Title } from "@yoast/ui-library";
import { noop } from "lodash";
import PropTypes from "prop-types";
import { getPremiumBenefits, getWooSeoBenefits } from "../../helpers/get-premium-benefits";
import { ReactComponent as CrownIcon } from "../../../images/icon-crown.svg";
import { ReactComponent as TrolleyIcon } from "../../../images/icon-trolley.svg";

/**
 * @param {string} premiumLink The premium link.
 * @param {Object} [premiumUpsellConfig] The premium upsell configuration data.
 * @param {function} isPromotionActive Callback to get whether a promotion is active.
 * @param {boolean} isWooCommerceActive Whether WooCommerce is active.
 * @returns {JSX.Element} The premium upsell card.
 */
export const PremiumUpsellList = ( { premiumLink, premiumUpsellConfig, isPromotionActive, isWooCommerceActive } ) => {
	const isBlackFriday = isPromotionActive( "black-friday-promotion" );
	const getBenefits = isWooCommerceActive
		? getWooSeoBenefits
		: getPremiumBenefits;

	let upsellTitle = isWooCommerceActive
		? sprintf(
			/* translators: %s expands to "Yoast WooCommerce SEO" */
			__( "Explore %s now!", "wordpress-seo" ),
			"Yoast WooCommerce SEO",
		)
		: sprintf(
			/* translators: %s expands to "Yoast SEO" Premium */
			__( "Explore %s now!", "wordpress-seo" ),
			"Yoast SEO Premium",
		);

	if(isBlackFriday){
		upsellTitle = __( " Get 30% off now!", "wordpress-seo" );
	}
	return (
		<Paper as="div" className="xl:yst-max-w-3xl">
			{ isBlackFriday && <div
				className="yst-rounded-t-lg yst-h-9 yst-flex yst-justify-between yst-items-center yst-bg-black yst-text-amber-300 yst-px-4 yst-text-lg yst-border-b yst-border-amber-300 yst-border-solid yst-font-semibold"
			>
				<div>{ __( "30% OFF WORDPRESS SEO", "wordpress-seo" ) }</div>
				<div>{ __( "BLACK FRIDAY", "wordpress-seo" ) }</div>
			</div> }
			<div className="yst-p-6 yst-flex yst-flex-col">
				<div className="yst-flex yst-items-center">
					{ isWooCommerceActive
						? <>
							<Title as="h2" size="4" className="yst-text-xl yst-text-primary-500">
								{ sprintf(
									/* translators: %s expands to "Yoast SEO" Premium */
									__( "Upgrade to %s", "wordpress-seo" ),
									"Yoast WooCommerce SEO",
								) }
							</Title>
							<TrolleyIcon className="yst-ml-2 yst-w-4 yst-h-3" />
						</>
						: <>
							<Title as="h2" size="4" className="yst-text-xl yst-text-primary-500">
								{ sprintf(
									/* translators: %s expands to "Yoast SEO" Premium */
									__( "Upgrade to %s", "wordpress-seo" ),
									"Yoast SEO Premium",
								) }
							</Title>
							<CrownIcon className="yst-ml-2 yst-w-4 yst-h-3" />
						</>
					}
				</div>
				<span
					className="yst-font-medium yst-text-slate-500 yst-text-xs yst-leading-5 yst-uppercase yst-mt-2">{ __( "Now includes Local, News & Video SEO + 1 Google Docs seat!", "wordpress-seo" ) }</span>
				<ul className="yst-grid yst-grid-cols-1 sm:yst-grid-cols-2 yst-gap-x-6 yst-list-none yst-list-outside yst-text-slate-600 yst-mt-6">
					{ getBenefits().map( ( benefit, index ) => (
						<li key={ `upsell-benefit-${ index }` }><span className="yst-mx-2">•</span>{ benefit }</li>
					) ) }
				</ul>
				<Button
					as="a"
					variant="upsell"
					size="extra-large"
					href={ premiumLink }
					className="yst-gap-2 yst-mt-4"
					target="_blank"
					rel="noopener"
					{ ...premiumUpsellConfig }
				>
					{ upsellTitle }
					<ArrowNarrowRightIcon className="yst-w-4 yst-h-4 yst-icon-rtl" />
				</Button>
			</div>
		</Paper>
	);
};

PremiumUpsellList.propTypes = {
	premiumLink: PropTypes.string.isRequired,
	premiumUpsellConfig: PropTypes.object,
	isPromotionActive: PropTypes.func,
	isWooCommerceActive: PropTypes.bool.isRequired,
};

PremiumUpsellList.defaultProps = {
	premiumUpsellConfig: {},
	isPromotionActive: noop,
};
