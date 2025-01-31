import { getInitialState } from "./helper";
import { PluginIntegration } from "./plugin-integration";
import { ReactComponent as SSPLogo } from "../../images/ssp-logo.svg";
import { ReactComponent as TECLogo } from "../../images/tec-logo.svg";
import { ReactComponent as RecipeMakerLogo } from "../../images/wp-recipe-maker-logo.svg";
import { ReactComponent as WoocommerceSeoLogo } from "../../images/woocommerce-seo-logo.svg";
import { ReactComponent as EDDLogo } from "../../images/edd-logo.svg";
import { createInterpolateElement } from "@wordpress/element";
import { __, sprintf } from "@wordpress/i18n";
import { WoocommerceIntegration } from "./woocommerce-integration";

const integrations = [
	{
		name: "The Events Calendar",
		claim: createInterpolateElement(
			sprintf(
				/* translators: 1: bold open tag; 2: bold close tag. */
				__( "Get %1$srich results for your events%2$s in Google search", "wordpress-seo" ),
				"<strong>",
				"</strong>"
			), {
				strong: <strong />,
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
				__( "Get %1$srich results for your podcast%2$s in Google search", "wordpress-seo" ),
				"<strong>",
				"</strong>"
			), {
				strong: <strong />,
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
	},
	{
		name: "Easy Digital Downloads",
		claim: createInterpolateElement(
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
	{
		name: "WP Recipe Maker",
		claim: createInterpolateElement(
			sprintf(
				/* translators: 1: bold open tag; 2: bold close tag. */
				__( "Get %1$srich results for your recipes%2$s in Google search", "wordpress-seo" ),
				"<strong>",
				"</strong>"
			), {
				strong: <strong />,
			}
		),
		learnMoreLink: "https://yoa.st/integrations-about-wp-recipemaker",
		logoLink: "https://yoa.st/integrations-logo-wp-recipemaker",
		slug: "wp-recipe-maker",
		description: sprintf(
			/* translators: 1: Seriously Simple Podcasting, 2: Yoast SEO */
			__( "%1$s integrates with %2$s's Schema API to get rich snippets for your recipes!", "wordpress-seo" ),
			"WP Recipe Maker",
			"Yoast SEO"
		),
		isPremium: false,
		isNew: false,
		isMultisiteAvailable: true,
		logo: RecipeMakerLogo,
	},
];
const wooIntegration = {
	name: "WooCommerce",
	claim: createInterpolateElement(
		sprintf(
			/* translators: 1: bold open tag; 2: bold close tag. */
			__( "Get %1$srich product results%2$s in Google search", "wordpress-seo" ),
			"<strong>",
			"</strong>"
		), {
			strong: <strong />,
		}
	),
	learnMoreLink: "https://yoa.st/integrations-about-woocommerce",
	logoLink: "https://yoa.st/integrations-logo-woocommerce",
	slug: "woocommerce",
	description: sprintf(
		/* translators: 1: Yoast WooCommerce SEO */
		__( "Unlock rich snippets for your product pages by using %1$s.", "wordpress-seo" ),
		"Yoast WooCommerce SEO"
	),
	isPremium: false,
	isNew: false,
	isMultisiteAvailable: true,
	logo: WoocommerceSeoLogo,
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
/* eslint-disable dot-notation */
SchemaAPIIntegrations.push(
	<WoocommerceIntegration
		key={ integrations.length + 1 }
		integration={ wooIntegration }
		isActive={ Boolean( window.wpseoIntegrationsData[ "woocommerce_seo_active" ] ) }
		isInstalled={ Boolean( window.wpseoIntegrationsData[ "woocommerce_seo_installed" ] ) }
		isPrerequisiteActive={ Boolean( window.wpseoIntegrationsData[ "woocommerce_active" ] ) }
		upsellLink={ window.wpseoIntegrationsData[ "woocommerce_seo_upsell_url" ] }
		activationLink={ window.wpseoIntegrationsData[ "woocommerce_seo_activate_url" ] }
	/>
);
/* eslint-enable dot-notation */
export const schemaAPIIntegrations = SchemaAPIIntegrations;
