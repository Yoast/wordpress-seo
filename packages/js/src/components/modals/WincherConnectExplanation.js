/* global wpseoAdminGlobalL10n, wpseoAdminL10n */

/* External dependencies */
import { __, sprintf } from "@wordpress/i18n";
import interpolateComponents from "interpolate-components";
import { makeOutboundLink } from "@yoast/helpers";

/* Yoast dependencies */
const WincherLink = makeOutboundLink();
const WincherReadMoreLink = makeOutboundLink();

/**
 * Creates the content for the Wincher explanation text used througout the admin.
 *
 * @returns {wp.Element} The Wincher explanation text.
 */
const WincherConnectExplanation = () => {
	const message = sprintf(
		__(
			/* translators: %1$s expands to a link to Wincher, %2$s expands to a link to the keyphrase tracking article on Yoast.com */
			"Connect %1$s with %2$s to track the ranking position of your site in the search results based on your keyphrase(s). %3$s",
			"wordpress-seo"
		),
		"Yoast SEO",
		"{{wincherLink/}}",
		"{{wincherReadMoreLink/}}"
	);

	return (
		<p>
			{
				interpolateComponents( {
					mixedString: message,
					components: {
						wincherLink: <WincherLink href={ wpseoAdminGlobalL10n[ "links.wincher.website" ] }>
							Wincher
						</WincherLink>,
						wincherReadMoreLink: <WincherReadMoreLink href={ wpseoAdminL10n[ "shortlinks.wincher.seo_performance" ] }>
							{ __( "Read more about keyphrase tracking with Wincher", "wordpress-seo" ) }
						</WincherReadMoreLink>,
					},
				} )
			}
		</p>
	);
};

export default WincherConnectExplanation;
