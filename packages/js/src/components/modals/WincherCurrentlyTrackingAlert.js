/* External dependencies */
import { __, sprintf } from "@wordpress/i18n";

/* Yoast dependencies */
import { Alert } from "@yoast/components";

/**
 * Creates the content for the Wincher currently tracking alert in the Track SEO Performance modal.
 *
 * @returns {wp.Element} The Wincher currently tracking alert.
 */
const WincherCurrentlyTrackingAlert = () => {
	return (
		<Alert type="info">
			{
				sprintf(
					/* translators: %s: Expands to "Wincher". */
					__(
						// eslint-disable-next-line max-len
						"%s is currently tracking the ranking position(s) of your page. This may take a few minutes. Please wait or check back later.",
						"wordpress-seo"
					),
					"Wincher"
				)
			}
		</Alert>
	);
};

export default WincherCurrentlyTrackingAlert;
