import { noop } from "lodash";
import PropTypes from "prop-types";
import { Body, title } from "./messages/generic";
import { DangerModal, ModalDescription, RetryableActions } from "./modal-parts";

/**
 * The generic fallback error (400 default, 403, 503, and any unmapped code) as a
 * danger modal.
 *
 * @param {boolean} [isOpen=true] Whether the modal is open.
 * @param {boolean} [showActions=false] Whether to show the Try again / Close actions.
 * @param {function} [onRetry=noop] Retries the request.
 * @param {function} [onClose=noop] Dismisses the modal.
 * @returns {JSX.Element} The element.
 */
export const GenericModal = ( { isOpen = true, showActions = false, onRetry = noop, onClose = noop } ) => (
	<DangerModal isOpen={ isOpen } title={ title } onClose={ onClose }>
		<ModalDescription><Body /></ModalDescription>
		<RetryableActions showActions={ showActions } onRetry={ onRetry } onClose={ onClose } />
	</DangerModal>
);
GenericModal.propTypes = {
	isOpen: PropTypes.bool,
	showActions: PropTypes.bool,
	onRetry: PropTypes.func,
	onClose: PropTypes.func,
};
