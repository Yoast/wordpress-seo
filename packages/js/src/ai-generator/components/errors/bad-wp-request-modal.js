import { noop } from "lodash";
import PropTypes from "prop-types";
import { Body, title } from "./messages/bad-wp-request";
import { DangerModal, ModalDescription, RetryableActions } from "./modal-parts";

/**
 * The bad-WP-request error (400 / WP_HTTP_REQUEST_ERROR) as a danger modal.
 *
 * @param {string} [errorMessage=""] The raw error message returned by the request.
 * @param {boolean} [isOpen=true] Whether the modal is open.
 * @param {boolean} [showActions=false] Whether to show the Try again / Close actions.
 * @param {function} [onRetry=noop] Retries the request.
 * @param {function} [onClose=noop] Dismisses the modal.
 * @returns {JSX.Element} The element.
 */
export const BadWPRequestModal = ( { errorMessage = "", isOpen = true, showActions = false, onRetry = noop, onClose = noop } ) => (
	<DangerModal isOpen={ isOpen } title={ title } onClose={ onClose }>
		<ModalDescription><Body errorMessage={ errorMessage } /></ModalDescription>
		<RetryableActions showActions={ showActions } onRetry={ onRetry } onClose={ onClose } />
	</DangerModal>
);
BadWPRequestModal.propTypes = {
	errorMessage: PropTypes.string,
	isOpen: PropTypes.bool,
	showActions: PropTypes.bool,
	onRetry: PropTypes.func,
	onClose: PropTypes.func,
};
