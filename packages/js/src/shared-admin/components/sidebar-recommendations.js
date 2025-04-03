import PropTypes from "prop-types";
import { AcademyUpsellCard, PremiumUpsellCard } from "./";

/**
 * @param {string} premiumLink The link to the Premium page.
 * @param {Object} premiumUpsellConfig The Premium upsell configuration.
 * @param {string} academyLink The link to the Academy page.
 * @param {function} isPromotionActive Whether a promotion is active.
 *
 * @returns {JSX.Element} The sidebar recommendations.
 */
export const SidebarRecommendations = ( { premiumLink, premiumUpsellConfig, academyLink, isPromotionActive } ) => {
	return (
		<div className="yst-grid yst-grid-cols-1 sm:yst-grid-cols-2 min-[783px]:yst-grid-cols-1 lg:yst-grid-cols-2 xl:yst-grid-cols-1 yst-gap-4">
			<PremiumUpsellCard link={ premiumLink } linkProps={ premiumUpsellConfig } isPromotionActive={ isPromotionActive } />
			<AcademyUpsellCard link={ academyLink } />
		</div>
	);
};

SidebarRecommendations.propTypes = {
	premiumLink: PropTypes.string.isRequired,
	premiumUpsellConfig: PropTypes.object.isRequired,
	academyLink: PropTypes.string.isRequired,
	isPromotionActive: PropTypes.func.isRequired,
};
