/* External dependencies */
import { __ } from "@wordpress/i18n";

/* Yoast dependencies */
import { Alert } from "@yoast/components";

/**
 * Creates the content for the WordProof oauth denied modal.
 *
 * @returns {wp.Element} The WordProof oauth denied modal content.
 */
const WordProofWebhookFailed = () => {
	return (
		<>
			{ __(
				"The timestamp is not retrieved by your site. Please try again or contact WordProof support.",
				"wordpress-seo"
			) }
		</>
	);
};

export default WordProofWebhookFailed;
