import { useSelect } from "@wordpress/data";
import { __ } from "@wordpress/i18n";
import { ADD_ONS, STORE_NAME } from "../../constants";
import { BaseCard } from "./base-card";
import { GoogleDocsAddonSvg } from "../images/google-docs-addon-svg";
import { InstallAddon } from "../actions/install-addon";

/**
 * A card to present the Yoast SEO Google Docs Add-on plan.
 * @returns {JSX.Element} The element.
 */
export const GoogleDocsAddonCard = () => {
	const {
		isPremiumActive,
		installAddonLink,
		buyPremiumLink,
		buyPremiumConfig,
		learnMoreLink,
		isBlackFridayPromotionActive,
	} = useSelect( ( select ) => {
		const plansSelect = select( STORE_NAME );
		return {
			isPremiumActive: plansSelect.selectAddOnIsActive( ADD_ONS.premium ),
			installAddonLink: plansSelect.selectLink( "https://yoa.st/plans-google-docs-add-on-install" ),
			buyPremiumLink: plansSelect.selectLink( "https://yoa.st/plans-premium-buy" ),
			buyPremiumConfig: plansSelect.selectAddOnClickToBuyAsProps( ADD_ONS.premium ),
			learnMoreLink: plansSelect.selectLink( "https://yoa.st/plans-google-docs-add-on-learn-more" ),
			isBlackFridayPromotionActive: plansSelect.isPromotionActive( "black-friday-promotion" ),
		};
	}, [] );

	return (
		<BaseCard
			hasHighlight={ false }
			isActiveHighlight={ false }
			isManageAvailable={ false }
			header={ <GoogleDocsAddonSvg /> }
			title="Yoast SEO Google Docs Add-on"
			description={ __( "Write and optimize your content directly in Google Docs.", "wordpress-seo" ) }
			list={ [
				__( "Get instant SEO and readability analysis while you write", "wordpress-seo" ),
				__( "Collaborate with your team and create consistent SEO-ready drafts faster", "wordpress-seo" ),
				__( "One free seat available with all Yoast subscriptions", "wordpress-seo" ),
			] }
			button={ isPremiumActive && <InstallAddon href={ installAddonLink } /> }
			buyLink={ buyPremiumLink }
			buyConfig={ buyPremiumConfig }
			learnMoreLink={ learnMoreLink }
			learnMoreContent={ ! isPremiumActive && (
				<div className="yst-font-medium yst-italic yst-text-center yst-pt-3">
					{ __( "Included in Premium", "wordpress-seo" ) }
				</div>
			) }
			isBlackFridayPromotionActive={ isBlackFridayPromotionActive }
		/>
	);
};
