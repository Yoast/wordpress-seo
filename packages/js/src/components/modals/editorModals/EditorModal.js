/* eslint-disable complexity */
import { Fragment } from "@wordpress/element";
import { __, sprintf } from "@wordpress/i18n";
import { LocationProvider } from "@yoast/externals/contexts";
import PropTypes from "prop-types";
import SidebarButton from "../../SidebarButton";
import Modal from "../Modal";

/**
 * Returns a button in a div that can be used to open the modal.
 *
 * Warning: contains styling that is specific for the Sidebar.
 *
 * @param {string} id The unique identifier for the modal.
 * @param {string} postTypeName The post type label in singular form.
 * @param {React.ReactNode} children The modal content.
 * @param {string} title The modal title.
 * @param {boolean} isOpen Whether the modal is open.
 * @param {Function} open Function to open the modal.
 * @param {Function} close Function to close the modal.
 * @param {boolean} [shouldCloseOnClickOutside=true] Whether the modal should close when clicking outside.
 * @param {boolean} [showChangesWarning=true] Whether to show the changes warning.
 * @param {JSX.Element} [SuffixHeroIcon=null] Optional icon component.
 *
 * @returns {JSX.Element} The modal and its open button.
 */
const EditorModal = ( {
	id,
	postTypeName,
	children,
	title,
	isOpen,
	open,
	close,
	shouldCloseOnClickOutside = true,
	showChangesWarning = true,
	SuffixHeroIcon = null,
} ) => (
	<Fragment>
		{ isOpen &&
			<LocationProvider value="modal">
				<Modal
					title={ title }
					onRequestClose={ close }
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
							{ showChangesWarning && <p>
								{
									/* Translators: %s translates to the Post Label in singular form */
									sprintf( __( "Make sure to save your %s for changes to take effect", "wordpress-seo" ), postTypeName )
								}
							</p> }
							<button
								className="yoast-button yoast-button--primary yoast-button--post-settings-modal"
								type="button"
								onClick={ close }
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
			SuffixHeroIcon={ SuffixHeroIcon }
			// Fall back to the pencil square SVG icon if no hero icon has been passed.
			suffixIcon={ SuffixHeroIcon ? null : { size: "20px", icon: "pencil-square" } }
			onClick={ open }
		/>
	</Fragment>
);

EditorModal.propTypes = {
	id: PropTypes.string.isRequired,
	postTypeName: PropTypes.string.isRequired,
	children: PropTypes.oneOfType( [ PropTypes.node, PropTypes.arrayOf( PropTypes.node ) ] ).isRequired,
	title: PropTypes.string.isRequired,
	isOpen: PropTypes.bool.isRequired,
	open: PropTypes.func.isRequired,
	close: PropTypes.func.isRequired,
	shouldCloseOnClickOutside: PropTypes.bool,
	showChangesWarning: PropTypes.bool,
	SuffixHeroIcon: PropTypes.element,
};

export default EditorModal;
