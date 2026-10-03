import { noop } from "lodash";
import PropTypes from "prop-types";
import { Body, title } from "./messages/unethical-request";
import { Actions, CloseButton, DangerModal, ModalDescription } from "./modal-parts";

/**
 * The content-filter error (400 / AI_CONTENT_FILTER) as a danger modal.
 * It offers no retry: the request itself is the problem.
 *
 * @param {boolean} [isOpen=true] Whether the modal is open.
 * @param {function} [onClose=noop] Dismisses the modal.
 * @returns {JSX.Element} The element.
 */
export const UnethicalRequestModal = ( { isOpen = true, onClose = noop } ) => (
	<DangerModal isOpen={ isOpen } title={ title } onClose={ onClose }>
		<ModalDescription><Body /></ModalDescription>
		<Actions>
			<CloseButton onClose={ onClose } />
		</Actions>
	</DangerModal>
);
UnethicalRequestModal.propTypes = {
	isOpen: PropTypes.bool,
	onClose: PropTypes.func,
};
