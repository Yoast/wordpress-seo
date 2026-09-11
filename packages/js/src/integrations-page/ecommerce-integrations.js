import { __, sprintf } from "@wordpress/i18n";
import { ReactComponent as EDDLogo } from "../../images/edd-logo.svg";
import { ReactComponent as WoocommerceSeoLogo } from "../../images/woo-yoast-logo.svg";
import { safeCreateInterpolateElement } from "../helpers/i18n";
import { getInitialState } from "./helper";
import { PluginIntegration } from "./plugin-integration";
import { WoocommerceIntegration } from "./woocommerce-integration";

const integrations = {
	woocommerce: {
		name: "WooCommerce",
		claim: safeCreateInterpolateElement(
			sprintf(
				/* translators: 1: bold open tag; 2: WooCommerce; 3: bold close tag. */
				__( "Upgrade your %1$s%2$s%3$s SEO", "wordpress-seo" ),
				"<strong>",
				"WooCommerce",
				"</strong>"
			), {
				strong: <strong />,
			}
		),
		learnMoreLink: "https://yoa.st/integrations-about-woocommerce",
		logoLink: "https://yoa.st/integrations-logo-woocommerce",
		slug: "woocommerce",
		description: __( "Improve your technical SEO and meta tags, unlock more SEO ecommerce tools, and get rich product results in Google search.", "wordpress-seo" ),
		isPremium: false,
		isNew: false,
		isMultisiteAvailable: true,
		logo: WoocommerceSeoLogo,
		upsellLink: "https://yoa.st/integrations-get-woocommerce",
	},
	edd: {
		name: "Easy Digital Downloads",
		claim: safeCreateInterpolateElement(
			sprintf(
				/* translators: 1: bold open tag; 2: bold close tag. */
				__( "Get %1$srich results for your digital products%2$s in Google search", "wordpress-seo" ),
				"<strong>",
				"</strong>"
			), {
				strong: <strong />,
			}
		),
		learnMoreLink: "https://yoa.st/integrations-about-edd",
		logoLink: "https://yoa.st/integrations-logo-edd",
		upsellLink: "https://yoa.st/get-edd-integration",
		slug: "edd",
		description: sprintf(
			/* translators: 1: Easy Digital Downloads, 2: Yoast SEO */
			__( "%2$s integrates %1$s' Schema output into its own to get rich snippets for your digital products!", "wordpress-seo" ),
			"Easy Digital Downloads",
			"Yoast SEO"
		),
		isPremium: true,
		isNew: false,
		isMultisiteAvailable: true,
		logo: EDDLogo,
	},
};

/* eslint-disable dot-notation */
export const ecommerceIntegrations = [
	<WoocommerceIntegration
		key="woocommerce"
		integration={ integrations.woocommerce }
		isActive={ Boolean( window.wpseoIntegrationsData[ "woocommerce_seo_active" ] ) }
		isInstalled={ Boolean( window.wpseoIntegrationsData[ "woocommerce_seo_installed" ] ) }
		isPrerequisiteActive={ Boolean( window.wpseoIntegrationsData[ "woocommerce_active" ] ) }
		upsellLink={ window.wpseoIntegrationsData[ "woocommerce_seo_upsell_url" ] }
		activationLink={ window.wpseoIntegrationsData[ "woocommerce_seo_activate_url" ] }
		isSchemaAPIIntegration={ true }
	/>,

	<PluginIntegration
		key="edd"
		integration={ integrations.edd }
		isActive={ getInitialState( integrations.edd ) }
		isSchemaAPIIntegration={ true }
	/>,
];
/* eslint-enable dot-notation */
