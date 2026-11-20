import { noop } from "lodash";
import { Body, title } from "./messages/upgrade";
import { Actions, CloseButton, DangerModal, ModalDescription } from "./modal-parts";

/**
 * The outdated-version error (410) as a danger modal. It offers no retry:
 * the user must upgrade the plugin first.
 *
 * @param {Object} props Component props.
 * @param {boolean} [props.isOpen=true] Whether the modal is open.
 * @param {Function} [props.onClose=noop] Dismisses the modal.
 *
 * @returns {JSX.Element} The element.
 */
export const UpgradeModal = ( { isOpen = true, onClose = noop } ) => (
	<DangerModal isOpen={ isOpen } title={ title } onClose={ onClose }>
		<ModalDescription><Body /></ModalDescription>
		<Actions>
			<CloseButton onClose={ onClose } />
		</Actions>
	</DangerModal>
);
