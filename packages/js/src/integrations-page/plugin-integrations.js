import { __, sprintf } from "@wordpress/i18n";

import { getInitialState, getIsNetworkControlEnabled, updateIntegrationState, getIsMultisiteAvailable } from "./helper";

import { ReactComponent as AlgoliaLogo } from "../../images/algolia-logo.svg";
import { ReactComponent as ElementorLogo } from "../../images/elementor-logo.svg";
import { ReactComponent as JetpackLogo } from "../../images/jetpack-logo.svg";
import { ReactComponent as WoocommerceLogo } from "../../images/woocommerce-logo.svg";
import { WoocommerceIntegration } from "./woocommerce-integration";
import { AcfIntegration } from "./acf-integration";
import { PluginIntegration } from "./plugin-integration";
import { AlgoliaIntegration } from "./algolia-integration";

const integrations = {
	elementor: {
		name: "Elementor",
		claim: sprintf(
			/* translators: 1: Yoast SEO, 2: Elementor */
			__( "Get %1$s tools and functionality in %2$s", "wordpress-seo" ),
			"Yoast SEO",
			"Elementor"
		),
		learnMoreLink: "https://yoa.st/integrations-about-elementor",
		logoLink: "https://yoa.st/integrations-about-elementor",
		slug: "elementor",
		description: __( "Take advantage of your favorite SEO & content analysis tools with your favorite page builder.", "wordpress-seo" ),
		isPremium: false,
		isNew: false,
		isMultisiteAvailable: true,
		logo: ElementorLogo,
	},
	jetpack: {
		name: "Jetpack",
		claim: sprintf(
			/* translators: 1: Jetpack, 2: Yoast */
			__( "Get the most out of %1$s and %2$s, together", "wordpress-seo" ),
			"Jetpack",
			"Yoast"
		),
		learnMoreLink: "https://yoa.st/integrations-about-jetpack",
		logoLink: "https://yoa.st/integrations-about-jetpack",
		slug: "jetpack",
		description: __( "Upgrade your meta tags and social previews and manage your SEO settings in one place.", "wordpress-seo" ),
		isPremium: false,
		isNew: false,
		isMultisiteAvailable: true,
		logo: JetpackLogo,
	},
	algolia: {
		name: "Algolia",
		claim: __( "Improve internal search results", "wordpress-seo" ),
		learnMoreLink: "https://yoa.st/integrations-about-algolia",
		logoLink: "https://yoa.st/integrations-about-algolia",
		slug: "algolia",
		description: sprintf(
			/* translators: 1: Algolia, 2: Yoast SEO */
			__( "Connect your %1$s account to improve your site’s search results using %2$s data.", "wordpress-seo" ),
			"Algolia",
			"Yoast SEO"
		),
		isPremium: true,
		isNew: false,
		isMultisiteAvailable: true,
		logo: AlgoliaLogo,
		upsellLink: "https://yoa.st/get-algolia-integration",
	},
	woocommerce: {
		name: "WooCommerce",
		claim: sprintf(
			/* translators: 1: WooCommerce */
			__( "Upgrade your %s SEO", "wordpress-seo" ),
			"WooCommerce"
		),
		learnMoreLink: "https://yoa.st/integrations-about-woocommerce",
		logoLink: "https://yoa.st/integrations-about-woocommerce",
		slug: "woocommerce",
		description: __( "Improve your technical SEO, meta tags and unlock more SEO ecommerce tools.", "wordpress-seo" ),
		isPremium: false,
		isNew: false,
		isMultisiteAvailable: true,
		logo: WoocommerceLogo,
		upsellLink: "https://yoa.st/integrations-get-woocommerce",
	},
	acf: {
		name: "ACF",
		claim: __( "Integrate your custom fields and SEO data", "wordpress-seo" ),
		learnMoreLink: "https://yoa.st/integrations-about-acf",
		logoLink: "https://yoa.st/integrations-about-acf",
		slug: "acf",
		description: sprintf(
			/* translators: 1: ACF */
			__( "Use %s fields to power your meta tags and templates, and analyze all of your content.", "wordpress-seo" ),
			"ACF"
		),
		isPremium: false,
		isNew: false,
		isMultisiteAvailable: true,
	},
};

export const pluginIntegrations = [
	<PluginIntegration
		key={ 0 }
		integration={ integrations.elementor }
		isActive={ getInitialState( integrations.elementor ) }
	/>,

	<PluginIntegration
		key={ 1 }
		integration={ integrations.jetpack }
		isActive={ getInitialState( integrations.jetpack ) }
	/>,
	/* eslint-disable dot-notation */
	<AlgoliaIntegration
		key={ 2 }
		integration={ integrations.algolia }
		toggleLabel={ __( "Enable integration", "wordpress-seo" ) }
		initialActivationState={ getInitialState( integrations.algolia ) }
		isNetworkControlEnabled={ getIsNetworkControlEnabled( integrations.algolia ) }
		isMultisiteAvailable={ getIsMultisiteAvailable( integrations.algolia ) }
		beforeToggle={ updateIntegrationState }
		isPrerequisiteActive={ Boolean( window.wpseoIntegrationsData[ "algolia_active" ] ) }
	/>,

	<WoocommerceIntegration
		key={ 3 }
		integration={ integrations.woocommerce }
		isActive={ Boolean( window.wpseoIntegrationsData[ "woocommerce_seo_active" ] ) }
		isInstalled={ Boolean( window.wpseoIntegrationsData[ "woocommerce_seo_installed" ] ) }
		isPrerequisiteActive={ Boolean( window.wpseoIntegrationsData[ "woocommerce_active" ] ) }
		upsellLink={ window.wpseoIntegrationsData[ "woocommerce_seo_upsell_url" ] }
		activationLink={ window.wpseoIntegrationsData[ "woocommerce_seo_activate_url" ] }
	/>,

	<AcfIntegration
		key={ 4 }
		integration={ integrations.acf }
		isActive={ Boolean( window.wpseoIntegrationsData[ "acf_seo_active" ] ) }
		isInstalled={ Boolean( window.wpseoIntegrationsData[ "acf_seo_installed" ] ) }
		isPrerequisiteActive={ Boolean( window.wpseoIntegrationsData[ "acf_active" ] ) }
		installationLink={ window.wpseoIntegrationsData[ "acf_seo_install_url" ] }
		activationLink={ window.wpseoIntegrationsData[ "acf_seo_activate_url" ] }
	/>,
	/* eslint-enable dot-notation */
];
