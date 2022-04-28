import { ExclamationIcon } from "@heroicons/react/outline";
import { useCallback, useEffect, useState } from "@wordpress/element";
import { __ } from "@wordpress/i18n";
import PropTypes from "prop-types";
import TailwindModal from "./tailwind-modal";

/**
 * Prompt the user to save when changing route.
 *
 * Works per route, it saves the last location.
 *
 * @param {Object} props                    The props.
 * @param {bool}   props.hasUnsavedChanges  If the modal popup must be shown.
 * @param {string} props.title              The modal popup title.
 * @param {string} props.description        The message displayed in the modal popup.
 * @param {string} props.okButtonLabel      The text label for the "OK" button.
 * @param {string} props.cancelButtonLabel  The text label for the "Cancel" button.
 *
 * @returns {WPElement} The UnsavedChangesModal.
 */
export default function UnsavedChangesModal( { hasUnsavedChanges, title, description, okButtonLabel, cancelButtonLabel } ) {
	const [ modalIsOpen, setModalIsOpen ] = useState( false );
	const [ targetUrl, setTargetUrl ] = useState( "empty" );

	/**
	 * Handles the "before page unloads" event.
	 *
	 * @param {Window} event The "before page unloads" event.
	 *
	 * @returns {void}
	 */
	const beforeUnloadEventHandler = useCallback( ( event ) => {
		if ( hasUnsavedChanges ) {
			event.preventDefault();
			event.returnValue = "";
		}
	}, [ hasUnsavedChanges ] );

	/**
	 * Handles the history pop state event.
	 *
	 * @param {Window} event The pop state event.
	 *
	 * @returns {void}
	 */
	const popStateEventHandler = useCallback( () => {
		if ( hasUnsavedChanges ) {
			// Prevent browser modal popup to show on top of Yoast modal popup
			window.removeEventListener( "beforeunload", beforeUnloadEventHandler );

			// Prevent popStateEventHandler to be triggered by the history.go call
			window.removeEventListener( "popstate", popStateEventHandler );

			history.go( 1 );
			setTargetUrl( "popped" );
			setModalIsOpen( true );
		}
	}, [ hasUnsavedChanges ] );

	/**
	 * Closes the modal dialog and stays on current page.
	 *
	 * @returns {void}
	 */
	const closeModal = useCallback( () => {
		setModalIsOpen( false );
	}, [ setModalIsOpen ] );

	/**
	 * Closes the modal dialog and continues the navigation to the target page.
	 *
	 * @returns {void}
	 */
	const continueNavigation = useCallback( () => {
		if ( targetUrl === "popped" ) {
			window.removeEventListener( "popstate", popStateEventHandler );
			history.go( -2 );
		}  else {
			window.location.replace( targetUrl );
		}
	}, [ targetUrl ] );

	/**
	 * Handles the mouse click event.
	 *
	 * @param {Document} event The mouse click event.
	 *
	 * @returns {void}
	 */
	// eslint-disable-next-line complexity
	const clickEventHandler = useCallback( ( event ) => {
		if ( hasUnsavedChanges ) {
			const adminBarTarget = event.target.closest( ".ab-item" );
			if ( event.target.tagName === "A" ) {
				event.preventDefault();
				window.removeEventListener( "beforeunload", beforeUnloadEventHandler );
				setTargetUrl( event.target.href );
				setModalIsOpen( true );
			} else if ( adminBarTarget ) {
				if ( adminBarTarget.href && ! adminBarTarget.href.endsWith( "#qm-overview" ) ) {
					event.preventDefault();
					window.removeEventListener( "beforeunload", beforeUnloadEventHandler );
					setTargetUrl( adminBarTarget.href );
					setModalIsOpen( true );
				}
			} else if ( event.target.className === "wp-menu-name" ) {
				event.preventDefault();
				window.removeEventListener( "beforeunload", beforeUnloadEventHandler );
				setTargetUrl( event.target.parentElement.href );
				setModalIsOpen( true );
			}
		}
	}, [ hasUnsavedChanges ] );

	useEffect( () => {
		window.addEventListener( "popstate", popStateEventHandler );
		window.addEventListener( "beforeunload", beforeUnloadEventHandler );
		window.addEventListener( "click", clickEventHandler );

		return () => {
			window.removeEventListener( "popstate", popStateEventHandler );
			window.removeEventListener( "beforeunload", beforeUnloadEventHandler );
			window.removeEventListener( "click", clickEventHandler );
		};
	}, [ beforeUnloadEventHandler, popStateEventHandler, clickEventHandler ] );

	return (
		<TailwindModal isOpen={ modalIsOpen } handleClose={ closeModal }>
			<div className="sm:yst-flex sm:yst-items-start">
				<div
					className="yst-mx-auto yst-flex-shrink-0 yst-flex yst-items-center yst-justify-center yst-h-12 yst-w-12 yst-rounded-full yst-bg-red-100 sm:yst-mx-0 sm:yst-h-10 sm:yst-w-10"
				>
					<ExclamationIcon className="yst-h-6 yst-w-6 yst-text-red-600" aria-hidden="true" />
				</div>
				<div className="yst-mt-3 yst-text-center sm:yst-mt-0 sm:yst-ml-4 sm:yst-text-left">
					<TailwindModal.Title as="h3" className="yst-text-lg yst-leading-6 yst-font-medium yst-text-gray-900">
						{ title }
					</TailwindModal.Title>
					<div className="yst-mt-2">
						<p className="yst-text-sm yst-text-gray-500">
							{ description }
						</p>
					</div>
				</div>
			</div>

			<div className="yst-mt-8 sm:yst-mt-6 sm:yst-flex sm:yst-flex-row-reverse">
				<button
					type="button"
					className="yst-button yst-button--danger yst-w-full yst-inline-flex sm:yst-w-auto sm:yst-ml-3"
					onClick={ continueNavigation }
				>
					{ okButtonLabel }
				</button>
				<button
					type="button"
					className="yst-button yst-button--secondary yst-w-full yst-inline-flex sm:yst-w-auto sm:yst-mt-0"
					onClick={ closeModal }
				>
					{ cancelButtonLabel }
				</button>
			</div>
		</TailwindModal>
	);
}

UnsavedChangesModal.propTypes = {
	hasUnsavedChanges: PropTypes.bool.isRequired,
	title: PropTypes.string.isRequired,
	description: PropTypes.string.isRequired,
	okButtonLabel: PropTypes.string,
	cancelButtonLabel: PropTypes.string,
};

UnsavedChangesModal.defaultProps = {
	okButtonLabel: __( "Ok", "wordpress-seo" ),
	cancelButtonLabel: __( "Cancel", "wordpress-seo" ),
};
