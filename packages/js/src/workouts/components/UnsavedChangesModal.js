import { ExclamationIcon } from "@heroicons/react/outline";
import { useCallback, useEffect, useState } from "@wordpress/element";
import { __ } from "@wordpress/i18n";
import { PropTypes } from "prop-types";
import Modal from "./modal";

/* eslint-disable max-len */
/**
 * Prompt the user to save when changing route.
 *
 * Works per route, it saves the last location.
 *
 * @param {Object} props The props.
 *
 * @returns {JSX.Element} The UnsavedChangesModal.
 */
export default function UnsavedChangesModal() {
	const [ modalIsOpen, setModalIsOpen ] = useState( false );
	const [ targetUrl, setTargetUrl ] = useState( "" );

	const closeModal = useCallback( () => {
		setModalIsOpen( false );
	}, [ setModalIsOpen ] );

	const continueNavigation = useCallback( () => {
		window.location.replace( targetUrl );
	}, [ targetUrl ] );

	useEffect( () => {
		window.addEventListener( "click", ( e ) => {
			if ( e.target.tagName === "A" ) {
				e.preventDefault();
				console.log( e.target );
				setTargetUrl( e.target.href );
				setModalIsOpen( true );
			}
		} );
	}, [] );

	return (
		<Modal isOpen={ modalIsOpen } handleClose={ closeModal }>
			<div className="sm:yst-flex sm:yst-items-start">
				<div
					className="yst-mx-auto yst-flex-shrink-0 yst-flex yst-items-center yst-justify-center yst-h-12 yst-w-12 yst-rounded-full yst-bg-red-100 sm:yst-mx-0 sm:yst-h-10 sm:yst-w-10"
				>
					<ExclamationIcon className="yst-h-6 yst-w-6 yst-text-red-600" aria-hidden="true" />
				</div>
				<div className="yst-mt-3 yst-text-center sm:yst-mt-0 sm:yst-ml-4 sm:yst-text-left">
					<Modal.Title as="h3" className="yst-text-lg yst-leading-6 yst-font-medium yst-text-gray-900">
						{ __( "Unsaved changes", "admin-ui" ) }
					</Modal.Title>
					<div className="yst-mt-2">
						<p className="yst-text-sm yst-text-gray-500">
							{ __( "There are unsaved changes on this page. Leaving means that those changes will be lost. Are you sure you want to leave this page?", "admin-ui" ) }
						</p>
					</div>
				</div>
			</div>

			<div className="yst-mt-8 sm:yst-mt-6 sm:yst-flex sm:yst-flex-row-reverse">
				<button
					type="button"
					className="yst-button--danger yst-w-full yst-inline-flex sm:yst-w-auto sm:yst-ml-3"
					onClick={ continueNavigation }
				>
					{ __( "Yes, leave page", "admin-ui" ) }
				</button>
				<button
					type="button"
					className="yst-button--secondary yst-w-full yst-inline-flex sm:yst-w-auto sm:yst-mt-0"
					onClick={ closeModal }
				>
					{ __( "No, continue editing", "admin-ui" ) }
				</button>
			</div>
		</Modal>
	);
}

/* eslint-enable max-len */
