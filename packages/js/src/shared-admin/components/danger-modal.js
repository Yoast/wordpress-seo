import ExclamationIcon from "@heroicons/react/outline/ExclamationIcon";
import { __ } from "@wordpress/i18n";
import { Button, Modal, useSvgAria } from "@yoast/ui-library";
import { noop } from "lodash";

/**
 * Wraps the error copy below the title, applying the muted modal-description tone.
 * The message `Paragraph`s add their own top margin, so the first paragraph sits
 * just under the title.
 *
 * @param {JSX.node} children The copy (message `Body`).
 * @returns {JSX.Element} The element.
 */
export const ModalDescription = ( { children } ) => (
	<Modal.Description as="div" className="yst-mt-2 yst-text-sm yst-text-slate-500">
		{ children }
	</Modal.Description>
);

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

/**
 * A "Close" button that dismisses the modal.
 *
 * @param {object} props The props for the button, including onClose to dismiss the modal.
 * @param {function} props.onClose Dismisses the modal.
 * @returns {JSX.Element} The element.
 */
export const CloseButton = ( { onClose, ...props } ) => (
	<Button variant="secondary" onClick={ onClose } { ...props }>
		{ __( "Close", "wordpress-seo" ) }
	</Button>
);

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
