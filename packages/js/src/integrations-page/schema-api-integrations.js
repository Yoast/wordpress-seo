import { getInitialState } from "./helper";
import { PluginIntegration } from "./plugin-integration";
import { ReactComponent as SSPLogo } from "../../images/ssp-logo.svg";
import { ReactComponent as TECLogo } from "../../images/tec-logo.svg";
import { ReactComponent as WoocommerceLogo } from "../../images/woocommerce-logo.svg";
import { createInterpolateElement } from "@wordpress/element";
import { __, sprintf } from "@wordpress/i18n";

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
				strong: <strong />,
			}
		),
		learnMoreLink: "https://yoa.st/integrations-about-tec",
		logoLink: "https://yoa.st/integrations-logo-tec",
		slug: "tec",
		description: "The Events Calendar integrates with Yoast SEO's Schema API to get rich snippets for your events!",
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
				strong: <strong />,
			}
		),
		learnMoreLink: "https://yoa.st/integrations-about-ssp",
		logoLink: "https://yoa.st/integrations-logo-ssp",
		slug: "ssp",
		description: "Seriously Simple Podcasting integrates with Yoast SEO's Schema API to get rich snippets for your podcasts!",
		isPremium: false,
		isNew: false,
		isMultisiteAvailable: true,
		logo: SSPLogo,
	},
	{
		name: "WooCommerce",
		claim: createInterpolateElement(
			sprintf(
				/* translators: 1: bold open tag; 2: bold close tag. */
				__( "Get %1$senhanced product results%2$s in Google search", "wordpress-seo" ),
				"<strong>",
				"</strong>"
			), {
				strong: <strong />,
			}
		),
		learnMoreLink: "https://yoa.st/integrations-about-woocommerce",
		logoLink: "https://yoa.st/integrations-logo-woocommerce",
		slug: "woocommerce",
		description: __( "Improve your product schema, meta tags and unlock more SEO ecommerce tools.", "wordpress-seo" ),
		isPremium: false,
		isNew: false,
		isMultisiteAvailable: true,
		logo: WoocommerceLogo,
		upsellLink: "https://yoa.st/integrations-get-woocommerce",
	},
];

export const schemaAPIIntegrations = [
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
