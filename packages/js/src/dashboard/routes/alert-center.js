import { useSelect } from "@wordpress/data";
import { __ } from "@wordpress/i18n";
import { Paper, Title } from "@yoast/ui-library";
import { PremiumUpsellList } from "../../shared-admin/components/premium-upsell-list";
import SidebarRecommendations from "../../shared-admin/components/sidebar-recommendations";
import { Notifications, Problems } from "../components";
import { useSelectDashboard } from "../hooks";
import { STORE_NAME } from ".././constants";

/**
 * @returns {JSX.Element} The dashboard content placeholder.
 */
export const AlertCenter = () => {
	const isPremium = useSelectDashboard( "selectPreference", [], "isPremium" );
	const premiumLinkList = useSelectDashboard( "selectLink", [], "https://yoa.st/17h" );
	const premiumLinkSidebar = useSelectDashboard( "selectLink", [], "https://yoa.st/jj" );
	const premiumUpsellConfig = useSelectDashboard( "selectUpsellSettingsAsProps" );
	const academyLink = useSelectDashboard( "selectLink", [], "https://yoa.st/3t6" );
	const { isPromotionActive } = useSelect( STORE_NAME );

	return <div className="yst-flex yst-gap-8 xl:yst-flex-row yst-flex-col">
		 { /* Alert center */ }
		<div className="yst-flex yst-flex-wrap yst-flex-grow xl:yst-flex-row yst-flex-col">
			<Paper className="yst-grow">
				<header className="yst-p-8">
					<div className="yst-max-w-screen-sm">
						<Title>{ __( "Alert center", "wordpress-seo" ) }</Title>
						<p className="yst-text-tiny yst-mt-3">
							{ __( "Monitor and manage potential SEO problems affecting your site and stay informed with important notifications and updates.", "wordpress-seo" ) }
						</p>
					</div>
				</header>
			</Paper>
			<div className="yst-basis-full">
				<div className="yst-grid lg:yst-grid-cols-2 yst-gap-8 yst-my-8 yst-grow yst-items-start">
					<Problems />
					<Notifications />
				</div>
				{ ! isPremium && <PremiumUpsellList
					premiumLink={ premiumLinkList }
					premiumUpsellConfig={ premiumUpsellConfig }
					isPromotionActive={ isPromotionActive }
				/> }
			</div>
		</div>
		{ ! isPremium &&
			<div className="yst-min-w-[16rem] xl:yst-max-w-[16rem]">
				<div className="yst-sticky yst-top-16">
					<SidebarRecommendations
						premiumLink={ premiumLinkSidebar }
						premiumUpsellConfig={ premiumUpsellConfig }
						academyLink={ academyLink }
						isPromotionActive={ isPromotionActive }
					/>
				</div>
			</div>
		}
	</div>;
};
