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
 * @returns {*} A button wrapped in a div.
 */
const EditorModal = ( { id, postTypeName, children, title, isOpen, close, open, shouldCloseOnClickOutside, showChangesWarning, SuffixHeroIcon } ) => (
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
	SuffixHeroIcon: PropTypes.object,
};

EditorModal.defaultProps = {
	shouldCloseOnClickOutside: true,
	showChangesWarning: true,
};

export default EditorModal;
