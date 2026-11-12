import { noop } from "lodash";
import { Body, title } from "./messages/timeout";
import { DangerModal, ModalDescription, RetryableActions } from "./modal-parts";

/**
 * The connection-timeout error (408) as a danger modal.
 *
 * @param {Object} props Component props.
 * @param {boolean} [props.isOpen=true] Whether the modal is open.
 * @param {boolean} [props.showActions=false] Whether to show the Try again / Close actions.
 * @param {Function} [props.onRetry=noop] Retries the request.
 * @param {Function} [props.onClose=noop] Dismisses the modal.
 *
 * @returns {JSX.Element} The element.
 */
export const TimeoutModal = ( { isOpen = true, showActions = false, onRetry = noop, onClose = noop } ) => (
	<DangerModal isOpen={ isOpen } title={ title } onClose={ onClose }>
		<ModalDescription><Body /></ModalDescription>
		<RetryableActions showActions={ showActions } onRetry={ onRetry } onClose={ onClose } />
	</DangerModal>
);
