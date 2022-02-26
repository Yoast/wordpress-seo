/* External dependencies */
import { __, sprintf } from "@wordpress/i18n";

/* Yoast dependencies */
import { ReactComponent as WordProofConnectedImage } from "../../../images/succes_marieke_bubble_optm.svg";
import {getWordProofSdkData} from '../../helpers/wordproof';

/**
 * Creates the content for the WordProof oauth success modal.
 *
 * @returns {wp.Element} The WordProof oauth success modal.
 */
const WordProofOauthSuccess = () => {
	return (
		<>
			<div
				style={ {
					display: "flex",
					justifyContent: "center",
					marginBlock: "40px",
				} }
			>
				<WordProofConnectedImage style={ { width: "175px" } } />
			</div>

			<p>
				{ sprintf(
				/* Translators: %s expands to WordProof */
					__( "You have successfully connected to %s!",
						"wordpress-seo" ),
					"WordProof"
				) }
				<br />
				{ sprintf(
				/* Translators: %s translates to the Post type in singular form */
					__( "This %s will be timestamped as soon as you publish or update it.",
						"wordpress-seo" ), getWordProofSdkData('current_post_type')
				) }
			</p>
		</>
	);
};

export default WordProofOauthSuccess;
