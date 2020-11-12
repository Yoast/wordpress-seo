import { __, sprintf } from "@wordpress/i18n";
import { useState, useCallback, Fragment } from "@wordpress/element";
import Modal from "../Modal";
import PropTypes from "prop-types";
import SidebarButton from "../../SidebarButton";
import { LocationProvider } from "../../contexts/location";

/**
 * Returns false for events passed to onRequestClose, that should not lead to the modal closing.
 * Returns true for events that indeed should lead to the modal closing.
 *
 * @param {Event} event The event that was passed to onRequestClose.
 *
 * @returns {boolean} False when this event should not lead to closing to modal. True otherwise.
 */
const isCloseEvent = ( event ) => {
	if ( event.type === "blur" ) {
		// The blur event type should only close the modal when the screen overlay is clicked.
		if ( event.relatedTarget && event.relatedTarget.querySelector( ".components-modal__screen-overlay" ) ) {
			return true;
		}
		return false;
	}

	return true;
};

/**
 * Returns a button in a div that can be used to open the modal.
 *
 * Warning: contains styling that is specific for the Sidebar.
 *
 * @returns {*} A button wrapped in a div.
 */
const EditorModal = ( { postTypeName, children, title } ) => {
	const [ isOpen, changeIsOpen ] = useState( false );

	const closeModal = useCallback( ( event ) => {
		// Prevent the modal from closing when the event is a false positive.
		if ( ! isCloseEvent( event ) ) {
			return;
		}

		changeIsOpen( false );
	}, [] );
	const openModal = useCallback( () => changeIsOpen( true ), [] );

	return (
		<Fragment>
			{ isOpen && (
				<LocationProvider value="modal">
					<Modal
						title={ title }
						onRequestClose={ closeModal }
						additionalClassName="yoast-collapsible-modal yoast-post-settings-modal"
					>
						<div className="yoast-content-container">
							<div className="yoast-modal-content">
								{ children }
							</div>
						</div>
						<div className="yoast-notice-container">
							<hr />
							<div className="yoast-button-container">
								<p>
									{
										/* Translators: %s translates to the Post Label in singular form */
										sprintf( __( "Make sure to save your %s for changes to take effect", "wordpress-seo" ), postTypeName )
									}
								</p>
								<button
									className="yoast-button yoast-button--primary yoast-button--post-settings-modal"
									type="button"
									onClick={ closeModal }
								>
									{
										/* Translators: %s translates to the Post Label in singular form */
										sprintf( __( "Return to your %s", "wordpress-seo" ), postTypeName )
									}
								</button>
							</div>
						</div>
					</Modal>
				</LocationProvider>
			) }
			<SidebarButton
				title={ title }
				suffixIcon={ { size: "20px", icon: "pencil-square" } }
				onClick={ openModal }
			/>
		</Fragment>
	);
};

EditorModal.propTypes = {
	postTypeName: PropTypes.string.isRequired,
	children: PropTypes.oneOfType( [ PropTypes.node, PropTypes.arrayOf( PropTypes.node ) ] ).isRequired,
	title: PropTypes.string.isRequired,
};

export default EditorModal;
