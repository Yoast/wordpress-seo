import { select } from "@wordpress/data";
import { AcademyUpsellCard, PremiumUpsellCard, RecommendationsSidebar } from "../../shared-admin/components";
import { useSelectSettings } from "../hooks";
import { STORE_NAME } from ".././constants";

/**
 * @returns {JSX.Element} The sidebar recommendations.
 */
const SidebarRecommendations = () => {
	const isPremium = useSelectSettings( "selectPreference", [], "isPremium" );
	const premiumLink = useSelectSettings( "selectLink", [], "https://yoa.st/jj" );
	const premiumUpsellConfig = useSelectSettings( "selectUpsellSettingsAsProps" );
	const academyLink = useSelectSettings( "selectLink", [], "https://yoa.st/3t6" );

	const isBlackFriday = select( STORE_NAME ).isPromotionActive( "black-friday-2024-promotion" );

	if ( isPremium ) {
		return null;
	}

	return (
		<RecommendationsSidebar>
			<PremiumUpsellCard link={ premiumLink } linkProps={ premiumUpsellConfig } isBlackFriday={ isBlackFriday } />
			<AcademyUpsellCard link={ academyLink } />
		</RecommendationsSidebar>
	);
};

export default SidebarRecommendations;
