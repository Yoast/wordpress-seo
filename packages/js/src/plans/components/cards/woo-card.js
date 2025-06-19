import { useSelect } from "@wordpress/data";
import { __, sprintf } from "@wordpress/i18n";
import { safeCreateInterpolateElement } from "../../../helpers/i18n";
import { ADD_ONS, STORE_NAME } from "../../constants";
import { WooSvg } from "../images/woo-svg";
import { BaseCard } from "./base-card";

/**
 * A card to present the Yoast WooCommerce SEO plan.
 * @returns {JSX.Element} The element.
 */
export const WooCard = () => {
	const { isActive, hasLicense, buyLink, buyConfig, manageLink, learnMoreLink } = useSelect( ( select ) => {
		const plansSelect = select( STORE_NAME );
		return {
			isActive: plansSelect.selectAddOnValue( ADD_ONS.woo, "isActive" ),
			hasLicense: plansSelect.selectAddOnValue( ADD_ONS.woo, "hasLicense" ),
			buyLink: plansSelect.selectLink( "http://yoa.st/plans-woocommerce-buy" ),
			buyConfig: plansSelect.selectAddOnUpsellConfigAsProps( ADD_ONS.woo ),
			manageLink: plansSelect.selectLink( "http://yoa.st/plans-woocommerce-manage" ),
			learnMoreLink: plansSelect.selectLink( "http://yoa.st/plans-woocommerce-learn-more" ),
		};
	}, [] );

	return (
		<BaseCard
			hasHighlight={ isActive || hasLicense }
			isActiveHighlight={ hasLicense }
			isManageAvailable={ hasLicense }
			header={ <WooSvg /> }
			title="Yoast WooCommerce SEO"
			description={ sprintf(
				/* translators: %s expands to "Yoast SEO Premium". */
				__( "Built for WooCommerce stores, this bundle helps your products stand out in Google with rich results and smart SEO, plus %s to save time and boost visibility.", "wordpress-seo" ),
				"Yoast SEO Premium"
			) }
			listDescription={ safeCreateInterpolateElement(
				sprintf(
					/* translators: %1$s and %2$s expand to an opening and closing anchor tag. */
					__( "Includes all %1$sPremium%2$s features, plus:", "wordpress-seo" ),
					"<strong>",
					"</strong>"
				),
				{ strong: <strong /> }
			) }
			list={ [
				__( "Increase organic visibility for your products", "wordpress-seo" ),
				__( "Generate standout product titles and descriptions", "wordpress-seo" ),
				__( "Get tailored SEO analysis for your product pages", "wordpress-seo" ),
			] }
			buyLink={ buyLink }
			buyConfig={ buyConfig }
			manageLink={ manageLink }
			learnMoreLink={ learnMoreLink }
			includes="Local SEO + Video SEO + News SEO"
		/>
	);
};
