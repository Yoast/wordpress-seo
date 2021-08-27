/* External dependencies */
import { __, sprintf } from "@wordpress/i18n";

/* Yoast dependencies */
import { Alert } from "@yoast/components";

/**
 * Creates the content for the Wincher currently tracking alert in the Track SEO Performance modal.
 *
 * @returns {wp.Element} The Wincher currently tracking alert.
 */
const WincherNoTrackedKeyphrasesAlert = () => {
	return (
		<Alert type="warning">
			{
				sprintf(
					/* translators: %s: Expands to "Wincher". */
					__(
						"Your %s account does not contain any keyphrases for this website yet. ",
						"wordpress-seo"
					),
					"Wincher"
				)
			}
		</Alert>
	);
};

export default WincherNoTrackedKeyphrasesAlert;
