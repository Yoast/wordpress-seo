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
		claim: __( "Do keyword research without leaving your post", "wordpress-seo" ),
		learnMoreLink: "https://yoa.st/integrations-about-semrush",
		logoLink: "http://yoa.st/semrush-prices-wordpress",
		type: "toggleable",
		slug: "semrush",
		description: sprintf(
			/* translators: 1: Semrush */
			__( "Find out what your audience is searching for with %s data right in your sidebar.", "wordpress-seo" ),
			"Semrush"
		),
		isPremium: false,
		isNew: false,
		isMultisiteAvailable: true,
		logo: SemrushLogo,
	},
	{
		name: "Wincher",
		claim: __( "Track your rankings through time", "wordpress-seo" ),
		learnMoreLink: "https://yoa.st/integrations-about-wincher",
		logoLink: "https://yoa.st/integrations-about-wincher",
		type: "toggleable",
		slug: "wincher",
		description: sprintf(
			/* translators: 1: Wincher */
			__( "Keep an eye on how your posts are ranking by connecting to your %s account.", "wordpress-seo" ),
			"Wincher"
		),
		isPremium: false,
		isNew: false,
		isMultisiteAvailable: false,
		logo: WincherLogo,
	},
	{
		name: "WordProof",
		claim: __( "Make your terms & privacy pages more trustworthy", "wordpress-seo" ),
		learnMoreLink: "https://yoa.st/integrations-about-wordproof",
		logoLink: "https://yoa.st/integrations-about-wordproof",
		type: "toggleable",
		slug: "wordproof",
		description: sprintf(
			/* translators: 1: WordProof */
			__( "Use the power of the blockchain to timestamp your content with %s.", "wordpress-seo" ),
			"WordProof"
		),
		isPremium: false,
		isNew: false,
		isMultisiteAvailable: false,
		logo: WordproofLogo,

	},
	{
		name: "Zapier",
		claim: __( "Upgrade your workflow and automate tasks", "wordpress-seo" ),
		learnMoreLink: "https://yoa.st/integrations-about-zapier",
		logoLink: "https://yoa.st/integrations-about-zapier",
		type: "toggleable",
		slug: "zapier",
		description: sprintf(
			/* translators: 1: Zapier */
			__( "Send tweets, trigger emails, and integrate with over 5,000 other apps & tools in %s.", "wordpress-seo" ),
			"Zapier"
		),
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
			/* translators: 1: Yoast SEO, 2: Elementor */
			__( "Get %1$s tools and functionality in %2$s", "wordpress-seo" ),
			"Yoast SEO",
			"Elementor"
		),
		learnMoreLink: "https://yoa.st/integrations-about-elementor",
		logoLink: "https://yoa.st/integrations-about-elementor",
		type: "plugin",
		slug: "elementor",
		description: __( "Take advantage of your favorite SEO & content analysis tools with your favorite page builder.", "wordpress-seo" ),
		isPremium: false,
		isNew: false,
		isMultisiteAvailable: true,
		logo: ElementorLogo,
	},
	{
		name: "Jetpack",
		claim: sprintf(
			/* translators: 1: Jetpack, 2: Yoast */
			__( "Get the most out of %1$s and %2$s, together", "wordpress-seo" ),
			"Jetpack",
			"Yoast"
		),
		learnMoreLink: "https://yoa.st/integrations-about-jetpack",
		logoLink: "https://yoa.st/integrations-about-jetpack",
		type: "plugin",
		slug: "jetpack",
		description: __( "Upgrade your meta tags and social previews and manage your SEO settings in one place.", "wordpress-seo" ),
		isPremium: false,
		isNew: false,
		isMultisiteAvailable: true,
		logo: JetpackLogo,
	},
	{
		name: "Algolia",
		claim: __( "Improve internal search results", "wordpress-seo" ),
		learnMoreLink: "https://yoa.st/integrations-about-algolia",
		logoLink: "https://yoa.st/integrations-about-algolia",
		type: "algolia",
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
	{
		name: "WooCommerce",
		claim: sprintf(
			/* translators: 1: WooCommerce */
			__( "Upgrade your %s SEO", "wordpress-seo" ),
			"WooCommerce"
		),
		learnMoreLink: "https://yoa.st/integrations-about-woocommerce",
		logoLink: "https://yoa.st/integrations-about-woocommerce",
		type: "woocommerce",
		slug: "woocommerce",
		description: __( "Improve your technical SEO, meta tags and unlock more SEO ecommerce tools.", "wordpress-seo" ),
		isPremium: false,
		isNew: false,
		isMultisiteAvailable: true,
		logo: WoocommerceLogo,
		upsellLink: "https://yoa.st/integrations-get-woocommerce",
	},
	{
		name: "ACF",
		claim: __( "Integrate your custom fields and SEO data", "wordpress-seo" ),
		learnMoreLink: "https://yoa.st/integrations-about-acf",
		logoLink: "https://yoa.st/integrations-about-acf",
		type: "acf",
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
