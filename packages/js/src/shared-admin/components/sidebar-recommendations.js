import { AcademyUpsellCard, PremiumUpsellCard } from "./";

/**
 * @param {Object} props Component props.
 * @param {string} props.premiumLink The link to the Premium page.
 * @param {Object} props.premiumUpsellConfig The Premium upsell configuration.
 * @param {string} props.academyLink The link to the Academy page.
 * @param {Function} props.isPromotionActive Whether a promotion is active.
 * @param {boolean} props.isWooCommerceActive Whether WooCommerce is active.
 *
 * @returns {JSX.Element} The sidebar recommendations.
 */
export const SidebarRecommendations = ( { premiumLink, premiumUpsellConfig, academyLink, isPromotionActive, isWooCommerceActive } ) => {
	return (
		<div className="yst-grid yst-grid-cols-1 sm:yst-grid-cols-2 min-[783px]:yst-grid-cols-1 lg:yst-grid-cols-2 xl:yst-grid-cols-1 yst-gap-4">
			<PremiumUpsellCard
				link={ premiumLink }
				linkProps={ premiumUpsellConfig }
				isPromotionActive={ isPromotionActive }
				isWooCommerceActive={ isWooCommerceActive }
			/>
			<AcademyUpsellCard link={ academyLink } />
		</div>
	);
};
