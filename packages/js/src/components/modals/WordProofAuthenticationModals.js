import { useState } from "@wordpress/element";
import { __ } from "@wordpress/i18n";

import OauthFailed from "./WordProofOauthFailed";
import OauthSuccess from "./WordProofOauthSuccess";
import WebhookFailed from "./WordProofWebhookFailed";
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
	 * @returns {void} Returns no value.
	 */
	function closeModal() {
		setModal( null );
	}

	/**
	 * Returns the modal title.
	 *
	 * @returns {string} The modal title.
	 */
	function getModalTitle() {
		switch ( modal ) {
			case "webhook:failed":
				return __( "Connection failed", "wordpress-seo" );
			case "oauth:success":
				return __( "Connected to WordProof", "wordpress-seo" );
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
						<OauthSuccess closeModal={ closeModal } />
					) }

					{ modal === "oauth:failed" && (
						<OauthFailed closeModal={ closeModal } />
					) }

					{ modal === "webhook:failed" && (
						<WebhookFailed closeModal={ closeModal } />
					) }

				</Modal>
			) }
		</>
	);
}
;

export default WordProofAuthenticationModals;
