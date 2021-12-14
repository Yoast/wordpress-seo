/* External dependencies */
import { __ } from "@wordpress/i18n";

/* Yoast dependencies */
import { Alert } from "@yoast/components";

/**
 * Creates the content for the Wincher request failed modal.
 *
 * @returns {wp.Element} The Wincher request failed modal content.
 */
const WincherRequestFailed = () => {
	return (
		<Alert type="error">
			{ __(
				"Something went wrong while tracking the ranking position(s) of your page. Please try again later.",
				"wordpress-seo"
			) }
		</Alert>
	);
};

export default WincherRequestFailed;
