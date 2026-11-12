import { Actions, CloseButton } from "../../../shared-admin/components/danger-modal";
import { __ } from "@wordpress/i18n";
import { Button } from "@yoast/ui-library";

/**
 * The action row for retryable errors: always a Close button, plus a Try again
 * when `showActions` is set (a retryable context such as a timeout or a failed
 * request). The Close mirrors the always-available top-right dismiss.
 *
 * @param {Object} props Component props.
 * @param {boolean} [props.showActions=false] Whether to add the Try again button.
 * @param {Function} props.onRetry Retries the request.
 * @param {Function} props.onClose Dismisses the modal.
 *
 * @returns {JSX.Element} The element.
 */
export const RetryableActions = ( { showActions = false, onRetry, onClose } ) => (
	<Actions>
		<CloseButton onClose={ onClose } />
		{ showActions && (
			<Button variant="primary" onClick={ onRetry }>
				{ __( "Try again", "wordpress-seo" ) }
			</Button>
		) }
	</Actions>
);

export { DangerModal, CloseButton, Actions, ModalDescription } from "../../../shared-admin/components/danger-modal";
