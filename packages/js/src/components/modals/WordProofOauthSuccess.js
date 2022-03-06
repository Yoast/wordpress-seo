/* External dependencies */
import { __, sprintf } from "@wordpress/i18n";
import { createInterpolateElement } from "@wordpress/element";

/* Yoast dependencies */
import { ReactComponent as Image } from "../../../images/succes_marieke_bubble_optm.svg";
import { getWordProofSdkData } from "../../helpers/wordproof";
import { NewButton as Button } from "@yoast/components";
import PropTypes from "prop-types";

/**
 * Creates the content for the WordProof oauth success modal.
 *
 * @param {object} props Functional Component props.
 *
 * @returns {JSX.Element} The WordProof oauth success modal.
 */
const WordProofOauthSuccess = ( props ) => {
	const {
		closeModal,
	} = props;

	return (
		<>
			<div className={ "wordproof-modal-image" }>
				<Image class={ "wordproof-modal-svg__success" } />
			</div>

			<p>
				{ sprintf(
					/* Translators: %s expands to WordProof */
					__( "Your page is now protected via the blockchain!!",
						"wordpress-seo" ),
					"WordProof"
				) }
				<br />

				{
					createInterpolateElement(
						sprintf(
							__(
								/** translators:
								 * %1$s and %2$s are replaced by opening and closing <b> tags.
								 * %3$s translates to the Post type in singular form.
								 */
								"The %3$s will automatically be timestamped every time you %1$supdate%2$s or %1$spublish%2$s.",
								"wordpress-seo"
							),
							"<b>",
							"</b>",
							getWordProofSdkData( "current_post_type" )
						),
						{
							b: <b />,
						}
					)
				}

			</p>
			<div className={'wordproof-modal-action'}>
				<Button
					variant={ "primary" }
					onClick={ closeModal }
				>Continue</Button>
			</div>
		</>
	);
};

WordProofOauthSuccess.propTypes = {
	closeModal: PropTypes.func.isRequired,
};

export default WordProofOauthSuccess;
