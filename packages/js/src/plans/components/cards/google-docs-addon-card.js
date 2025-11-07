import { useSelect } from "@wordpress/data";
import { __ } from "@wordpress/i18n";
import { ADD_ONS, STORE_NAME } from "../../constants";
import { BaseCard } from "./base-card";
import { GoogleDocsAddonSvg } from "../images/google-docs-addon-svg";

/**
 * A card to present the Yoast SEO Google Docs Add-on plan.
 * @returns {JSX.Element} The element.
 */
export const GoogleDocsAddonCard = () => {
	const {
		isActive,
		hasLicense,
		isWooActive,
		buyLink,
		buyConfig,
		manageLink,
		learnMoreLink,
		isBlackFridayPromotionActive,
	} = useSelect( ( select ) => {
		const plansSelect = select( STORE_NAME );
		return {
			isActive: plansSelect.selectAddOnIsActive( ADD_ONS.premium ),
			hasLicense: plansSelect.selectAddOnHasLicense( ADD_ONS.premium ),
			isWooActive: plansSelect.selectAddOnIsActive( ADD_ONS.woo ),
			buyLink: plansSelect.selectLink( "http://yoa.st/plans-premium-buy" ),
			buyConfig: plansSelect.selectAddOnClickToBuyAsProps( ADD_ONS.premium ),
			manageLink: plansSelect.selectLink( "http://yoa.st/plans-premium-manage" ),
			learnMoreLink: plansSelect.selectLink( "http://yoa.st/plans-premium-learn-more" ),
			isBlackFridayPromotionActive: plansSelect.isPromotionActive( "black-friday-promotion" ),
		};
	}, [] );

	return (
		<BaseCard
			// WooCommerce SEO take priority over Premium as it includes Premium.
			hasHighlight={ isActive && ! isWooActive }
			isActiveHighlight={ hasLicense }
			isManageAvailable={ hasLicense }
			header={ <GoogleDocsAddonSvg /> }
			title="Yoast SEO Google Docs Add-on"
			description={ __( "Write and optimize your content directly in Google Docs.", "wordpress-seo" ) }
			list={ [
				__( "Get instant SEO and readability analysis while you write", "wordpress-seo" ),
				__( "Collaborate with your team and create consistent SEO-ready drafts faster", "wordpress-seo" ),
				__( "One free seat available with all Yoast subscriptions", "wordpress-seo" ),
			] }
			buyLink={ buyLink }
			buyConfig={ buyConfig }
			manageLink={ manageLink }
			learnMoreLink={ learnMoreLink }
			isBlackFridayPromotionActive={ isBlackFridayPromotionActive }
		/>
	);
};
