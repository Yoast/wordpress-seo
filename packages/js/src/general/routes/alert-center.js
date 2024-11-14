import { useSelect } from "@wordpress/data";
import { __ } from "@wordpress/i18n";
import { Paper, Title } from "@yoast/ui-library";
import { PremiumUpsellList } from "../../shared-admin/components";
import { Notifications, Problems } from "../components";
import { STORE_NAME } from "../constants";
import { useSelectGeneralPage } from "../hooks";

/**
 * @returns {JSX.Element} The general page content placeholder.
 */
export const AlertCenter = () => {
	const isPremium = useSelectGeneralPage( "selectPreference", [], "isPremium" );
	const premiumLinkList = useSelectGeneralPage( "selectLink", [], "https://yoa.st/17h" );
	const premiumUpsellConfig = useSelectGeneralPage( "selectUpsellSettingsAsProps" );
	const { isPromotionActive } = useSelect( STORE_NAME );

	return (
		<>
			<Paper className="yst-p-8 yst-grow">
				<header className="yst-max-w-screen-sm">
					<Title>{ __( "Alert center", "wordpress-seo" ) }</Title>
					<p className="yst-text-tiny yst-mt-3">
						{ __( "Monitor and manage potential SEO problems affecting your site and stay informed with important notifications and updates.", "wordpress-seo" ) }
					</p>
				</header>
			</Paper>
			<div className="yst-grid yst-grid-cols-1 @3xl:yst-grid-cols-2 yst-gap-6 yst-my-6 yst-grow yst-items-start">
				<Problems />
				<Notifications />
			</div>
			{ isPremium ? null : (
				<PremiumUpsellList
					premiumLink={ premiumLinkList }
					premiumUpsellConfig={ premiumUpsellConfig }
					isPromotionActive={ isPromotionActive }
				/>
			) }
		</>
	);
};
