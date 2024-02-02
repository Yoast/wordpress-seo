import { AcademyUpsellCard, PremiumUpsellCard, RecommendationsSidebar } from "../../shared-admin/components";
import { useSelectSettings } from "../hooks";

/**
 * @returns {JSX.Element} The sidebar recommendations.
 */
const SidebarRecommendations = () => {
	const isPremium = useSelectSettings( "selectPreference", [], "isPremium" );
	const promotions = useSelectSettings( "selectPreference", [], "promotions", [] );
	const premiumLink = useSelectSettings( "selectLink", [], "https://yoa.st/jj" );
	const premiumUpsellConfig = useSelectSettings( "selectUpsellSettingsAsProps" );
	const academyLink = useSelectSettings( "selectLink", [], "https://yoa.st/3t6" );

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
