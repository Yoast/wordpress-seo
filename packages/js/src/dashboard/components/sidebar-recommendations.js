import { AcademyUpsellCard, PremiumUpsellCard, RecommendationsSidebar } from "../../shared-admin/components";
import { useSelectDashboard } from "../hooks";
/**
 * @returns {JSX.Element} The sidebar recommendations.
 */
const SidebarRecommendations = () => {
	const isPremium = useSelectDashboard( "selectPreference", [], "isPremium" );
	const promotions = useSelectDashboard( "selectPreference", [], "promotions", [] );
	const premiumLink = useSelectDashboard( "selectLink", [], "https://yoa.st/jj" );
	const premiumUpsellConfig = useSelectDashboard( "selectUpsellSettingsAsProps" );
	const academyLink = useSelectDashboard( "selectLink", [], "https://yoa.st/3t6" );
	if ( isPremium ) {
		return null;
	}

	return (
		<RecommendationsSidebar>
			<PremiumUpsellCard link={ premiumLink } linkProps={ premiumUpsellConfig } promotions={ promotions } />
			<AcademyUpsellCard link={ academyLink } />
		</RecommendationsSidebar>
	);
};

export default SidebarRecommendations;
