import { getInitialState } from "./helper";
import { PluginIntegration } from "./plugin-integration";
import { ReactComponent as SSPLogo } from "../../images/ssp-logo.svg";
import { ReactComponent as TECLogo } from "../../images/tec-logo.svg";
import { ReactComponent as WoocommerceLogo } from "../../images/woocommerce-logo.svg";
import { createInterpolateElement } from "@wordpress/element";
import { __, sprintf } from "@wordpress/i18n";
import { WoocommerceIntegration } from "./woocommerce-integration";

const integrations = [
	{
		name: "The Events Calendar",
		claim: createInterpolateElement(
			sprintf(
				/* translators: 1: bold open tag; 2: bold close tag. */
				__( "Get %1$senhanced listings for your events%2$s in Google search", "wordpress-seo" ),
				"<strong>",
				"</strong>"
			), {
				strong: <strong/>,
			}
		),
		learnMoreLink: "https://yoa.st/integrations-about-tec",
		logoLink: "https://yoa.st/integrations-logo-tec",
		slug: "tec",
		description: sprintf(
			/* translators: 1: The Events Calendar, 2: Yoast SEO */
			__( "%1$s integrates with %2$s's Schema API to get rich snippets for your events!", "wordpress-seo" ),
			"The Events Calendar",
			"Yoast SEO"
		),
		isPremium: false,
		isNew: false,
		isMultisiteAvailable: true,
		logo: TECLogo,
	},
	{
		name: "Seriously Simple Podcasting",
		claim: createInterpolateElement(
			sprintf(
				/* translators: 1: bold open tag; 2: bold close tag. */
				__( "Get %1$senhanced listings for your podcast%2$s in Google search", "wordpress-seo" ),
				"<strong>",
				"</strong>"
			), {
				strong: <strong/>,
			}
		),
		learnMoreLink: "https://yoa.st/integrations-about-ssp",
		logoLink: "https://yoa.st/integrations-logo-ssp",
		slug: "ssp",
		description: sprintf(
			/* translators: 1: Seriously Simple Podcasting, 2: Yoast SEO */
			__( "%1$s integrates with %2$s's Schema API to get rich snippets for your podcasts!", "wordpress-seo" ),
			"Seriously Simple Podcasting",
			"Yoast SEO"
		),
		isPremium: false,
		isNew: false,
		isMultisiteAvailable: true,
		logo: SSPLogo,
	}
];
const wooIntegration = {
	name: "WooCommerce",
	claim: createInterpolateElement(
		sprintf(
			/* translators: 1: bold open tag; 2: bold close tag. */
			__( "Get %1$senhanced product results%2$s in Google search", "wordpress-seo" ),
			"<strong>",
			"</strong>"
		), {
			strong: <strong/>,
		}
	),
	learnMoreLink: "https://yoa.st/integrations-about-woocommerce",
	logoLink: "https://yoa.st/integrations-logo-woocommerce",
	slug: "woocommerce",
	description: sprintf(
		/* translators: 1: Yoast WooCommerce SEO */
		__( "Unlock rich results for your product pages by using %1$s.", "wordpress-seo" ),
		"Yoast WooCommerce SEO"
	),
	isPremium: false,
	isNew: false,
	isMultisiteAvailable: true,
	logo: WoocommerceLogo,
	upsellLink: "https://yoa.st/integrations-get-woocommerce",
};

const SchemaAPIIntegrations = [
	integrations.map( ( integration, index ) => {
		return (
			<PluginIntegration
				key={ index }
				integration={ integration }
				isActive={ getInitialState( integration ) }
			/>
		);
	} ),
];
SchemaAPIIntegrations.push(
	<WoocommerceIntegration
		integration={ wooIntegration }
		isActive={ Boolean( window.wpseoIntegrationsData[ "woocommerce_seo_active" ] ) }
		isInstalled={ Boolean( window.wpseoIntegrationsData[ "woocommerce_seo_installed" ] ) }
		isPrerequisiteActive={ Boolean( window.wpseoIntegrationsData[ "woocommerce_active" ] ) }
		upsellLink={ window.wpseoIntegrationsData[ "woocommerce_seo_upsell_url" ] }
		activationLink={ window.wpseoIntegrationsData[ "woocommerce_seo_activate_url" ] }
	/>
);
export const schemaAPIIntegrations = SchemaAPIIntegrations;
