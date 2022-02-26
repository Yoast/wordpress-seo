/* External dependencies */
import { __ } from "@wordpress/i18n";

/**
 * Creates the content for the WordProof oauth denied modal.
 *
 * @returns {wp.Element} The WordProof oauth denied modal content.
 */
const WordProofOauthDenied = () => {
	return (
		<>
			{ __(
				"Something went wrong authenticating your WordProof account with the WordPress site. Please try again or contact WordProof support.",
				"wordpress-seo"
			) }
		</>
	);
};

export default WordProofOauthDenied;
