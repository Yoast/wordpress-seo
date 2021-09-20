import { Dialog, Transition } from "@headlessui/react";
import { MenuAlt2Icon, XIcon } from "@heroicons/react/outline";
import { Fragment, useCallback, useState } from "@wordpress/element";
import { __ } from "@wordpress/i18n";
import PropTypes from "prop-types";
import Menu from "./menu";

/**
 * The Navigation component that will also render a top bar on smaller screens.
 *
 * @param {Object} props The props.
 * @param {Object} props.menu The menu.
 * @param {boolean} props.initialIsOpen Whether the mobile menu should initially be open or not.
 *
 * @returns {JSX.Element} The Navigation component.
 */
export default function Navigation( { menu, initialIsOpen } ) {
	const [ isOpen, setOpen ] = useState( initialIsOpen );

	const handleClose = useCallback( () => setOpen( false ), [ setOpen ] );
	const handleOpen = useCallback( () => setOpen( true ), [ setOpen ] );

	return (
		<>
			{ /* Sidebar, only toggleable on displays smaller than 768px */ }
			<Transition.Root show={ isOpen } as={ Fragment }>
				<Dialog
					as="div"
					static={ true }
					className="yst-fixed yst-inset-0 yst-z-40 yst-flex lg:yst-hidden"
					open={ isOpen }
					onClose={ setOpen }
				>
					<Transition.Child
						as={ Fragment }
						enter="yst-transition-opacity yst-ease-linear yst-duration-300"
						enterFrom="yst-opacity-0"
						enterTo="yst-opacity-100"
						leave="yst-transition-opacity yst-ease-linear yst-duration-300"
						leaveFrom="yst-opacity-100"
						leaveTo="yst-opacity-0"
					>
						<Dialog.Overlay className="yst-fixed yst-inset-0 yst-bg-gray-600 yst-bg-opacity-75" />
					</Transition.Child>
					<Transition.Child
						as={ Fragment }
						enter="yst-transition yst-ease-in-out yst-duration-300 yst-transform"
						enterFrom="yst--translate-x-full"
						enterTo="yst-translate-x-0"
						leave="yst-transition yst-ease-in-out yst-duration-300 yst-transform"
						leaveFrom="yst-translate-x-0"
						leaveTo="yst--translate-x-full"
					>
						<div className="yst-relative yst-max-w-xs yst-w-full yst-bg-white yst-flex-1 yst-flex yst-flex-col" aria-modal="true">
							<Transition.Child
								as={ Fragment }
								enter="yst-ease-in-out yst-duration-300"
								enterFrom="yst-opacity-0"
								enterTo="yst-opacity-100"
								leave="yst-ease-in-out yst-duration-300"
								leaveFrom="yst-opacity-100"
								leaveTo="yst-opacity-0"
							>
								<div className="yst-absolute yst-top-0 yst-right-0 yst--mr-14 yst-p-1">
									<button
										className="yst-h-12 yst-w-12 yst-flex yst-items-center yst-justify-center yst-rounded-full focus:yst-outline-none focus:yst-bg-gray-600"
										onClick={ handleClose }
									>
										<XIcon className="yst-h-6 yst-w-6 yst-text-white" aria-hidden="true" />
										<span className="yst-sr-only">{ __( "Close sidebar", "yoast/toolkit" ) }</span>
									</button>
								</div>
							</Transition.Child>
							<div className="yst-flex-1 yst-h-0 yst-overflow-y-auto">
								<div className="yst-h-full yst-flex yst-flex-col yst-p-4">
									<Menu
										menu={ menu }
										handleClose={ handleClose }
									/>
								</div>
							</div>
						</div>
					</Transition.Child>
					<div className="yst-flex-shrink-0 yst-w-14" aria-hidden="true">
						{ /* Dummy element to force sidebar to shrink to fit close icon */ }
					</div>
				</Dialog>
			</Transition.Root>

			{ /* Top Bar with Button, only visible on displays smaller than 768px */ }
			<div className="yst-fixed yst-top-0 yst-left-0 yst-w-full lg:yst-hidden yst-z-10 yst-flex-1 yst-flex yst-flex-col">
				<div className="yst-w-full yst-max-w-full yst-mx-auto lg:yst-px-8 xl:yst-px-0">
					<div className="yst-relative yst-z-10 yst-flex-shrink-0 yst-h-16 yst-bg-white yst-border-b yst-border-gray-200 yst-flex">
						<button
							className="yst-border-r yst-border-gray-200 yst-px-4 yst-text-gray-500 focus:yst-outline-none focus:yst-ring-2 focus:yst-ring-inset focus:yst-ring-indigo-500 lg:yst-hidden"
							onClick={ handleOpen }
						>
							<span className="yst-sr-only">{ __( "Open sidebar", "yoast/toolkit" ) }</span>
							<MenuAlt2Icon className="yst-h-6 yst-w-6" aria-hidden="true" />
						</button>

					</div>
				</div>
			</div>

			{ /* Static sidebar, only visible on displays bigger than 768px */ }
			<div className="yst-hidden lg:yst-flex lg:yst-flex-shrink-0 yst-float-left yst-mr-5">
				<div className="yst-w-64 yst-flex yst-flex-col">
					<div className="yst-flex-shrink-0 yst-w-64">
						<Menu menu={ menu } />
					</div>
				</div>
			</div>
		</>
	);
}

Navigation.propTypes = {
	menu: PropTypes.array.isRequired,
	initialIsOpen: PropTypes.bool,
};

Navigation.defaultProps = {
	initialIsOpen: false,
};
