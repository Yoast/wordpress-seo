import ExclamationIcon from "@heroicons/react/outline/ExclamationIcon";
import { __ } from "@wordpress/i18n";
import { Button, Modal, useSvgAria } from "@yoast/ui-library";
import { noop } from "lodash";
import PropTypes from "prop-types";

/**
 * Wraps the error copy below the title, applying the muted modal-description tone.
 * The message `Paragraph`s add their own top margin, so the first paragraph sits
 * just under the title.
 *
 * @param {JSX.node} children The copy (message `Body`).
 * @returns {JSX.Element} The element.
 */
export const ModalDescription = ( { children } ) => (
	<div className="yst-mt-1 yst-text-sm yst-text-slate-500">
		{ children }
	</div>
);
ModalDescription.propTypes = { children: PropTypes.node.isRequired };

/**
 * The button row shown at the bottom of an error modal.
 *
 * @param {JSX.node} children The buttons.
 * @returns {JSX.Element} The element.
 */
export const Actions = ( { children } ) => (
	<div className="yst-mt-6 yst-flex yst-flex-row yst-justify-end yst-gap-3">
		{ children }
	</div>
);
Actions.propTypes = { children: PropTypes.node.isRequired };

/**
 * A "Close" button that dismisses the modal.
 *
 * @param {function} onClose Dismisses the modal.
 * @returns {JSX.Element} The element.
 */
export const CloseButton = ( { onClose } ) => (
	<Button variant="secondary" onClick={ onClose }>
		{ __( "Close", "wordpress-seo" ) }
	</Button>
);
CloseButton.propTypes = { onClose: PropTypes.func.isRequired };

/**
 * The action row for retryable errors: always a Close button, plus a Try again
 * when `showActions` is set (a retryable context such as a timeout or a failed
 * request). The Close mirrors the always-available top-right dismiss.
 *
 * @param {boolean} [showActions=false] Whether to add the Try again button.
 * @param {function} onRetry Retries the request.
 * @param {function} onClose Dismisses the modal.
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
RetryableActions.propTypes = {
	showActions: PropTypes.bool,
	onRetry: PropTypes.func.isRequired,
	onClose: PropTypes.func.isRequired,
};

/**
 * The "Danger modal" shell every AI error shares: a centered modal panel with the
 * rose-circle outline exclamation icon, the resolved title, and a dismiss control.
 *
 * @param {boolean} isOpen Whether the modal is open.
 * @param {string} title The modal title.
 * @param {function} [onClose=noop] Dismisses the modal.
 * @param {JSX.node} children The modal body (copy + actions).
 * @returns {JSX.Element} The element.
 */
export const DangerModal = ( { isOpen, title, onClose = noop, children } ) => {
	const svgAriaProps = useSvgAria();

	return (
		<Modal isOpen={ isOpen } onClose={ onClose }>
			<Modal.Panel className="yst-max-w-lg" closeButtonScreenReaderText={ __( "Dismiss", "wordpress-seo" ) }>
				{ /*
					* An unconditional row (icon | title + body), not the `sm:`-gated
					* stack-then-row other danger modals use. This modal is portaled inside
					* the block editor, where the viewport `sm` breakpoint does not match
					* reliably; gating the layout on it leaves the modal stuck stacked and
					* centered. Mirrors `ReplaceContentModal`, which renders in the same context.
					*/ }
				<div className="yst-flex yst-items-start yst-gap-4">
					<div className="yst-flex-shrink-0 yst-flex yst-items-center yst-justify-center yst-h-10 yst-w-10 yst-rounded-full yst-bg-red-100">
						<ExclamationIcon className="yst-h-6 yst-w-6 yst-text-red-600" { ...svgAriaProps } />
					</div>
					<div className="yst-text-start yst-flex-1 yst-min-w-0">
						<Modal.Title className="yst-text-lg yst-leading-6 yst-font-medium yst-text-slate-900">
							{ title }
						</Modal.Title>
						{ children }
					</div>
				</div>
			</Modal.Panel>
		</Modal>
	);
};
DangerModal.propTypes = {
	isOpen: PropTypes.bool.isRequired,
	title: PropTypes.string.isRequired,
	onClose: PropTypes.func,
	children: PropTypes.node.isRequired,
};
