import { noop } from "lodash";
import { Body, title } from "./messages/rate-limit";
import { Actions, CloseButton, DangerModal, ModalDescription } from "./modal-parts";

/**
 * The rate-limit error (429, without USAGE_LIMIT_REACHED) as a danger modal.
 * It offers no retry: the user must pace their requests.
 *
 * @param {Object} props Component props.
 * @param {boolean} [props.isOpen=true] Whether the modal is open.
 * @param {Function} [props.onClose=noop] Dismisses the modal.
 *
 * @returns {JSX.Element} The element.
 */
export const RateLimitModal = ( { isOpen = true, onClose = noop } ) => (
	<DangerModal isOpen={ isOpen } title={ title } onClose={ onClose }>
		<ModalDescription><Body /></ModalDescription>
		<Actions>
			<CloseButton onClose={ onClose } />
		</Actions>
	</DangerModal>
);
