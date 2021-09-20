import { ExclamationIcon } from "@heroicons/react/outline";
import { compose } from "@wordpress/compose";
import { withDispatch, withSelect } from "@wordpress/data";
import { useCallback, useEffect, useState } from "@wordpress/element";
import { __ } from "@wordpress/i18n";
import { Modal } from "@yoast/admin-ui-toolkit/components";
import { isEqual } from "lodash";
import { PropTypes } from "prop-types";
import { Prompt, useHistory } from "react-router-dom";
import { REDUX_STORE_KEY } from "../constants";

/**
 * Prompt the user to save when changing route.
 *
 * Works per route, it saves the last location.
 *
 * @param {bool} hasUnsavedChanges Whether to block and prompt the user.
 * @param {function} handleReset Resets the unsaved data.
 *
 * @returns {JSX.Element} The UnsavedChangesPrompt.
 */
function UnsavedChangesPrompt( { hasUnsavedChanges, handleReset } ) {
	const history = useHistory();
	const [ modalIsOpen, setModalIsOpen ] = useState( false );
	const [ confirmedNavigation, setConfirmedNavigation ] = useState( false );
	const [ lastLocation, setLastLocation ] = useState( null );

	const closeModal = useCallback( () => setModalIsOpen( false ), [ setModalIsOpen ] );

	const handleBlockedNavigation = useCallback( ( nextLocation ) => {
		// Check if we are already on the requested location. If so, ignore the request.
		if ( isEqual( nextLocation, history.location ) ) {
			return false;
		}

		if ( ! confirmedNavigation ) {
			setModalIsOpen( true );
			setLastLocation( nextLocation );
			return false;
		}

		return true;
	}, [ confirmedNavigation, setModalIsOpen, setLastLocation ] );

	const handleLeavePage = useCallback( async () => {
		handleReset();
		setModalIsOpen( false );
		setConfirmedNavigation( true );
	}, [ handleReset, setModalIsOpen, setConfirmedNavigation ] );

	useEffect( () => {
		if ( confirmedNavigation && lastLocation ) {
			// Navigate to the previous blocked location with your navigate function.
			history.push( lastLocation.pathname );
		}
	}, [ confirmedNavigation, lastLocation ] );

	return (
		<>
			<Prompt when={ hasUnsavedChanges } message={ handleBlockedNavigation } />
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
						className="yst-button yst-button--danger yst-w-full yst-inline-flex sm:yst-w-auto sm:yst-ml-3"
						onClick={ handleLeavePage }
					>
						{ __( "Yes, leave page", "admin-ui" ) }
					</button>
					<button
						type="button"
						className="yst-button yst-button--secondary yst-w-full yst-inline-flex sm:yst-w-auto sm:yst-mt-0"
						onClick={ closeModal }
					>
						{ __( "No, continue editing", "admin-ui" ) }
					</button>
				</div>
			</Modal>
		</>
	);
}

UnsavedChangesPrompt.propTypes = {
	hasUnsavedChanges: PropTypes.bool.isRequired,
	handleReset: PropTypes.func.isRequired,
};

export default compose( [
	withSelect( ( select ) => {
		const { hasUnsavedChanges } = select( REDUX_STORE_KEY );

		return {
			hasUnsavedChanges: hasUnsavedChanges(),
		};
	} ),
	withDispatch( ( dispatch, _, { select } ) => {
		const { getAllSavedData } = select( REDUX_STORE_KEY );
		const { setAllData } = dispatch( REDUX_STORE_KEY );

		return {
			handleReset: () => setAllData( getAllSavedData() ),
		};
	} ),
] )( UnsavedChangesPrompt );
