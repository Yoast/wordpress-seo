import { useSelect } from "@wordpress/data";
import { useSelectSettings } from "../../settings/hooks";
import { PremiumUpsellList } from "../../shared-admin/components";
import { STORE_NAME } from "../constants";
import { useSelectGeneralPage } from "../hooks";

/**
 * @returns {JSX.Element|null} The premium upsell list or null if not applicable.
 */
export const ConnectedPremiumUpsellList = () => {
	const isPremium = useSelectGeneralPage( "selectPreference", [], "isPremium" );
	const premiumUpsellConfig = useSelectGeneralPage( "selectUpsellSettingsAsProps" );
	const { isPromotionActive } = useSelect( STORE_NAME );
	const premiumLinkList = useSelectGeneralPage( "selectLink", [], "https://yoa.st/17h" );
	const wooLinkList = useSelectGeneralPage( "selectLink", [], "https://yoa.st/admin-footer-upsell-woocommerce" );
	const isWooCommerceActive = useSelectGeneralPage( "selectPreference", [], "isWooCommerceActive" );
	if ( isPremium ) {
		return null;
	}
	return <PremiumUpsellList
		premiumLink={ isWooCommerceActive ? wooLinkList : premiumLinkList }
		premiumUpsellConfig={ premiumUpsellConfig }
		isPromotionActive={ isPromotionActive }
		isWooCommerceActive={ isWooCommerceActive }
	/>;
};

