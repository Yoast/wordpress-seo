import apiFetch from "@wordpress/api-fetch";
import { useSelect } from "@wordpress/data";
import { useCallback } from "@wordpress/element";
import { __ } from "@wordpress/i18n";
import { Button } from "@yoast/ui-library";
import { noop } from "lodash";
import PropTypes from "prop-types";
import { STORE_NAME_AI } from "../../constants";
import { Body, title } from "./messages/subscription";
import { Actions, CloseButton, DangerModal, ModalDescription } from "./modal-parts";

/**
 * The subscription-required error (402, and 429 / USAGE_LIMIT_REACHED) as a danger
 * modal. Its "Refresh page" action busts the subscription cache before reloading,
 * mirroring the inline `SubscriptionError`.
 *
 * @param {string[]} [invalidSubscriptions=[]] The products with an invalid subscription.
 * @param {boolean} [isOpen=true] Whether the modal is open.
 * @param {function} [onClose=noop] Dismisses the modal.
 * @returns {JSX.Element} The element.
 */
export const SubscriptionModal = ( { invalidSubscriptions = [], isOpen = true, onClose = noop } ) => {
	const bustSubscriptionCacheEndpoint = useSelect( select => select( STORE_NAME_AI ).selectBustSubscriptionCacheEndpoint(), [] );

	const handleRefresh = useCallback( async() => {
		try {
			await apiFetch( { path: bustSubscriptionCacheEndpoint, method: "POST", parse: false } );
		} catch ( e ) {
			console.error( e );
		}
		window.location.reload();
	}, [ bustSubscriptionCacheEndpoint ] );

	return (
		<DangerModal isOpen={ isOpen } title={ title } onClose={ onClose }>
			<ModalDescription><Body invalidSubscriptions={ invalidSubscriptions } /></ModalDescription>
			<Actions>
				<CloseButton onClose={ onClose } />
				<Button variant="primary" onClick={ handleRefresh }>
					{ __( "Refresh page", "wordpress-seo" ) }
				</Button>
			</Actions>
		</DangerModal>
	);
};
SubscriptionModal.propTypes = {
	invalidSubscriptions: PropTypes.arrayOf( PropTypes.string ),
	isOpen: PropTypes.bool,
	onClose: PropTypes.func,
};
