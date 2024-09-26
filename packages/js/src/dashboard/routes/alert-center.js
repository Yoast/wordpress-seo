import { __ } from "@wordpress/i18n";
import { Paper, Title } from "@yoast/ui-library";
import { PremiumUpsellList } from "../../shared-admin/components/premium-upsell-list";
import { Notifications, Problems } from "../components";
import SidebarRecommendations from "../components/sidebar-recommendations";
import { useSelectDashboard } from "../hooks";
import classNames from "classnames";
/**
 * @returns {JSX.Element} The dashboard content placeholder.
 */
export const AlertCenter = () => {
	const isPremium = useSelectDashboard( "selectPreference", [], "isPremium" );
	const premiumLink = useSelectDashboard( "selectLink", [], "https://yoa.st/17h" );
	const premiumUpsellConfig = useSelectDashboard( "selectUpsellSettingsAsProps" );
	const promotions = useSelectDashboard( "selectPreference", [], "promotions", [] );
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
			<div>
				<div className="yst-grid lg:yst-grid-cols-2 yst-gap-8 yst-my-8 yst-grow">
					<Problems />
					<Notifications />
				</div>
				{ ! isPremium && <PremiumUpsellList
					premiumLink={ premiumLink }
					premiumUpsellConfig={ premiumUpsellConfig }
					promotions={ promotions }
				/> }
			</div>
			<SidebarRecommendations />
		</div>
	</>;
};
