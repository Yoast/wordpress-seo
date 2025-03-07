import { createInterpolateElement } from "@wordpress/element";
import { __, sprintf } from "@wordpress/i18n";
import { get } from "lodash";
import { ReactComponent as SemrushLogo } from "../../images/semrush-logo.svg";
import { ReactComponent as WincherLogo } from "../../images/wincher-logo.svg";
import { getInitialState, getIsMultisiteAvailable, getIsNetworkControlEnabled, updateIntegrationState } from "./helper";
import { SiteKitIntegration } from "./site-kit-integration";
import { ToggleableIntegration } from "./toggleable-integration";

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

const isSiteKitFeatureEnabled = get( window, "wpseoIntegrationsData.site_kit_configuration.isFeatureEnabled", false );
if ( isSiteKitFeatureEnabled ) {
	RecommendedIntegrations.push( <SiteKitIntegration
		key={ integrations.length }
		isInstalled={ get( window, "wpseoIntegrationsData.site_kit_configuration.isInstalled", false ) }
		isActive={ get( window, "wpseoIntegrationsData.site_kit_configuration.isActive", false ) }
		isSetupCompleted={ get( window, "wpseoIntegrationsData.site_kit_configuration.isSetupCompleted", false ) }
		initialIsConsentGranted={ get( window, "wpseoIntegrationsData.site_kit_configuration.isConnected", false ) }
		installUrl={ get( window, "wpseoIntegrationsData.site_kit_configuration.installUrl", "" ) }
		activateUrl={ get( window, "wpseoIntegrationsData.site_kit_configuration.activateUrl", "" ) }
		setupUrl={ get( window, "wpseoIntegrationsData.site_kit_configuration.setupUrl", "" ) }
		consentManagementUrl={ get( window, "wpseoIntegrationsData.site_kit_consent_management_url", "" ) }
		capabilities={ get( window, "wpseoIntegrationsData.site_kit_configuration.capabilities", {
			installPlugins: false,
			viewSearchConsoleData: false,
		} ) }
	/> );
}

export { RecommendedIntegrations };
