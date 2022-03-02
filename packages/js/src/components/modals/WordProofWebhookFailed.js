/* External dependencies */
import { __ } from "@wordpress/i18n";
import { useCallback } from "@wordpress/element";
import { ReactComponent as Image } from "../../../images/connection-assistant.svg";
import { NewButton as Button } from "@yoast/components";

/**
 * Creates the content for the WordProof oauth denied modal.
 *
 * @returns {wp.Element} The WordProof oauth denied modal content.
 */
const WordProofWebhookFailed = ( { closeModal } ) => {
	const retry = useCallback( ( event ) => {
		closeModal();

		event.preventDefault();
		const retryEvent = new window.CustomEvent( "wordproof:open_authentication" );
		window.dispatchEvent( retryEvent );
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
					/* translators: a link to an article is added behind this string. */
					__(
						"Find possible solutions in this",
						"wordpress-seo" )
				}
				<span> </span>
				<a
					href={ "https://help.wordproof.com/en/articles/4823201-how-do-i-whitelist-wordproof-in-cloudflare" }
					target="_blank" rel="noopener noreferrer"
				>{ __(
						"Article", "wordpress-seo" ) }</a><span>.</span>
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
				{ __( "Not working?", "wordpress-seo" ) }
				<span> </span>
				<a
					href={ "https://help.wordproof.com" } target="_blank"
					rel="noopener noreferrer"
				>{ sprintf(
					/* translators: %s expands to WordProof */
						__( "Contact %s support", "wordpress-seo" ),
						"WordProof" ) }</a>

			</div>

		</div>
	);
};

export default WordProofWebhookFailed;
