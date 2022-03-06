/* External dependencies */
import { __, sprintf } from "@wordpress/i18n";

/**
 * Creates the content for the WordProof oauth failed modal.
 *
 * @returns {wp.Element} The WordProof oauth failed modal content.
 */
const WordProofOauthFailed = () => {
	return (
		<>
			{ sprintf(
				/* Translators: %1$s expands to WordProof. %2$s expands to WordPress" */
				__( "Something went wrong authenticating your %1$s account with the %2$s site. Please try again or contact %1$s support.",
					"wordpress-seo" ),
				"WordProof", "WordPress"
			) }
		</>
	);
};

export default WordProofOauthFailed;
