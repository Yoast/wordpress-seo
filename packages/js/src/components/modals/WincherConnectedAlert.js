/* External dependencies */
import { __, sprintf } from "@wordpress/i18n";

/* Yoast dependencies */
import { Alert } from "@yoast/components";

/**
 * Creates the content for the Wincher connected alert in the Track SEO Performance modal.
 *
 * @returns {wp.Element} The Wincher connected alert.
 */
const WincherConnectedAlert = () => {
	return (
		<Alert type="success">
			{
				sprintf(
					/* translators: %s: Expands to "Wincher". */
					__(
						"You have successfully connected to %s! You can now track the SEO performance for the keyphrase(s) of this page.",
						"wordpress-seo"
					),
					"Wincher"
				)
			}
		</Alert>
	);
};

export default WincherConnectedAlert;
