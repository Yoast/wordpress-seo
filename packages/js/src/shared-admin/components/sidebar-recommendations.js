import PropTypes from "prop-types";
import { AcademyUpsellCard, PremiumUpsellCard, RecommendationsSidebar } from "./";

/**
 * @param {bool} isPremium Whether Premium is enabled.
 * @param {string} premiumLink The link to the Premium page.
 * @param {Object} premiumUpsellConfig The Premium upsell configuration.
 * @param {string} academyLink The link to the Academy page.
 * @param {function} isPromotionActive Whether a promotion is active.
 *
 * @returns {JSX.Element} The sidebar recommendations.
 */
const SidebarRecommendations = ( { isPremium, premiumLink, premiumUpsellConfig, academyLink, isPromotionActive } ) => {
	if ( isPremium ) {
		return null;
	}

	return (
		<RecommendationsSidebar>
			<PremiumUpsellCard link={ premiumLink } linkProps={ premiumUpsellConfig } isPromotionActive={ isPromotionActive } />
			<AcademyUpsellCard link={ academyLink } />
		</RecommendationsSidebar>
	);
};

SidebarRecommendations.propTypes = {
	isPremium: PropTypes.bool.isRequired,
	premiumLink: PropTypes.string.isRequired,
	premiumUpsellConfig: PropTypes.object.isRequired,
	academyLink: PropTypes.string.isRequired,
	isPromotionActive: PropTypes.func.isRequired,
};

export default SidebarRecommendations;
