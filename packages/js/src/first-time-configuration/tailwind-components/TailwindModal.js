import { Dialog, Transition } from "@headlessui/react";
import { XIcon } from "@heroicons/react/outline";
import { Fragment } from "@wordpress/element";
import { __ } from "@wordpress/i18n";
import { noop } from "lodash";
import { PropTypes } from "prop-types";

/**
 * Modal component.
 *
 * @param {Object}   props                       The props.
 * @param {boolean}  props.isOpen                Whether the modal is open.
 * @param {function} [props.handleClose]         Function that is called when the user wants to close the modal.
 * @param {boolean}  [props.hasCloseButton=true] Whether the modal has a close button.
 * @param {JSX.node} props.children              Contents of the modal.
 *
 * @returns {JSX.Element} The modal element.
 */
export default function TailwindModal( { isOpen, handleClose, hasCloseButton, children } ) {
	return (
		<Transition.Root show={ isOpen } as={ Fragment }>
			<Dialog as="div" static={ true } className="yst-fixed yst-z-10 yst-inset-0 yst-overflow-y-auto" open={ isOpen } onClose={ handleClose }>
				<div
					className="yst-flex yst-items-end yst-justify-center yst-min-h-screen yst-pt-4 yst-px-4 yst-pb-20 yst-text-center sm:yst-block sm:yst-p-0"
				>
					<Transition.Child
						as={ Fragment }
						enter="yst-ease-out yst-duration-300"
						enterFrom="yst-opacity-0"
						enterTo="yst-opacity-100"
						leave="yst-ease-in yst-duration-200"
						leaveFrom="yst-opacity-100"
						leaveTo="yst-opacity-0"
					>
						<Dialog.Overlay className="yst-fixed yst-inset-0 yst-bg-gray-500 yst-bg-opacity-75 yst-transition-opacity" />
					</Transition.Child>

					{ /* This element is to trick the browser into centering the modal contents. */ }
					<span className="yst-hidden sm:yst-inline-block sm:yst-align-middle sm:yst-h-screen" aria-hidden="true">&#8203;</span>
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
							className="yst-inline-block yst-align-bottom yst-bg-white yst-rounded-lg yst-px-4 yst-pt-5 yst-pb-4 yst-text-left yst-overflow-hidden yst-shadow-xl yst-transform yst-transition-all sm:yst-my-8 sm:yst-align-middle sm:yst-max-w-lg sm:yst-w-full sm:yst-p-6"
						>
							{ hasCloseButton && <div className="yst-block yst-absolute yst-top-0 yst-right-0 yst-pt-4 yst-pr-4">
								<button
									onClick={ handleClose }
									className="yst-bg-white yst-rounded-md yst-text-gray-400 hover:yst-text-gray-500 focus:yst-outline-none focus:yst-ring-2 focus:yst-ring-offset-2 focus:yst-ring-indigo-500"
								>
									<span className="yst-sr-only">{ __( "Close", "admin-ui" ) }</span>
									<XIcon className="yst-h-6 yst-w-6" />
								</button>
							</div> }
							{ children }
						</div>
					</Transition.Child>
				</div>
			</Dialog>
		</Transition.Root>
	);
}

TailwindModal.Title = Dialog.Title;
TailwindModal.Description = Dialog.Description;

TailwindModal.propTypes = {
	isOpen: PropTypes.bool.isRequired,
	handleClose: PropTypes.func,
	hasCloseButton: PropTypes.bool,
	children: PropTypes.node.isRequired,
};

TailwindModal.defaultProps = {
	handleClose: noop,
	hasCloseButton: true,
};
