/* External dependencies */
import { __ } from "@wordpress/i18n";

/* Yoast dependencies */
import { Alert } from "@yoast/components";

/**
 * Creates the content for the SEMrush request failed modal.
 *
 * @returns {wp.Element} The SEMrush request failed modal content.
 */
const SEMrushRequestFailed = () => {
	return (
		<Alert type="error">
			{ __(
				"We've encountered a problem trying to get related keyphrases. Please try again later.",
				"wordpress-seo"
			) }
		</Alert>
	);
};

export default SEMrushRequestFailed;
