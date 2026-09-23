import { __, sprintf } from "@wordpress/i18n";
import { ReactComponent as MastodonLogo } from "../../images/mastodon-logo.svg";
import { safeCreateInterpolateElement } from "../helpers/i18n";
import { MastodonIntegration } from "./mastodon-integration";

const mastodonIntegration = {
	name: "Mastodon",
	claim: safeCreateInterpolateElement(
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
		/* translators: 1: Mastodon, 2: Yoast SEO Premium */
		__( "Add trustworthiness to your %1$s profile by verifying your site with %2$s.", "wordpress-seo" ),
		"Mastodon",
		"Yoast SEO Premium"
	),
	isPremium: true,
	isNew: false,
	isMultisiteAvailable: true,
	logo: MastodonLogo,
	upsellLink: "https://yoa.st/get-mastodon-integration",
};

/* eslint-disable dot-notation */
export const verificationIntegrations = [
	<MastodonIntegration
		key="mastodon"
		integration={ mastodonIntegration }
		isActive={ Boolean( window.wpseoIntegrationsData[ "mastodon_active" ] ) }
	/>,
];
/* eslint-enable dot-notation */
