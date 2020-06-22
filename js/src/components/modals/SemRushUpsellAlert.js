/* External dependencies */
import React from "react";
import { __, sprintf } from "@wordpress/i18n";

/* Internal dependencies */
import { Alert } from "@yoast/components";
import { makeOutboundLink } from "@yoast/helpers";

const PremiumLandingPageLink = makeOutboundLink();

/**
 * Creates the content for the Yoast SEO Premium upsell alert in SEMrush modal
 *
 * @returns {React.Element} The Yoast SEO Premium upsell alert
 */
const SemRushUpsellAlert = () => {

	return (
		<Alert type="info">
			{
				sprintf(
					/* translators: %s : Expands to "Yoast SEO". */
					__( "Would you like to be able to add these related keyphrases to the %s analysis so you can optimize your content even further?", "wordpress-seo" ),
					"Yoast SEO"
				)
				+ " "
			}
			<PremiumLandingPageLink
				href="https://yoa.st/413">
				{
					sprintf(
						/* translators: %s : Expands to "Yoast SEO Premium". */
						__( "Check out %s!", "wordpress-seo"),
						"Yoast SEO Premium"
					)
				}
			</PremiumLandingPageLink>
		</Alert>
	);
};

export default SemRushUpsellAlert;
