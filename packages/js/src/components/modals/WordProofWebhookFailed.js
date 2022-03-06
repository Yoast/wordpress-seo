/* External dependencies */
import { __, sprintf } from "@wordpress/i18n";
import { useCallback } from "@wordpress/element";
import { ReactComponent as Image } from "../../../images/connection-assistant.svg";
import { NewButton as Button } from "@yoast/components";
import PropTypes from "prop-types";
import {openAuthentication} from '../../helpers/wordproof';
import { addLinkToString } from "../../helpers/stringHelpers.js";

/**
 * Creates the content for the WordProof oauth denied modal.
 *
 * @param {object} props Functional Component props.
 *
 * @returns {JSX.Element} The WordProof oauth denied modal content.
 *
 * @constructor
 */
const WordProofWebhookFailed = ( props ) => {
	const {
		closeModal,
	} = props;

	const retry = useCallback( ( event ) => {
		closeModal();

		event.preventDefault();
		openAuthentication();
	} );

	return (
		<div style={ { textAlign: "center" } }>
			<div
				style={ {
					display: "flex",
					justifyContent: "center",
					marginBlock: "40px",
				} }
			>
				<Image style={ { width: "100%" } } />
			</div>

			<div style={ { marginBottom: "40px" } }>
				{ __(
					"There was a connection problem. This could be because your third party connections are blocked.",
					"wordpress-seo" )
				}
				<br />

				{
					addLinkToString(
						sprintf(
							__(
								"Find possible solutions in this %1$sArticle%2$s.",
								"wordpress-seo"
							),
							"<a>",
							"</a>"
						),
						"https://help.wordproof.com/en/articles/4823201-how-do-i-whitelist-wordproof-in-cloudflare"
					)
				}
			</div>


			<div style={ { marginBottom: "10px" } }>
				<Button
					variant={ "secondary" }
					style={ { paddingLeft: "20px", paddingRight: "20px" } }
					onClick={ retry }
				>{ __(
						"Try again",
						"wordpress-seo" ) }</Button>
			</div>

			<div>
				{
					addLinkToString(
						sprintf(
							// translators: %1$s and %2$s are replaced by opening and closing <a> tags. %3$s expands to WordProof.
							__(
								"Not working? %1$sContact %3$s support%2$s.",
								"wordpress-seo"
							),
							"<a>",
							"</a>",
							"WordProof"
						),
						"https://help.wordproof.com"
					)
				}

			</div>

		</div>
	);
};

WordProofWebhookFailed.propTypes = {
	closeModal: PropTypes.func.isRequired,
};

export default WordProofWebhookFailed;
