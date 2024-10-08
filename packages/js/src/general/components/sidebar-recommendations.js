import { AcademyUpsellCard, PremiumUpsellCard } from "../../shared-admin/components";
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
		<div className="yst-min-w-[16rem] xl:yst-max-w-[16rem]">
			<div className="yst-sticky yst-top-16">
				<div className="yst-grid yst-grid-cols-1 sm:yst-grid-cols-2 min-[783px]:yst-grid-cols-1 lg:yst-grid-cols-2 xl:yst-grid-cols-1 yst-gap-4">
					<PremiumUpsellCard link={ premiumLink } linkProps={ premiumUpsellConfig } promotions={ promotions } />
					<AcademyUpsellCard link={ academyLink } />
				</div>
			</div>
		</div>
	);
};

export default SidebarRecommendations;
