import { ArrowNarrowRightIcon } from "@heroicons/react/outline";
import { createInterpolateElement, useMemo } from "@wordpress/element";
import { __, sprintf } from "@wordpress/i18n";
import { Button, Title, Paper } from "@yoast/ui-library";
import PropTypes from "prop-types";
import { getPremiumBenefits } from "../../helpers/get-premium-benefits";

/**
 * @param {string} premiumLink The premium link.
 * @param {Object} [premiumUpsellConfig] The premium upsell configuration data.
 * @param {array} [promotions] Promotions.
 * @returns {JSX.Element} The premium upsell card.
 */
export const PremiumUpsellList = ( { premiumLink, premiumUpsellConfig, promotions } ) => {
	const isBlackFriday = promotions.includes( "black-friday-2024-promotion" );
	return (
		<Paper as="div" className="xl:yst-max-w-3xl">
			{ isBlackFriday && <div className="yst-rounded-t-lg yst-h-9 yst-flex yst-items-center yst-bg-black yst-text-amber-300 yst-px-4 yst-text-lg yst-border-b yst-border-amber-300 yst-border-solid yst-font-semibold">
				<div>{ __( "30% OFF | Code: BF2024", "wordpress-seo" ) }</div>
			</div> }
			<div className="yst-p-6 yst-flex yst-flex-col">
				<Title as="h2" size="4" className="yst-text-xl yst-text-primary-500">
					{ sprintf(
						/* translators: %s expands to "Yoast SEO" Premium */
						__( "Upgrade to %s", "wordpress-seo" ),
						"Yoast SEO Premium"
					) }
				</Title>
				<ul className="yst-grid yst-grid-cols-1 sm:yst-grid-cols-2 yst-gap-x-6 yst-list-disc yst-pl-[1em] yst-list-outside yst-text-slate-800 yst-mt-6">
					{ getPremiumBenefits().map( ( benefit, index ) => (
						<li key={ `upsell-benefit-${ index }` }>
							{ createInterpolateElement( benefit, { strong: <span className="yst-font-semibold" /> } ) }
						</li>
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
					{ isBlackFriday ? __( "Claim your 30% off now!", "wordpress-seo" ) : sprintf(
						/* translators: %s expands to "Yoast SEO" Premium */
						__( "Explore %s now!", "wordpress-seo" ),
						"Yoast SEO Premium"
					) }
					<ArrowNarrowRightIcon className="yst-w-4 yst-h-4 yst-icon-rtl" />
				</Button>
			</div>
		</Paper>
	);
};

PremiumUpsellList.propTypes = {
	premiumLink: PropTypes.string.isRequired,
	premiumUpsellConfig: PropTypes.object,
	promotions: PropTypes.array,
};

PremiumUpsellList.defaultProps = {
	premiumUpsellConfig: {},
	promotions: [],
};
