import { useSelect } from "@wordpress/data";
import classNames from "classnames";
import { useSelectSettings } from "../../settings/hooks";
import { SidebarRecommendations } from "../../shared-admin/components";
import { STORE_NAME } from "../constants";
import { useSelectGeneralPage } from "../hooks";

/**
 * @param {string} [contentClassName=""] Extra class name for the children container.
 * @param {JSX.node} children The children.
 * @returns {JSX.Element} The element.
 */
export const SidebarLayout = ( { contentClassName = "", children } ) => {
	const isPremium = useSelectGeneralPage( "selectPreference", [], "isPremium" );
	const premiumLinkSidebar = useSelectGeneralPage( "selectLink", [], "https://yoa.st/jj" );
	const wooLinkSidebar = useSelectGeneralPage( "selectLink", [], "https://yoa.st/admin-sidebar-upsell-woocommerce" );
	const premiumUpsellConfig = useSelectGeneralPage( "selectUpsellSettingsAsProps" );
	const academyLink = useSelectGeneralPage( "selectLink", [], "https://yoa.st/3t6" );
	const { isPromotionActive } = useSelect( STORE_NAME );
	const isWooCommerceActive = useSelectGeneralPage( "selectPreference", [], "isWooCommerceActive" );

	return (
		<div className="yst-flex yst-gap-6 xl:yst-flex-row yst-flex-col">
			<div className={ classNames( "yst-@container yst-flex yst-flex-grow yst-flex-col", contentClassName ) }>
				{ children }
			</div>
			{ ! isPremium &&
				<div className="yst-min-w-[16rem] xl:yst-max-w-[16rem]">
					<div className="yst-sticky yst-top-16">
						<SidebarRecommendations
							premiumLink={ isWooCommerceActive ? wooLinkSidebar : premiumLinkSidebar }
							premiumUpsellConfig={ premiumUpsellConfig }
							academyLink={ academyLink }
							isPromotionActive={ isPromotionActive }
							isWooCommerceActive={ isWooCommerceActive }
						/>
					</div>
				</div>
			}
		</div>
	);
};
