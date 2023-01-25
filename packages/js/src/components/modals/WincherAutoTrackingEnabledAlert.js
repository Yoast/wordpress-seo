/* External dependencies */
import { __, sprintf } from "@wordpress/i18n";

/* Yoast dependencies */
import { Alert } from "@yoast/components";

/**
 * Creates the content for the Wincher connected alert in the admin pages.
 *
 * @returns {wp.Element} The Wincher admin connected alert.
 */
const WincherAutoTrackingEnabledAlert = () => {
	return (
		<Alert type="info">
			{
				sprintf(
					/* translators: %s: Expands to "Wincher". */
					__(
						// eslint-disable-next-line max-len
						"Automatic tracking of keyphrases is enabled. Your keyphrase(s) will automatically be tracked by %s when you publish your post.",
						"wordpress-seo"
					),
					"Wincher"
				)
			}
		</Alert>
	);
};

export default WincherAutoTrackingEnabledAlert;
