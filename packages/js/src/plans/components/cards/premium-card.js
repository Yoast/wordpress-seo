import { useSelect } from "@wordpress/data";
import { __, sprintf } from "@wordpress/i18n";
import { safeCreateInterpolateElement } from "../../../helpers/i18n";
import { ADD_ONS, STORE_NAME } from "../../constants";
import { PremiumSvg } from "../images/premium-svg";
import { BaseCard } from "./base-card";

/**
 * A card to present the Yoast SEO Premium plan.
 * @returns {JSX.Element} The element.
 */
export const PremiumCard = () => {
	const { isActive, hasLicense, isWooActive, buyLink, buyConfig, manageLink, learnMoreLink } = useSelect( ( select ) => {
		const plansSelect = select( STORE_NAME );
		return {
			isActive: plansSelect.selectAddOnIsActive( ADD_ONS.premium ),
			hasLicense: plansSelect.selectAddOnHasLicense( ADD_ONS.premium ),
			isWooActive: plansSelect.selectAddOnIsActive( ADD_ONS.woo ),
			buyLink: plansSelect.selectLink( "http://yoa.st/plans-premium-buy" ),
			buyConfig: plansSelect.selectAddOnClickToBuyAsProps( ADD_ONS.premium ),
			manageLink: plansSelect.selectLink( "http://yoa.st/plans-premium-manage" ),
			learnMoreLink: plansSelect.selectLink( "http://yoa.st/plans-premium-learn-more" ),
		};
	}, [] );

	return (
		<BaseCard
			// WooCommerce SEO take priority over Premium as it includes Premium.
			hasHighlight={ isActive && ! isWooActive }
			isActiveHighlight={ hasLicense }
			isManageAvailable={ hasLicense }
			header={ <PremiumSvg /> }
			title="Yoast SEO Premium"
			description={ sprintf(
				/* translators: %s expands to "Yoast SEO Premium". */
				__( "%s gives entrepreneurs and in-house teams real-time SEO guidance, so content meets best practices and drives visibility, no expert knowledge needed.", "wordpress-seo" ),
				"Yoast SEO Premium"
			) }
			listDescription={ safeCreateInterpolateElement(
				sprintf(
					/* translators: %1$s and %2$s expand to an opening and closing anchor tag. */
					__( "Includes all %1$sFree%2$s features, plus:", "wordpress-seo" ),
					"<strong>",
					"</strong>"
				),
				{ strong: <strong /> }
			) }
			list={ [
				__( "AI-enhanced optimization, built right in at no extra cost", "wordpress-seo" ),
				__( "Smarter content tools; internal linking suggestions and redirect automation", "wordpress-seo" ),
				__( "Advanced tools to scale your SEO workflow", "wordpress-seo" ),
			] }
			buyLink={ buyLink }
			buyConfig={ buyConfig }
			manageLink={ manageLink }
			learnMoreLink={ learnMoreLink }
			includes="Local SEO + Video SEO + News SEO"
		/>
	);
};
