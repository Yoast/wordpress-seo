import { __, sprintf } from "@wordpress/i18n";
import { ReactComponent as ElementorLogo } from "../../images/elementor-logo.svg";
import { ReactComponent as JetpackLogo } from "../../images/jetpack-logo.svg";
import { safeCreateInterpolateElement } from "../helpers/i18n";
import { getInitialState } from "./helper";
import { PluginIntegration } from "./plugin-integration";

const integrations = {
	elementor: {
		name: "Elementor",
		claim: safeCreateInterpolateElement(
			sprintf(
				/* translators: 1: Yoast SEO; 2: bold open tag; 3: Elementor; 4: bold close tag. */
				__( "Get %1$s tools and functionality in %2$s%3$s%4$s", "wordpress-seo" ),
				"Yoast SEO",
				"<strong>",
				"Elementor",
				"</strong>"
			), {
				strong: <strong />,
			}
		),
		learnMoreLink: "https://yoa.st/integrations-about-elementor",
		logoLink: "https://yoa.st/integrations-logo-elementor",
		slug: "elementor",
		description: __( "Take advantage of your favorite SEO & content analysis tools with your favorite page builder.", "wordpress-seo" ),
		isPremium: false,
		isNew: false,
		isMultisiteAvailable: true,
		logo: ElementorLogo,
	},
	jetpack: {
		name: "Jetpack",
		claim: safeCreateInterpolateElement(
			sprintf(
				/* translators: 1: bold open tag; 2: Jetpack; 3: bold close tag; 4: Yoast. */
				__( "Get the most out of %1$s%2$s%3$s and %4$s, together", "wordpress-seo" ),
				"<strong>",
				"Jetpack",
				"</strong>",
				"Yoast"
			), {
				strong: <strong />,
			}
		),
		learnMoreLink: "https://yoa.st/integrations-about-jetpack",
		logoLink: "https://yoa.st/integrations-logo-jetpack",
		slug: "jetpack",
		description: __( "Upgrade your meta tags and social previews and manage your SEO settings in one place.", "wordpress-seo" ),
		isPremium: false,
		isNew: false,
		isMultisiteAvailable: true,
		logo: JetpackLogo,
	},
};

export const siteBuildingIntegrations = [
	<PluginIntegration
		key="elementor"
		integration={ integrations.elementor }
		isActive={ getInitialState( integrations.elementor ) }
	/>,

	<PluginIntegration
		key="jetpack"
		integration={ integrations.jetpack }
		isActive={ getInitialState( integrations.jetpack ) }
	/>,
];
