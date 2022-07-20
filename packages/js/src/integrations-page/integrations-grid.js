import { __, sprintf } from "@wordpress/i18n";
import { PropTypes } from "prop-types";

import { Title  } from "@yoast/ui-library";
import { getInitialState, getIsNetworkControlEnabled, updateIntegrationState, getIsMultisiteAvailable } from "./helper";
import { ReactComponent as AlgoliaLogo } from "../../images/algolia-logo.svg";
import { ReactComponent as ElementorLogo } from "../../images/elementor-logo.svg";
import { ReactComponent as JetpackLogo } from "../../images/jetpack-logo.svg";
import { ReactComponent as RyteLogo } from "../../images/ryte-logo.svg";
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
		learnMoreLink: "#",
		type: "toggleable",
		slug: "semrush",
		description: __( "Semrush in Yoast SEO makes keyword research easy. Click a button, and get relevant keyphrases to make your content easy to find!", "wordpress-seo" ),
		isPremium: false,
		isNew: false,
		isMultisiteAvailable: true,
		logo: SemrushLogo,
	},
	{
		name: "Wincher",
		claim: __( "Use data to improve your rankings", "wordpress-seo" ),
		learnMoreLink: "#",
		type: "toggleable",
		slug: "wincher",
		description: __( "Track how your content ranks and compare it against your competitors. The data will allow you to make informed improvements to your site and help increase its rankings!", "wordpress-seo" ),
		isPremium: false,
		isNew: false,
		isMultisiteAvailable: false,
		logo: WincherLogo,
	},
	{
		name: "WordProof",
		claim: __( "Put a stamp of trust on your content", "wordpress-seo" ),
		learnMoreLink: "#",
		type: "toggleable",
		slug: "wordproof",
		description: __( "Prove that you got nothing to hide! Put the WordProof stamp of trustworthiness to your privacy policy and the terms and conditions pages!", "wordpress-seo" ),
		isPremium: false,
		isNew: false,
		isMultisiteAvailable: false,
		logo: WordproofLogo,

	},
	{
		name: "Zapier",
		claim: __( "Automate repetitive tasks and save time", "wordpress-seo" ),
		learnMoreLink: "#",
		type: "toggleable",
		slug: "zapier",
		description: __( "Seed up your workflow with automated actions when you publish or update your content.", "wordpress-seo" ),
		isPremium: true,
		isNew: false,
		isMultisiteAvailable: true,
		logo: ZapierLogo,
		upsellLink: "https://yoa.st/get-zapier-integration",
	},
	{
		name: "Ryte",
		claim: __( "Ensure your site is findable", "wordpress-seo" ),
		learnMoreLink: "#",
		type: "toggleable",
		slug: "ryte",
		description: __( "Ryte in Yoast SEO monitors your site’s findability and lets you know if your site is hidden from search engines.", "wordpress-seo" ),
		isPremium: false,
		isNew: false,
		isMultisiteAvailable: true,
		logo: RyteLogo,
	},
];

const pluginIntegrations = [
	{
		name: "Elementor",
		claim: __( "Build SEO-proof pages in Elementor", "wordpress-seo" ),
		type: "plugin",
		slug: "elementor",
		description: __( "The seamless integration ensures you get the best SEO feedback right in the Elementor builder!", "wordpress-seo" ),
		isPremium: false,
		isNew: false,
		isMultisiteAvailable: true,
		logo: ElementorLogo,
	},
	{
		name: "Jetpack",
		claim: null,
		type: "plugin",
		slug: "jetpack",
		description: __( "Short descriptive copy that tells about the integrations and its value.", "wordpress-seo" ),
		isPremium: false,
		isNew: false,
		isMultisiteAvailable: true,
		logo: JetpackLogo,
	},
	{
		name: "Algolia",
		claim: __( "Improve internal search for better UX", "wordpress-seo" ),
		type: "algolia",
		slug: "algolia",
		description: __( "Good internal search results lead to happy visitors, which reflects on rankings! Do it easily with Algolia in Yoast SEO Premium!", "wordpress-seo" ),
		isPremium: true,
		isNew: false,
		isMultisiteAvailable: true,
		logo: AlgoliaLogo,
		upsellLink: "https://yoa.st/get-algolia-integration",
	},
	{
		name: "WooCommerce",
		claim: null,
		type: "woocommerce",
		slug: "woocommerce",
		description: __( "Short descriptive copy that tells about the integrations and its value.", "wordpress-seo" ),
		isPremium: false,
		isNew: false,
		isMultisiteAvailable: true,
		logo: WoocommerceLogo,
	},
	{
		name: "ACF",
		claim: "ACF",
		type: "acf",
		slug: "acf",
		description: __( "Short descriptive copy that tells about the integrations and its value.", "wordpress-seo" ),
		isPremium: false,
		isNew: false,
		isMultisiteAvailable: true,
		logo: null,
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
					title={ __( "Recommended Integrations", "wordpress-seo" ) }
					description="description"
					elements={ SEOTools }
				/>

				<hr className="yst-my-12" />

				<Section
					title={ __( "Plugin Integrations", "wordpress-seo" ) }
					description="description"
					elements={ pluginIntegrations }
				/>

			</div>
		</div>
	);
}
