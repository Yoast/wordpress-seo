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
const WincherExplanation = () => {
	const message = sprintf(
		__(
			/* translators: %1$s expands to a link to Wincher, %2$s expands to a link to the keyphrase tracking article on Yoast.com */
			"With %1$s you can track the ranking position of your page in the search results based on your keyphrase(s). %2$s",
			"wordpress-seo"
		),
		"{{wincherLink/}}",
		"{{wincherReadMoreLink/}}"
	);

	return (
		<p>
			{
				interpolateComponents( {
					mixedString: message,
					components: {
						wincherLink: <WincherLink href={ "https://google.com" }>
							Wincher
						</WincherLink>,
						wincherReadMoreLink: <WincherReadMoreLink href={ "https://google.com" }>
							{ __( "Read more about keyphrase tracking with Wincher", "wordpress-seo" ) }
						</WincherReadMoreLink>,
					},
				} )
			}
		</p>
	);
};

export default WincherExplanation;
