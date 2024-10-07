import { select } from "@wordpress/data";
import { __ } from "@wordpress/i18n";
import { Paper, Title } from "@yoast/ui-library";
import { PremiumUpsellList } from "../../shared-admin/components/premium-upsell-list";
import SidebarRecommendations from "../../shared-admin/components/sidebar-recommendations";
import { Notifications, Problems } from "../components";
import { useSelectDashboard } from "../hooks";
import classNames from "classnames";
import { STORE_NAME } from ".././constants";

/**
 * Uses the store's selector to get whether a promotion is active.
 *
 * @returns {bool} Whether the promotion is active.
 */
const isPromotionActive = ( promotionID ) => {
	return select( STORE_NAME ).isPromotionActive( promotionID )
};

/**
 * @returns {JSX.Element} The dashboard content placeholder.
 */
export const AlertCenter = () => {
	const isPremium = useSelectDashboard( "selectPreference", [], "isPremium" );
	const premiumLinkList = useSelectDashboard( "selectLink", [], "https://yoa.st/17h" );
	const premiumLinkSidebar = useSelectDashboard( "selectLink", [], "https://yoa.st/jj" );
	const premiumUpsellConfig = useSelectDashboard( "selectUpsellSettingsAsProps" );
	const academyLink = useSelectDashboard( "selectLink", [], "https://yoa.st/3t6" );

	return <>
		<div className={ classNames( {  "yst-flex yst-flex-wrap xl:yst-pr-[17.5rem]": ! isPremium } ) }>
			<Paper className="yst-grow">
				<header className="yst-p-8 yst-border-b yst-border-slate-200">
					<div className="yst-max-w-screen-sm">
						<Title>{ __( "Alert center", "wordpress-seo" ) }</Title>
						<p className="yst-text-tiny yst-mt-3">
							{ __( "Monitor and manage potential SEO problems affecting your site and stay informed with important notifications and updates.", "wordpress-seo" ) }
						</p>
					</div>
				</header>
			</Paper>
			<div className="yst-grid lg:yst-grid-cols-2 yst-gap-8 yst-my-8 yst-grow">
				<Problems />
				<Notifications />
				{ ! isPremium && <PremiumUpsellList
					premiumLink={ premiumLinkList }
					premiumUpsellConfig={ premiumUpsellConfig }
					isPromotionActive={ isPromotionActive }
				/> }
			</div>
			<SidebarRecommendations
				isPremium={ isPremium }
				premiumLink={ premiumLinkSidebar }
				premiumUpsellConfig={ premiumUpsellConfig }
				academyLink={ academyLink }
				isPromotionActive={ isPromotionActive }
			/>
		</div>
	</>;
};
