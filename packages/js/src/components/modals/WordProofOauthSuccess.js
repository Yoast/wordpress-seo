/* External dependencies */
import { __, sprintf } from "@wordpress/i18n";

/* Yoast dependencies */
import { ReactComponent as Image } from "../../../images/succes_marieke_bubble_optm.svg";
import { getWordProofSdkData } from "../../helpers/wordproof";
import { NewButton as Button } from "@yoast/components";

/**
 * Creates the content for the WordProof oauth success modal.
 *
 * @returns {wp.Element} The WordProof oauth success modal.
 */
const WordProofOauthSuccess = ( { closeModal } ) => {
	return (
		<>
			<div
				style={ {
					display: "flex",
					justifyContent: "center",
					marginBlock: "40px",
				} }
			>
				<Image style={ { width: "175px" } } />
			</div>

			<p style={ { textAlign: "center" } }>
				{ sprintf(
					/* Translators: %s expands to WordProof */
					__( "Your page is now protected via the blockchain!!",
						"wordpress-seo" ),
					"WordProof"
				) }
				<br />
				{ sprintf(
					/* Translators: %s translates to the Post type in singular form. The sentence continues with "update or publish." */
					__( "The %s will automatically be timestamped every time you",
						"wordpress-seo" ),
					getWordProofSdkData( "current_post_type" )
				) }
				<span>&nbsp;</span>
				<strong>{ __( "update", "wordpress-seo" ) }</strong>
				<span>&nbsp;</span>
				{ __( "or", "wordpress-seo" ) }
				<span>&nbsp;</span>
				<strong>{ __( "publish", "wordpress-seo" ) }</strong>
				<span>.</span>
			</p>
			<div style={ { display: "flex", justifyContent: "center" } }>
				<Button
					variant={ "primary" }
					onClick={ closeModal }
				>Continue</Button>
			</div>
		</>
	);
};

export default WordProofOauthSuccess;
