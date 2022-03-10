import { Dialog, Transition } from "@headlessui/react";
import { XIcon } from "@heroicons/react/outline";
import { Fragment } from "@wordpress/element";
import { PropTypes } from "prop-types";
import classNames from "classnames";
import Title from "../../elements/title";

/**
 * @param {boolean} isOpen Whether the modal is open.
 * @param {function} onClose Function that is called when the user wants to close the modal.
 * @param {JSX.node} children Contents of the modal.
 * @param {boolean} [hasCloseButton=true] Whether the modal has a close button.
 * @param {boolean} [closeButtonScreenReaderText="Close"] The screenreader text of the close button.
 * @param {string} [className=""] Additional class names.
 * @returns {JSX.Element} The modal.
 */
const Modal = ( { isOpen, onClose, children, hasCloseButton, closeButtonScreenReaderText, className } ) => (
	<Transition show={ isOpen } as={ Fragment }>
		<Dialog as="div" className={classNames("yst-modal", className)} open={ isOpen } onClose={ onClose }>
			<div className="yst-modal__body">
				<Transition.Child
					as={ Fragment }
					enter="yst-ease-out yst-duration-300"
					enterFrom="yst-opacity-0"
					enterTo="yst-opacity-100"
					leave="yst-ease-in yst-duration-200"
					leaveFrom="yst-opacity-100"
					leaveTo="yst-opacity-0"
				>
					<Dialog.Overlay className="yst-modal__overlay" />
				</Transition.Child>

				{ /* This element is to trick the browser into centering the modal contents. */ }
				<span className="yst-modal__center" aria-hidden="true">&#8203;</span>
				<Transition.Child
					as={ Fragment }
					enter="yst-ease-out yst-duration-300"
					enterFrom="yst-opacity-0 yst-translate-y-4 sm:yst-translate-y-0 sm:yst-scale-95"
					enterTo="yst-opacity-100 yst-translate-y-0 sm:yst-scale-100"
					leave="yst-ease-in yst-duration-200"
					leaveFrom="yst-opacity-100 yst-translate-y-0 sm:yst-scale-100"
					leaveTo="yst-opacity-0 yst-translate-y-4 sm:yst-translate-y-0 sm:yst-scale-95"
				>
					<div
						className="yst-modal__content"
					>
						{ hasCloseButton && <div className="yst-modal__close">
							<button
								onClick={ onClose }
								className="yst-modal__close-button"
							>
								<span className="yst-sr-only">{ closeButtonScreenReaderText }</span>
								<XIcon className="yst-h-6 yst-w-6" />
							</button>
						</div> }
						{ children }
					</div>
				</Transition.Child>
			</div>
		</Dialog>
	</Transition>
);

Modal.Title = Title;
Modal.Description = Dialog.Description;

Modal.propTypes = {
	isOpen: PropTypes.bool.isRequired,
	onClose: PropTypes.func.isRequired,
	children: PropTypes.node.isRequired,
	hasCloseButton: PropTypes.bool,
	closeButtonScreenReaderText: PropTypes.string,
	className: PropTypes.string,
};

Modal.defaultProps = {
	hasCloseButton: true,
	closeButtonScreenReaderText: "Close",
	className: "",
};

export default Modal;
