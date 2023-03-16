import { createInterpolateElement } from "@wordpress/element";
import { __, sprintf } from "@wordpress/i18n";
import { ReactComponent as JetpackBoostLogo } from "../../images/jetpack-boost-integration-logo.svg";
import { ReactComponent as SemrushLogo } from "../../images/semrush-logo.svg";
import { ReactComponent as WincherLogo } from "../../images/wincher-logo.svg";
import { getInitialState, getIsMultisiteAvailable, getIsNetworkControlEnabled, updateIntegrationState } from "./helper";
import { JetpackBoostIntegration } from "./jetpack-boost-integration";

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

const jetpackBoostActive  = Boolean( window.wpseoIntegrationsData[ "jetpack-boost_active" ] );
const jetpackBoostPremium = Boolean( window.wpseoIntegrationsData[ "jetpack-boost_premium" ] );

let claim = createInterpolateElement(
	sprintf(
		/* translators: 1: bold open tag; 2: Yoast SEO; 3: Jetpack Boost; 4: bold close tag. */
		__( "Speed up your site with %1$s%2$s and %3$s%4$s", "wordpress-seo" ),
		"<strong>",
		"Yoast SEO",
		"Jetpack Boost",
		"</strong>"
	), {
		strong: <strong />,
	}
);
if ( jetpackBoostActive ) {
	claim = createInterpolateElement(
		sprintf(
			/* translators: 1: bold open tag; 2: Jetpack Boost Premium ; 3: bold close tag. */
			__( "Speed up your site with %1$s%2$s%3$s", "wordpress-seo" ),
			"<strong>",
			"Jetpack Boost Premium",
			"</strong>"
		), {
			strong: <strong />,
		}
	);
}

let description = sprintf(
	/* translators: 1: Yoast, 2: Jetpack Boost, 3: Boost (short for Jetpack Boost). */
	__( "%1$s recommends using %2$s to speed up your site. Optimize CSS, defer non-essential Javascript, and lazy load images. Install %3$s, speed up your site, and improve its ranking!", "wordpress-seo" ),
	"Yoast",
	"Jetpack Boost",
	"Boost"
);
if ( jetpackBoostActive ) {
	description = sprintf(
		/* translators: 1: Yoast, 2: Jetpack Boost, 3: Boost (short for Jetpack Boost). */
		__( "%1$s recommends using %2$s for automated Critical CSS generation. Whenever you change your site, %3$s will automatically regenerate your site’s Critical CSS and performance scores. Upgrade %3$s, speed up your site, and improve its ranking!", "wordpress-seo" ),
		"Yoast",
		"Jetpack Boost",
		"Boost"
	);
}
if ( jetpackBoostPremium ) {
	description = sprintf(
		/* translators: 1: Yoast, 2: Jetpack Boost, 3: Boost (short for Jetpack Boost). */
		__( "%1$s recommends using %2$s for automated Critical CSS generation. Whenever you change your site, %3$s will automatically regenerate your site’s Critical CSS and performance scores.", "wordpress-seo" ),
		"Yoast",
		"Jetpack Boost",
		"Boost"
	);
}

let learnMoreLinkText = sprintf(
	/* translators: Jetpack Boost. */
	__( "Get %s", "wordpress-seo" ),
	"Jetpack Boost"
);
if ( jetpackBoostActive ) {
	learnMoreLinkText = sprintf(
		/* translators: Jetpack Boost. */
		__( "Upgrade %s", "wordpress-seo" ),
		"Jetpack Boost"
	);
}
if ( jetpackBoostPremium ) {
	learnMoreLinkText = __( "Learn more", "wordpress-seo" );
}

let learnMoreLink = window.wpseoIntegrationsData[ "jetpack-boost_get_link" ];
if ( jetpackBoostActive ) {
	learnMoreLink = window.wpseoIntegrationsData[ "jetpack-boost_upgrade_link" ];
}
if ( jetpackBoostPremium ) {
	learnMoreLink = window.wpseoIntegrationsData[ "jetpack-boost_learn_more_link" ];
}

const jetpackBoostIntegration = {
	name: "Jetpack Boost",
	claim: claim,
	learnMoreLinkText: learnMoreLinkText,
	learnMoreLink: learnMoreLink,
	logoLink: window.wpseoIntegrationsData[ "jetpack-boost_logo_link" ],
	slug: "jetpack-boost",
	description: description,
	logo: JetpackBoostLogo,
};

export const RecommendedIntegrations = [
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
	<JetpackBoostIntegration
		key={ integrations.length }
		integration={ jetpackBoostIntegration }
		isJetpackBoostActive={ jetpackBoostActive }
		isJetpackBoostPremium={ jetpackBoostPremium }
	/>,
];
