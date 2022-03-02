import { useState } from "@wordpress/element";
import { __ } from "@wordpress/i18n";

import OauthDeniedModal from "./WordProofOauthDenied";
import OauthFailedModal from "./WordProofOauthFailed";
import OauthSuccessModal from "./WordProofOauthSuccess";
import WebhookFailedModal from "./WordProofWebhookFailed";
import Modal from "./Modal";

/**
 * Displays appropriate WordProof modal on event.
 *
 * @returns {JSX.Element} Returns the React element
 * @constructor
 */
const WordProofAuthenticationModals = () => {
	const [ modal, setModal ] = useState( null );

	window.addEventListener(
		"wordproof:oauth:success",
		() => {
			setModal( "oauth:success" );
		},
		false
	);

	window.addEventListener(
		"wordproof:oauth:failed",
		() => {
			setModal( "oauth:failed" );
		},
		false
	);

	window.addEventListener(
		"wordproof:webhook:failed",
		() => {
			setModal( "webhook:failed" );
		},
		false
	);

	/**
	 * Stop displaying the current modal.
	 *
	 * @returns void
	 */
	function closeModal() {
		setModal( null );
	}

	/**
	 * Return the modal title.
	 *
	 * @returns string
	 */
	function getModalTitle() {
		switch ( modal ) {
			case "webhook:failed":
				return __( "Connection failed", "wordpress-seo" );
			default:
				return __( "WordProof authentication", "wordpress-seo" );
		}
	}

	return (
		<>
			{ modal && (
				<Modal
					onRequestClose={ closeModal }
					   style={ { maxWidth: "380px" } }
					title={ getModalTitle() }
				>

					{ modal === "oauth:success" && (
						<OauthSuccessModal closeModal={ closeModal } />
					) }

					{ modal === "oauth:failed" && (
						<OauthFailedModal closeModal={ closeModal } />
					) }

					{ modal === "webhook:failed" && (
						<WebhookFailedModal closeModal={ closeModal } />
					) }

				</Modal>
			) }
		</>
	);
}
;

export default WordProofAuthenticationModals;
