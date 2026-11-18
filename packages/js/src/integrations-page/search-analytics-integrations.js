import { __, sprintf } from "@wordpress/i18n";
import { ReactComponent as AlgoliaLogo } from "../../images/algolia-logo.svg";
import { safeCreateInterpolateElement } from "../helpers/i18n";
import { AlgoliaIntegration } from "./algolia-integration";
import { getInitialState, getIsMultisiteAvailable, getIsNetworkControlEnabled, updateIntegrationState } from "./helper";

const integrations = {
	algolia: {
		name: "Algolia",
		claim: safeCreateInterpolateElement(
			sprintf(
				/* translators: 1: bold open tag; 2: Algolia; 3: bold close tag. */
				__( "Improve your internal search results with %1$s%2$s%3$s", "wordpress-seo" ),
				"<strong>",
				"Algolia",
				"</strong>"
			), {
				strong: <strong />,
			}
		),
		learnMoreLink: "https://yoa.st/integrations-about-algolia",
		logoLink: "https://yoa.st/integrations-logo-algolia",
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
};

/* eslint-disable dot-notation */
export const searchAnalyticsIntegrations = [
	<AlgoliaIntegration
		key="algolia"
		integration={ integrations.algolia }
		toggleLabel={ __( "Enable integration", "wordpress-seo" ) }
		initialActivationState={ getInitialState( integrations.algolia ) }
		isNetworkControlEnabled={ getIsNetworkControlEnabled( integrations.algolia ) }
		isMultisiteAvailable={ getIsMultisiteAvailable( integrations.algolia ) }
		beforeToggle={ updateIntegrationState }
		isPrerequisiteActive={ Boolean( window.wpseoIntegrationsData[ "algolia_active" ] ) }
	/>,
];
/* eslint-enable dot-notation */
