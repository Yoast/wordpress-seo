import { __, sprintf } from "@wordpress/i18n";
import { PropTypes } from "prop-types";

import { Title  } from "@yoast/ui-library";
import { getInitialState, getIsNetworkControlEnabled, updateIntegrationState, getIsMultisiteAvailable } from "./helper";
import { ReactComponent as AlgoliaLogo } from "../../images/algolia-logo.svg";
import { ReactComponent as ElementorLogo } from "../../images/elementor-logo.svg";
import { ReactComponent as JetpackLogo } from "../../images/jetpack-logo.svg";
import { ReactComponent as SemrushLogo } from "../../images/semrush-logo.svg";
import { ReactComponent as WincherLogo } from "../../images/wincher-logo.svg";
import { ReactComponent as ZapierLogo } from "../../images/zapier-logo.svg";
import { ReactComponent as WordproofLogo } from "../../images/wordproof-logo.svg";
import { ReactComponent as WoocommerceLogo } from "../../images/woocommerce-logo.svg";
import { WoocommerceIntegration } from "./woocommerce-integration";
import { AcfIntegration } from "./acf-integration";
import { PluginIntegration } from "./plugin-integration";
import { ToggleableIntegration } from "./toggleable-integration";
import { AlgoliaIntegration } from "./algolia-integration";

const SEOTools = [
	{
		name: "Semrush",
		claim: __( "Rank for the words your audience uses", "wordpress-seo" ),
		learnMoreLink: "https://yoa.st/integrations-about-semrush",
		logoLink: "http://yoa.st/semrush-prices-wordpress",
		type: "toggleable",
		slug: "semrush",
		description: __( "Quickly discover relevant keyphrases that can make your content easy to find!", "wordpress-seo" ),
		isPremium: false,
		isNew: false,
		isMultisiteAvailable: true,
		logo: SemrushLogo,
	},
	{
		name: "Wincher",
		claim: __( "Use data to improve your rankings", "wordpress-seo" ),
		learnMoreLink: "https://yoa.st/integrations-about-wincher",
		logoLink: "https://yoa.st/integrations-about-wincher",
		type: "toggleable",
		slug: "wincher",
		description: __( "Track how your content ranks so you can make informed improvements to increase your rankings!", "wordpress-seo" ),
		isPremium: false,
		isNew: false,
		isMultisiteAvailable: false,
		logo: WincherLogo,
	},
	{
		name: "WordProof",
		claim: __( "Put a stamp of trust on your content", "wordpress-seo" ),
		learnMoreLink: "https://yoa.st/integrations-about-wordproof",
		logoLink: "https://yoa.st/integrations-about-wordproof",
		type: "toggleable",
		slug: "wordproof",
		description: __( "Add trustworthiness to your Privacy Policy and Terms of Conditions pages!", "wordpress-seo" ),
		isPremium: false,
		isNew: false,
		isMultisiteAvailable: false,
		logo: WordproofLogo,

	},
	{
		name: "Zapier",
		claim: __( "Automate repetitive tasks and save time", "wordpress-seo" ),
		learnMoreLink: "https://yoa.st/integrations-about-zapier",
		logoLink: "https://yoa.st/integrations-about-zapier",
		type: "toggleable",
		slug: "zapier",
		description: __( "Send tweets, trigger emails, and integrate with over 5,000 other apps & tools.", "wordpress-seo" ),
		isPremium: true,
		isNew: false,
		isMultisiteAvailable: true,
		logo: ZapierLogo,
		upsellLink: "https://yoa.st/get-zapier-integration",
	},
];

