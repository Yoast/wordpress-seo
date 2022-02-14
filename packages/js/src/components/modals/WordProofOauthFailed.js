/* External dependencies */
import { __ } from "@wordpress/i18n";

/* Yoast dependencies */
import { Alert } from "@yoast/components";

/**
 * Creates the content for the WordProof oauth failed modal.
 *
 * @returns {wp.Element} The WordProof oauth failed modal content.
 */
const WordProofOauthFailed = () => {
	return (
		<>
			{ __(
				"Something went wrong authenticating your WordProof account with the WordPress site. Please try again or contact WordProof support.",
				"wordpress-seo"
			) }
		</>
	);
};

export default WordProofOauthFailed;
