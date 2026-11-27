import { noop } from "lodash";
import { Body, title } from "./messages/not-enough-content";
import { Actions, CloseButton, DangerModal, ModalDescription } from "./modal-parts";

/**
 * The not-enough-content error (400 / NOT_ENOUGH_CONTENT) as a danger modal.
 *
 * @param {Object} props Component props.
 * @param {boolean} [props.isOpen=true] Whether the modal is open.
 * @param {Function} [props.onClose=noop] Dismisses the modal.
 *
 * @returns {JSX.Element} The element.
 */
export const NotEnoughContentModal = ( { isOpen = true, onClose = noop } ) => (
	<DangerModal isOpen={ isOpen } title={ title } onClose={ onClose }>
		<ModalDescription><Body /></ModalDescription>
		<Actions>
			<CloseButton onClose={ onClose } />
		</Actions>
	</DangerModal>
);
