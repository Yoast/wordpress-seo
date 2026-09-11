import { __, sprintf } from "@wordpress/i18n";
import { get } from "lodash";
import { ReactComponent as AbilitiesLogo } from "../../images/abilities-api-logo.svg";
import { ReactComponent as NlwebLogo } from "../../images/nlweb-logo.svg";
import { safeCreateInterpolateElement } from "../helpers/i18n";
import { AbilitiesIntegration } from "./abilities-integration";
import { NlwebIntegration } from "./nlweb-integration";

const integrations = {
	nlweb: {
		name: "NLWeb",
		claim: safeCreateInterpolateElement(
			sprintf(
				/* translators: 1: bold open tag; 2: NLWeb; 3: bold close tag. */
				__( "Make your site conversational with %1$s%2$s%3$s", "wordpress-seo" ),
				"<strong>",
				"NLWeb",
				"</strong>"
			), {
				strong: <strong />,
			}
		),
		learnMoreLink: "https://yoast.com/integrations/nlweb/",
		logoLink: "https://yoast.com/integrations/nlweb/",
		slug: "nlweb",
		description: sprintf(
			/* translators: 1: NLWeb; 2: Microsoft; 3: Yoast. */
			__( "%1$s, %2$s's open protocol, lets AI agents and assistants query your site in natural language — grounded in the schema graph %3$s already builds from your content.", "wordpress-seo" ),
			"NLWeb",
			"Microsoft",
			"Yoast"
		),
		isPremium: false,
		isNew: true,
		isMultisiteAvailable: true,
		logo: NlwebLogo,
	},
	abilities: {
		name: "Abilities API",
		claim: safeCreateInterpolateElement(
			sprintf(
				/* translators: 1: bold open tag; 2: Yoast SEO; 3: bold close tag. */
				__( "Expose %1$s%2$s%3$s data to AI tools and workflows", "wordpress-seo" ),
				"<strong>",
				"Yoast SEO",
				"</strong>"
			), {
				strong: <strong />,
			}
		),
		learnMoreLink: "https://developer.yoast.com/features/yoast-abilities-api/overview/",
		logoLink: "https://developer.yoast.com/features/yoast-abilities-api/overview/",
		slug: "abilities",
		description: sprintf(
			/* translators: 1: WordPress; 2: Yoast SEO. */
			__( "%1$s's Abilities API lets AI assistants and automations discover and read %2$s's content analysis scores directly — no custom integration required.", "wordpress-seo" ),
			"WordPress",
			"Yoast SEO"
		),
		isPremium: false,
		isNew: true,
		isMultisiteAvailable: true,
		logo: AbilitiesLogo,
	},
};

export const aiIntegrations = [
	<NlwebIntegration
		key="nlweb"
		integration={ integrations.nlweb }
		isActive={ Boolean( get( window, "wpseoIntegrationsData.schema_aggregation_active", false ) ) }
	/>,

	<AbilitiesIntegration
		key="abilities"
		integration={ integrations.abilities }
		isActive={ Boolean( get( window, "wpseoIntegrationsData.abilities_api_active", false ) ) }
	/>,
];
