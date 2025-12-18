/* eslint-disable complexity */
import { ArrowNarrowRightIcon } from "@heroicons/react/outline";
import { CheckCircleIcon } from "@heroicons/react/solid";
import { __, sprintf } from "@wordpress/i18n";
import { Badge, Button, Paper, Title } from "@yoast/ui-library";
import classNames from "classnames";
import PropTypes from "prop-types";
import { getPremiumBenefits, getWooSeoBenefits } from "../../helpers/get-premium-benefits";
import { ReactComponent as CrownIcon } from "../../../images/icon-crown.svg";
import { ReactComponent as TrolleyIcon } from "../../../images/icon-trolley.svg";

/**
 * @param {string} premiumLink The premium link.
 * @param {Object} premiumUpsellConfig The premium upsell configuration data.
 * @param {function} isPromotionActive Callback to get whether a promotion is active.
 * @param {boolean} isWooCommerceActive Whether WooCommerce is active.
 * @returns {JSX.Element} The premium upsell card.
 */
export const PremiumUpsellList = ( { premiumLink, premiumUpsellConfig = {}, isPromotionActive, isWooCommerceActive } ) => {
	const isBlackFriday = isPromotionActive( "black-friday-promotion" );
	const getBenefits = isWooCommerceActive
		? getWooSeoBenefits
		: getPremiumBenefits;

	const nowIncluding = [
		...( isWooCommerceActive ? [ "Yoast SEO Premium" ] : [] ),
		"Local SEO",
		"News SEO",
		"Video SEO",
		__( "Google Docs add-on (1 seat)", "wordpress-seo" ),
	];

	const badgeClasses = isWooCommerceActive
		? classNames( "yst-bg-woo-light", "yst-text-[#006499]" )
		: classNames( "yst-bg-primary-500", "yst-text-primary-500" );

	let upsellTitle = isWooCommerceActive
		? sprintf(
			/* translators: %s expands to "Yoast WooCommerce SEO" */
			__( "Explore %s now!", "wordpress-seo" ),
			"Yoast WooCommerce SEO"
		)
		: sprintf(
			/* translators: %s expands to "Yoast SEO" Premium */
			__( "Explore %s now!", "wordpress-seo" ),
			"Yoast SEO Premium"
		);

	if ( isBlackFriday ) {
		upsellTitle = __( "Get 30% off now!", "wordpress-seo" );
	}
	return (
		<Paper as="div" className="yst-max-w-4xl">
			{ isBlackFriday && <div
				className="yst-rounded-t-lg yst-h-9 yst-flex yst-justify-between yst-items-center yst-bg-black yst-text-amber-300 yst-px-4 yst-text-lg yst-border-b yst-border-amber-300 yst-border-solid yst-font-medium"
			>
				<div>{ __( "30% OFF", "wordpress-seo" ) }</div>
				<div>{ __( "BLACK FRIDAY", "wordpress-seo" ) }</div>
			</div> }
			<div className="yst-p-6 yst-flex yst-flex-col">
				<div className="yst-flex yst-items-center">
					<>
						<Title as="h2" size="4" className={ `yst-text-xl yst-font-semibold ${ isWooCommerceActive ? "yst-text-woo-light" : "yst-text-primary-500 " }` }>
							{ isWooCommerceActive
								? sprintf(
									/* translators: %s expands to "Yoast WooCommerce SEO */
									__( "Upgrade to %s", "wordpress-seo" ),
									"Yoast WooCommerce SEO"
								)
								: sprintf(
									/* translators: %s expands to "Yoast SEO" Premium */
									__( "Upgrade to %s", "wordpress-seo" ),
									"Yoast SEO Premium"
								) }
						</Title>
						{ isWooCommerceActive
							? <TrolleyIcon className="yst-ml-2 yst-w-4 yst-h-3" />
							: <CrownIcon className="yst-ml-2 yst-w-4 yst-h-3" />
						}
					</>
				</div>
				<div
					className="yst-font-medium yst-text-slate-800 yst-text-xs yst-leading-7 yst-mt-2"
				>
					<span className="yst-mr-2">
						{ __( "Now includes:", "wordpress-seo" ) }
					</span>
					<div className="yst-inline-block">
						{ nowIncluding.map( ( addon, index ) => (
							<Badge
								size="small"
								variant="plain"
								className={ classNames( "yst-mr-2 yst-bg-opacity-15", badgeClasses ) }
								key={ `now-including-${ index }` }
							>
								{ addon }
							</Badge>
						) ) }
					</div>
				</div>
				<ul className="yst-grid yst-grid-cols-1 sm:yst-grid-cols-2 yst-gap-x-6 yst-gap-y-2 yst-list-none yst-list-outside yst-text-slate-600 yst-mt-4">
					{ getBenefits().map( ( benefit, index ) => (
						<li key={ `upsell-benefit-${ index }` } className="yst-flex yst-items-start"><CheckCircleIcon className="yst-mr-2 yst-text-green-500 yst-w-[19.5px] yst-h-[19.5px] yst-flex-shrink-0" />{ benefit }</li>
					) ) }
				</ul>
				<Button
					as="a"
					variant="upsell"
					size="extra-large"
					href={ premiumLink }
					className="yst-gap-2 yst-mt-6 sm:yst-max-w-sm"
					target="_blank"
					rel="noopener"
					{ ...premiumUpsellConfig }
				>
					{ upsellTitle }
					<span className="yst-sr-only">
						{
							/* translators: Hidden accessibility text. */
							__( "(Opens in a new browser tab)", "wordpress-seo" )
						}
					</span>
					<ArrowNarrowRightIcon className="yst-w-4 yst-h-4 yst-icon-rtl" />
				</Button>
			</div>
		</Paper>
	);
};

PremiumUpsellList.propTypes = {
	premiumLink: PropTypes.string.isRequired,
	premiumUpsellConfig: PropTypes.object,
	isPromotionActive: PropTypes.func.isRequired,
	isWooCommerceActive: PropTypes.bool.isRequired,
};
