import { __, sprintf } from "@wordpress/i18n";
import { ReactComponent as SSPLogo } from "../../images/ssp-logo.svg";
import { ReactComponent as TECLogo } from "../../images/tec-logo.svg";
import { ReactComponent as RecipeMakerLogo } from "../../images/wp-recipe-maker-logo.svg";
import { safeCreateInterpolateElement } from "../helpers/i18n";
import { AcfIntegration } from "./acf-integration";
import { getInitialState } from "./helper";
import { PluginIntegration } from "./plugin-integration";

const integrations = {
	tec: {
		name: "The Events Calendar",
		claim: safeCreateInterpolateElement(
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
	ssp: {
		name: "Seriously Simple Podcasting",
		claim: safeCreateInterpolateElement(
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
	wpRecipeMaker: {
		name: "WP Recipe Maker",
		claim: safeCreateInterpolateElement(
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
	acf: {
		name: "ACF",
		claim: safeCreateInterpolateElement(
			sprintf(
				/* translators: 1: bold open tag; 2: ACF; 3: bold close tag. */
				__( "Integrate your custom fields and SEO data from %1$s%2$s%3$s", "wordpress-seo" ),
				"<strong>",
				"ACF",
				"</strong>"
			), {
				strong: <strong />,
			}
		),
		learnMoreLink: "https://yoa.st/integrations-about-acf",
		logoLink: "https://yoa.st/integrations-logo-acf",
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

/* eslint-disable dot-notation */
export const contentMediaIntegrations = [
	<PluginIntegration
		key="tec"
		integration={ integrations.tec }
		isActive={ getInitialState( integrations.tec ) }
		isSchemaAPIIntegration={ true }
	/>,

	<PluginIntegration
		key="ssp"
		integration={ integrations.ssp }
		isActive={ getInitialState( integrations.ssp ) }
		isSchemaAPIIntegration={ true }
	/>,

	<PluginIntegration
		key="wp-recipe-maker"
		integration={ integrations.wpRecipeMaker }
		isActive={ getInitialState( integrations.wpRecipeMaker ) }
		isSchemaAPIIntegration={ true }
	/>,

	<AcfIntegration
		key="acf"
		integration={ integrations.acf }
		isActive={ Boolean( window.wpseoIntegrationsData[ "acf_seo_active" ] ) }
		isInstalled={ Boolean( window.wpseoIntegrationsData[ "acf_seo_installed" ] ) }
		isPrerequisiteActive={ Boolean( window.wpseoIntegrationsData[ "acf_active" ] ) }
		installationLink={ window.wpseoIntegrationsData[ "acf_seo_install_url" ] }
		activationLink={ window.wpseoIntegrationsData[ "acf_seo_activate_url" ] }
	/>,
];
/* eslint-enable dot-notation */
