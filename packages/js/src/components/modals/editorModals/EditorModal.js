import { __, sprintf } from "@wordpress/i18n";
import { useCallback, Fragment } from "@wordpress/element";
import Modal from "../Modal";
import PropTypes from "prop-types";
import { intersection } from "lodash";
import SidebarButton from "../../SidebarButton";
import { LocationProvider } from "@yoast/externals/contexts";

/**
 * Returns false for events passed to onRequestClose, that should not lead to the modal closing.
 * Returns true for events that indeed should lead to the modal closing.
 *
 * @param {Event} event The event that was passed to onRequestClose.
 *
 * @returns {boolean} False when this event should not lead to closing to modal. True otherwise.
 */
export const isCloseEvent = ( event ) => {
	let shouldClose = true;
	if ( event.type === "blur" ) {
		// Catch any blur events that are not supposed to blur to modal, by identifying the clicked item.
		const { relatedTarget } = event;

		// Blur events to a non-focusable HTML element do not have a relatedTarget.
		if ( relatedTarget ) {
			// Modal should not close if the modal blurs because the media modal is clicked
			const mediaModalClasses = [ "media-modal", "wp-core-ui" ];
			shouldClose = intersection( mediaModalClasses, Array.from( relatedTarget.classList ) ).length !== mediaModalClasses.length;
		}
	}

	return shouldClose;
};

/**
 * Returns a button in a div that can be used to open the modal.
 *
 * Warning: contains styling that is specific for the Sidebar.
 *
 * @returns {*} A button wrapped in a div.
 */
const EditorModal = ( { id, postTypeName, children, title, isOpen, close, open, shouldCloseOnClickOutside } ) => {
	const requestClose = useCallback( ( event ) => {
		// Prevent the modal from closing when the event is a false positive.
		if ( ! isCloseEvent( event ) ) {
			return;
		}

		close();
	}, [ close ] );

	return (
		<Fragment>
			{ isOpen &&
				<LocationProvider value="modal">
					<Modal
						title={ title }
						onRequestClose={ requestClose }
						additionalClassName="yoast-collapsible-modal yoast-post-settings-modal"
						id="id"
						shouldCloseOnClickOutside={ shouldCloseOnClickOutside }
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
									onClick={ requestClose }
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
			}
			<SidebarButton
				id={ id + "-open-button" }
				title={ title }
				suffixIcon={ { size: "20px", icon: "pencil-square" } }
				onClick={ open }
			/>
		</Fragment>
	);
};

EditorModal.propTypes = {
	id: PropTypes.string.isRequired,
	postTypeName: PropTypes.string.isRequired,
	children: PropTypes.oneOfType( [ PropTypes.node, PropTypes.arrayOf( PropTypes.node ) ] ).isRequired,
	title: PropTypes.string.isRequired,
	isOpen: PropTypes.bool.isRequired,
	open: PropTypes.func.isRequired,
	close: PropTypes.func.isRequired,
	shouldCloseOnClickOutside: PropTypes.bool,
};

EditorModal.defaultProps = {
	shouldCloseOnClickOutside: true,
};

export default EditorModal;