const pluginIntegrations = [
	{
		name: "Elementor",
		claim: sprintf(
			/* translators: 1: Elementor */
			__( "Build SEO-proof pages in %s", "wordpress-seo" ),
			"Elementor"
		),
		learnMoreLink: "https://yoa.st/integrations-about-elementor",
		logoLink: "https://yoa.st/integrations-about-elementor",
		type: "plugin",
		slug: "elementor",
		description: sprintf(
			/* translators: 1: Elementor*/
			__( "Get the best SEO feedback right in the %s builder!", "wordpress-seo" ),
			"Elementor"
		),
		isPremium: false,
		isNew: false,
		isMultisiteAvailable: true,
		logo: ElementorLogo,
	},
	{
		name: "Jetpack",
		claim: sprintf(
			/* translators: 1: Jetpack */
			__( "Upgrade the default Open Graph of %s", "wordpress-seo" ),
			"Jetpack"
		),
		learnMoreLink: "https://yoa.st/integrations-about-jetpack",
		logoLink: "https://yoa.st/integrations-about-jetpack",
		type: "plugin",
		slug: "jetpack",
		description: sprintf(
			/* translators: 1: Yoast SEO */
			__( "Take your Open Graph to the next level by replacing it with that of %s.", "wordpress-seo" ),
			"Yoast SEO"
		),
		isPremium: false,
		isNew: false,
		isMultisiteAvailable: true,
		logo: JetpackLogo,
	},
	{
		name: "Algolia",
		claim: __( "Improve internal search for better UX", "wordpress-seo" ),
		learnMoreLink: "https://yoa.st/integrations-about-algolia",
		logoLink: "https://yoa.st/integrations-about-algolia",
		type: "algolia",
		slug: "algolia",
		description: __( "Have happy website visitors by helping them find what they need!", "wordpress-seo" ),
		isPremium: true,
		isNew: false,
		isMultisiteAvailable: true,
		logo: AlgoliaLogo,
		upsellLink: "https://yoa.st/get-algolia-integration",
	},
	{
		name: "WooCommerce",
		claim: sprintf(
			/* translators: 1: WooCommerce */
			__( "Upgrade the default SEO output of %s", "wordpress-seo" ),
			"WooCommerce"
		),
		learnMoreLink: "https://yoa.st/integrations-about-woocommerce",
		logoLink: "https://yoa.st/integrations-about-woocommerce",
		type: "woocommerce",
		slug: "woocommerce",
		description: __( "Improve the titles, meta descriptions, canonicals, and breadcrumbs of your shop pages.", "wordpress-seo" ),
		isPremium: false,
		isNew: false,
		isMultisiteAvailable: true,
		logo: WoocommerceLogo,
		upsellLink: "https://yoa.st/integrations-get-woocommerce",
	},
	{
		name: "ACF",
		claim: sprintf(
			/* translators: 1: ACF */
			__( "Get SEO feedback for your %s content", "wordpress-seo" ),
			"ACF"
		),
		learnMoreLink: "https://yoa.st/integrations-about-acf",
		logoLink: "https://yoa.st/integrations-about-acf",
		type: "acf",
		slug: "acf",
		description: sprintf(
			/* translators: 1: ACF, 2: Yoast SEO */
			__( "Write excellent SEO content in your %1$s custom fields, flexible content and repeaters with %2$s!", "wordpress-seo" ),
			"ACF",
			"Yoast SEO",
			"Yoast SEO",
			"ACF"
		),
		isPremium: false,
		isNew: false,
		isMultisiteAvailable: true,
	},
];

/**
 * Renders a section.
 *
 * @param {string} title       The section title.
 * @param {string} description The section description.
 * @param {array}  elements    Array of elements to be rendered.
 *
 * @returns {WPElement} The section.
 */
