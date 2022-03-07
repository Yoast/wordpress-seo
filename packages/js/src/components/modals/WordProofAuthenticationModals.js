import { useState, useCallback, useEffect } from "@wordpress/element";
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

	/**
	 * Show oauth failed content.
	 *
	 * @returns {void} Returns no value.
	 */
	const setOauthFailed = useCallback( () => {
		setModal( "oauth:failed" );
	} );

	/**
	 * Show oauth webhook failed content.
	 *
	 * @returns {void} Returns no value.
	 */
	const setWebhookFailed = useCallback( () => {
		setModal( "webhook:failed" );
	} );

	/**
	 * Show oauth success content.
	 *
	 * @returns {void} Returns no value.
	 */
	const setOauthSuccess = useCallback( () => {
		setModal( "oauth:success" );
	} );

	/**
	 * Stop displaying the current modal.
	 *
	 * @returns {void} Returns no value.
	 */
	const closeModal = useCallback( () => {
		setModal( null );
	} );

	useEffect( () => {
		window.addEventListener( "wordproof:oauth:success", setOauthSuccess, false );

		window.addEventListener( "wordproof:oauth:failed", setOauthFailed, false );

		window.addEventListener( "wordproof:webhook:failed", setWebhookFailed, false );

		return () => {
			console.warn( "removed" );
			window.removeEventListener( "wordproof:oauth:success", setOauthSuccess, false );

			window.removeEventListener( "wordproof:oauth:failed", setOauthFailed, false );

			window.removeEventListener( "wordproof:webhook:failed", setWebhookFailed, false );
		};
	}, [] );

	/**
	 * Returns the modal title.
	 *
	 * @returns {string} The modal title.
	 */
	const getModalTitle = useCallback( () => {
		switch ( modal ) {
			case "webhook:failed":
				return __( "Connection failed", "wordpress-seo" );
			case "oauth:success":
				return __( "Connected to WordProof", "wordpress-seo" );
			default:
				return __( "WordProof authentication", "wordpress-seo" );
		}
	} );

	return (
		<>
			{ modal && (
				<Modal
					onRequestClose={ closeModal }
					additionalClassName={ "wordproof-modal" }
					title={ getModalTitle() }
				>

					{ modal === "oauth:success" && (
						<OauthSuccess closeModal={ closeModal } />
					) }

					{ modal === "oauth:failed" && (
						<OauthFailed />
					) }

					{ modal === "webhook:failed" && (
						<WebhookFailed closeModal={ closeModal } />
					) }

				</Modal>
			) }
		</>
	);
};

export default WordProofAuthenticationModals;
