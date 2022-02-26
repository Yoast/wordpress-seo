/* External dependencies */
import { __ } from "@wordpress/i18n";

/**
 * Creates the content for the WordProof oauth denied modal.
 *
 * @returns {wp.Element} The WordProof oauth denied modal content.
 */
const WordProofWebhookFailed = () => {
	return (
		<>
			{ sprintf( __(
				"The timestamp is not retrieved by your site. Please try again or contact %s support.",
				"wordpress-seo", "WordProof")
			) }
		</>
	);
};

export default WordProofWebhookFailed;
