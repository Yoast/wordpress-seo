import { noop } from "lodash";
import { Body, title } from "./messages/unethical-request";
import { Actions, CloseButton, DangerModal, ModalDescription } from "./modal-parts";

/**
 * The content-filter error (400 / AI_CONTENT_FILTER) as a danger modal.
 * It offers no retry: the request itself is the problem.
 *
 * @param {Object} props Component props.
 * @param {boolean} [props.isOpen=true] Whether the modal is open.
 * @param {Function} [props.onClose=noop] Dismisses the modal.
 *
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
