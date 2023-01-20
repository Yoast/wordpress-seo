import { createInterpolateElement } from "@wordpress/element";
import { __, sprintf } from "@wordpress/i18n";

import { getInitialState, getIsNetworkControlEnabled, updateIntegrationState, getIsMultisiteAvailable } from "./helper";
import { ReactComponent as ZapierLogo } from "../../images/zapier-logo.svg";
import { ReactComponent as WordproofLogo } from "../../images/wordproof-logo.svg";
import { ReactComponent as MastodonLogo } from "../../images/mastodon-logo.svg";
import { ToggleableIntegration } from "./toggleable-integration";
import { MastodonIntegration } from "./mastodon-integration";

const integrations = [
	{
		name: "WordProof",
		claim: createInterpolateElement(
			sprintf(
				/* translators: 1: bold open tag; 2: WordProof; 3: bold close tag. */
				__( "Make your terms & privacy pages more trustworthy with %1$s%2$s%3$s", "wordpress-seo" ),
				"<strong>",
				"WordProof",
				"</strong>"
			), {
				strong: <strong />,
			}
		),
		learnMoreLink: "https://yoa.st/integrations-about-wordproof",
		logoLink: "https://yoa.st/integrations-logo-wordproof",
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
		claim: createInterpolateElement(
			sprintf(
				/* translators: 1: bold open tag; 2: Zapier; 3: bold close tag. */
				__( "Upgrade your workflow and automate tasks with %1$s%2$s%3$s", "wordpress-seo" ),
				"<strong>",
				"Zapier",
				"</strong>"
			), {
				strong: <strong />,
			}
		),
		learnMoreLink: "https://yoa.st/integrations-about-zapier",
		logoLink: "https://yoa.st/integrations-logo-zapier",
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

const mastodonIntegration =	{
	name: "Mastodon",
	claim: createInterpolateElement(
		sprintf(
			/* translators: 1: bold open tag; 2: Mastodon; 3: bold close tag. */
			__( "Verify your site on %1$s%2$s%3$s", "wordpress-seo" ),
			"<strong>",
			"Mastodon",
			"</strong>"
		), {
			strong: <strong />,
		}
	),
	learnMoreLink: "https://yoa.st/integrations-about-mastodon",
	logoLink: "https://yoa.st/integrations-logo-mastodon",
	slug: "mastodon",
	description: sprintf(
		/* translators: 1: Mastodon */
		__( "Add your site as a verified link on your %s profile.", "wordpress-seo" ),
		"Mastodon"
	),
	isPremium: true,
	isNew: true,
	isMultisiteAvailable: true,
	logo: MastodonLogo,
	upsellLink: "https://yoa.st/get-mastodon-integration",
};


export const OtherIntegrations = [
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
	<MastodonIntegration
		key={ 3 }
		integration={ mastodonIntegration }
		isActive={ Boolean( window.wpseoIntegrationsData[ "mastodon_active" ] ) }
	/>,
];
