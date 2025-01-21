import { createInterpolateElement } from "@wordpress/element";
import { __, sprintf } from "@wordpress/i18n";
import { get } from "lodash";
import { ReactComponent as SemrushLogo } from "../../images/semrush-logo.svg";
import { ReactComponent as WincherLogo } from "../../images/wincher-logo.svg";
import { getInitialState, getIsMultisiteAvailable, getIsNetworkControlEnabled, updateIntegrationState } from "./helper";

import { ToggleableIntegration } from "./toggleable-integration";
import { GoogleSiteKitIntegration } from "./google-site-kit-integration";

const integrations = [
	{
		name: "Semrush",
		claim: createInterpolateElement(
			sprintf(
				/* translators: 1: bold open tag; 2: Semrush; 3: bold close tag. */
				__( "Use %1$s%2$s%3$s to do keyword research - without leaving your post", "wordpress-seo" ),
				"<strong>",
				"Semrush",
				"</strong>"
			), {
				strong: <strong />,
			}
		),
		learnMoreLink: "https://yoa.st/integrations-about-semrush",
		logoLink: "http://yoa.st/semrush-prices-wordpress",
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
		claim: createInterpolateElement(
			sprintf(
				/* translators: 1: bold open tag; 2: Wincher; 3: bold close tag. */
				__( "Track your rankings through time with %1$s%2$s%3$s", "wordpress-seo" ),
				"<strong>",
				"Wincher",
				"</strong>"
			), {
				strong: <strong />,
			}
		),
		learnMoreLink: "https://yoa.st/integrations-about-wincher",
		logoLink: "https://yoa.st/integrations-logo-wincher",
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
];

const isGoogleSiteKitFeatureEnabled = get( window, "wpseoIntegrationsData.google_site_kit_feature", false );

const RecommendedIntegrations = [
	integrations.map( ( integration, index ) => {
		return (
			<ToggleableIntegration
				key={ index }
				integration={ integration }
				toggleLabel={ __( "Enable integration", "wordpress-seo" ) }
				initialActivationState={ getInitialState( integration ) }
				isNetworkControlEnabled={ getIsNetworkControlEnabled( integration ) }
				isMultisiteAvailable={ getIsMultisiteAvailable( integration ) }
				beforeToggle={ updateIntegrationState }
			/>
		);
	} ),
];

const googleSiteKitProps = {
	isInstalled: get( window, "wpseoIntegrationsData.google_site_kit_installed", false ) === "1",
	isActive: get( window, "wpseoIntegrationsData.google_site_kit_active", false ) === "1",
	afterSetup: get( window, "wpseoIntegrationsData.google_site_kit_setup", false ) === "1",
	isConnected: get( window, "wpseoIntegrationsData.google_site_kit_connected", false ) === "1",
	installUrl: get( window, "wpseoIntegrationsData.google_site_kit_install_url", "" ),
	activateUrl: get( window, "wpseoIntegrationsData.google_site_kit_activate_url", "" ),
	setupUrl: get( window, "wpseoIntegrationsData.google_site_kit_setup_url", "" ),
};

if ( isGoogleSiteKitFeatureEnabled ) {
	RecommendedIntegrations.push( <GoogleSiteKitIntegration key={ integrations.length } { ...googleSiteKitProps } /> );
}

export { RecommendedIntegrations };