const Section = ( { title, description, elements } ) => {
	return (
		<section>
			<div className="yst-mb-8">
				<h2 className="yst-mb-2 yst-text-lg yst-font-medium">{ title }</h2>
				<p className="yst-text-tiny">{ description }</p>
			</div>
			<div className="yst-grid yst-grid-cols-1 yst-gap-6 sm:yst-grid-cols-2 md:yst-grid-cols-3 lg:yst-grid-cols-4">
				{ elements.map( ( integration, index ) => {
					const label = __( "Enable integration", "wordpress-seo" );
					switch ( integration.type ) {
						case "toggleable":
							return (
								<ToggleableIntegration
									key={ index }
									integration={ integration }
									toggleLabel={ label }
									initialActivationState={ getInitialState( integration ) }
									isNetworkControlEnabled={ getIsNetworkControlEnabled( integration ) }
									isMultisiteAvailable={ getIsMultisiteAvailable( integration ) }
									beforeToggle={ updateIntegrationState }
								/>
							);
						case "plugin":
							return (
								<PluginIntegration
									key={ index }
									integration={ integration }
									isActive={ getInitialState( integration ) }
								/>
							);
						/* eslint-disable dot-notation */
						case "woocommerce":
							return (
								<WoocommerceIntegration
									key={ index }
									integration={ integration }
									isActive={ Boolean( window.wpseoIntegrationsData[ "woocommerce_seo_active" ] ) }
									isInstalled={ Boolean( window.wpseoIntegrationsData[ "woocommerce_seo_installed" ] ) }
									isPrerequisiteActive={ Boolean( window.wpseoIntegrationsData[ "woocommerce_active" ] ) }
									upsellLink={ window.wpseoIntegrationsData[ "woocommerce_seo_upsell_url" ] }
									activationLink={ window.wpseoIntegrationsData[ "woocommerce_seo_activate_url" ] }
								/>
							);
						case "acf":
							return (
								<AcfIntegration
									key={ index }
									integration={ integration }
									isActive={ Boolean( window.wpseoIntegrationsData[ "acf_seo_active" ] ) }
									isInstalled={ Boolean( window.wpseoIntegrationsData[ "acf_seo_installed" ] ) }
									isPrerequisiteActive={ Boolean( window.wpseoIntegrationsData[ "acf_active" ] ) }
									installationLink={ window.wpseoIntegrationsData[ "acf_seo_install_url" ] }
									activationLink={ window.wpseoIntegrationsData[ "acf_seo_activate_url" ] }
								/>
							);
						case "algolia":
							return (
								<AlgoliaIntegration
									key={ index }
									integration={ integration }
									toggleLabel={ label }
									initialActivationState={ getInitialState( integration ) }
									isNetworkControlEnabled={ getIsNetworkControlEnabled( integration ) }
									isMultisiteAvailable={ getIsMultisiteAvailable( integration ) }
									beforeToggle={ updateIntegrationState }
									isPrerequisiteActive={ Boolean( window.wpseoIntegrationsData[ "algolia_active" ] ) }
								/>
							);
						/* eslint-enable dot-notation */
						default:
							break;
					}
				} ) }
			</div>
		</section>
	);
};

Section.propTypes = {
	title: PropTypes.string,
	description: PropTypes.string,
	elements: PropTypes.array,
};

/**
 * Renders a grid of integrations subdivided into sections.
 *
 * @returns {WPElement} The integration grid.
*/
export default function IntegrationsGrid() {
	return (
		<div className="yst-h-full yst-flex yst-flex-col yst-bg-white yst-rounded-lg yst-shadow">
			<header className="yst-border-b yst-border-gray-200">
				<div className="yst-max-w-screen-sm yst-p-8">
					<Title
						as="h1"
						className="yst-flex yst-items-center"
					>
						{
							__( "Integrations", "wordpress-seo" )
						}
					</Title>
					<p className="yst-text-tiny yst-mt-3">
						{
							sprintf(
								/* translators: 1: Yoast SEO */
								__( "%s can integrate with third party products. You can enable or disable these integrations below.", "wordpress-seo" ),
								"Yoast SEO"
							)
						}
					</p>
				</div>
			</header>
			<div className="yst-flex-grow yst-max-w-6xl yst-p-8">

				<Section
					title={ __( "Recommended integrations", "wordpress-seo" ) }
					elements={ SEOTools }
				/>

				<hr className="yst-my-12" />

				<Section
					title={ __( "Plugin integrations", "wordpress-seo" ) }
					elements={ pluginIntegrations }
				/>

			</div>
		</div>
	);
}
