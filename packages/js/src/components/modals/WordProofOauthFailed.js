/* External dependencies */
import { __, sprintf } from "@wordpress/i18n";
import { addLinkToString } from "../../helpers/stringHelpers";

/**
 * Creates the content for the WordProof oauth failed modal.
 *
 * @returns {wp.Element} The WordProof oauth failed modal content.
 */
const WordProofOauthFailed = () => {
	return (
		<>
			<p>
				{
					addLinkToString(
						sprintf(
							/* translators: 1: Opening a html tag, 2: Closing a html tag. 3: WordProof. 4. WordPress */
							__(
								"Something went wrong authenticating your %3$s account with the %4$s site. Please try again or contact %1$s%3$s support%2$s.",
								"wordpress-seo"
							),
							"<a>",
							"</a>",
							"WordProof",
							"WordPress"
						),
						"https://help.wordproof.com/"
					)
				}
			</p>
		</>
	);
};

export default WordProofOauthFailed;
