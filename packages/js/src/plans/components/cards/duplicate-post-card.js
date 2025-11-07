import { useSelect } from "@wordpress/data";
import { __ } from "@wordpress/i18n";
import { ADD_ONS, STORE_NAME } from "../../constants";
import { BaseCard } from "./base-card";
import { DuplicatePostSvg } from "../images/duplicate-post-svg";
import { InstallPlugin } from "../actions/install-plugin";

/**
 * A card to present the Yoast SEO Duplicate Post plan.
 * @returns {JSX.Element} The element.
 */
export const DuplicatePostCard = () => {
	const {
		isActive,
		manageLink,
		learnMoreLink,
		isBlackFridayPromotionActive,
		pluginsLink,
	} = useSelect( ( select ) => {
		const plansSelect = select( STORE_NAME );

		return {
			isActive: plansSelect.selectAddOnIsActive( ADD_ONS.duplicatePost ),
			manageLink: plansSelect.selectLink( "http://yoa.st/plans-premium-manage" ),
			learnMoreLink: plansSelect.selectLink( "http://yoa.st/plans-duplicate-post-learn-more" ),
			isBlackFridayPromotionActive: plansSelect.isPromotionActive( "black-friday-promotion" ),
			pluginsLink: plansSelect.selectPluginsUrl(),
		};
	}, [] );

	return (
		<BaseCard
			hasHighlight={ isActive }
			isActiveHighlight={ isActive }
			isManageAvailable={ false }
			isLicenseRequired={ false }
			header={ <DuplicatePostSvg /> }
			title="Yoast Duplicate Post"
			description={ __( "Easily copy posts and pages in one click to save time when reusing or updating content.", "wordpress-seo" ) }
			list={ [
				__( "Duplicate any post or page instantly", "wordpress-seo" ),
				__( "Perfect for creating templates or testing updates", "wordpress-seo" ),
				__( "Trusted by over 4+ million WordPress sites", "wordpress-seo" ),
			] }
			button={ <InstallPlugin href={ pluginsLink } disabled={ isActive } /> }
			manageLink={ manageLink }
			learnMoreLink={ learnMoreLink }
			isBlackFridayPromotionActive={ isBlackFridayPromotionActive }
		/>
	);
};
