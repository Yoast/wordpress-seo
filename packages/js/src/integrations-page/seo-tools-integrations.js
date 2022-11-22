import { __, sprintf } from "@wordpress/i18n";

import { getInitialState, getIsNetworkControlEnabled, updateIntegrationState, getIsMultisiteAvailable } from "./helper";

import { ReactComponent as SemrushLogo } from "../../images/semrush-logo.svg";
import { ReactComponent as WincherLogo } from "../../images/wincher-logo.svg";
import { ReactComponent as ZapierLogo } from "../../images/zapier-logo.svg";
import { ReactComponent as WordproofLogo } from "../../images/wordproof-logo.svg";
import { ToggleableIntegration } from "./toggleable-integration";

const integrations = [
	{
		name: "Semrush",
		claim: __( "Do keyword research without leaving your post", "wordpress-seo" ),
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
		claim: __( "Track your rankings through time", "wordpress-seo" ),
		learnMoreLink: "https://yoa.st/integrations-about-wincher",
		logoLink: "https://yoa.st/integrations-about-wincher",
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
	{
		name: "WordProof",
		claim: __( "Make your terms & privacy pages more trustworthy", "wordpress-seo" ),
		learnMoreLink: "https://yoa.st/integrations-about-wordproof",
		logoLink: "https://yoa.st/integrations-about-wordproof",
		slug: "wordproof",
		description: sprintf(
			/* translators: 1: WordProof */
			__( "Use the power of the blockchain to timestamp your content with %s.", "wordpress-seo" ),
			"WordProof"
		),
		isPremium: false,
		isNew: false,
		isMultisiteAvailable: false,
		logo: WordproofLogo,

	},
	{
		name: "Zapier",
		claim: __( "Upgrade your workflow and automate tasks", "wordpress-seo" ),
		learnMoreLink: "https://yoa.st/integrations-about-zapier",
		logoLink: "https://yoa.st/integrations-about-zapier",
		slug: "zapier",
		description: sprintf(
			/* translators: 1: Zapier */
			__( "Send tweets, trigger emails, and integrate with over 5,000 other apps & tools in %s.", "wordpress-seo" ),
			"Zapier"
		),
		isPremium: true,
		isNew: false,
		isMultisiteAvailable: true,
		logo: ZapierLogo,
		upsellLink: "https://yoa.st/get-zapier-integration",
	},
];

export const SEOToolsIntegrations = [
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
