import { noop } from "lodash";
import { Body, title } from "./messages/bad-wp-request";
import { DangerModal, ModalDescription, RetryableActions } from "./modal-parts";

/**
 * The bad-WP-request error (400 / WP_HTTP_REQUEST_ERROR) as a danger modal.
 *
 * @param {Object} props Component props.
 * @param {string} [props.errorMessage=""] The raw error message returned by the request.
 * @param {boolean} [props.isOpen=true] Whether the modal is open.
 * @param {boolean} [props.showActions=false] Whether to show the Try again / Close actions.
 * @param {Function} [props.onRetry=noop] Retries the request.
 * @param {Function} [props.onClose=noop] Dismisses the modal.
 *
 * @returns {JSX.Element} The element.
 */
export const BadWPRequestModal = ( { errorMessage = "", isOpen = true, showActions = false, onRetry = noop, onClose = noop } ) => (
	<DangerModal isOpen={ isOpen } title={ title } onClose={ onClose }>
		<ModalDescription><Body errorMessage={ errorMessage } /></ModalDescription>
		<RetryableActions showActions={ showActions } onRetry={ onRetry } onClose={ onClose } />
	</DangerModal>
);
