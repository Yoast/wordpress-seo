import { useState } from "@wordpress/element";

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
		"wordproof:oauth:denied",
		() => {
			setModal( "oauth:denied" );
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

	return (
		<>
			{ modal && (
				<Modal
					onRequestClose={ closeModal }
					   style={ { maxWidth: "600px" } }
				>

					{ modal === "oauth:success" && (
						<OauthSuccessModal />
					) }

					{ modal === "oauth:denied" && (
						<OauthDeniedModal onDismissed={ closeModal } />
					) }

					{ modal === "oauth:failed" && (
						<OauthFailedModal onDismissed={ closeModal } />
					) }

					{ modal === "webhook:failed" && (
						<WebhookFailedModal onDismissed={ closeModal } />
					) }

				</Modal>
			) }
		</>
	);
}
;

export default WordProofAuthenticationModals;
