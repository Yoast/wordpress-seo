/* External dependencies */
import { __, sprintf } from "@wordpress/i18n";

/* Yoast dependencies */
import { Alert } from "@yoast/components";

/**
 * Creates the content for the Wincher connected alert in the admin pages.
 *
 * @returns {wp.Element} The Wincher admin connected alert.
 */
const WincherAddedAllAlert = () => {
	return (
		<Alert type="success">
			{
				sprintf(
					/* translators: %s: Expands to "Wincher". */
					__(
						"Adding all your existing keyphrases to %s has completed successfully",
						"wordpress-seo"
					),
					"Wincher"
				)
			}
		</Alert>
	);
};

export default WincherAddedAllAlert;
