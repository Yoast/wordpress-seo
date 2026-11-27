/* eslint-disable complexity */
import { Fragment } from "@wordpress/element";
import { __, sprintf } from "@wordpress/i18n";
import { LocationProvider } from "@yoast/externals/contexts";
import SidebarButton from "../../SidebarButton";
import Modal from "../Modal";

/**
 * Returns a button in a div that can be used to open the modal.
 *
 * Warning: contains styling that is specific for the Sidebar.
 *
 * @param {Object} props Component props.
 * @param {string} props.id The unique identifier for the modal.
 * @param {string} props.postTypeName The post type label in singular form.
 * @param {React.ReactNode} props.children The modal content.
 * @param {string} props.title The modal title.
 * @param {boolean} props.isOpen Whether the modal is open.
 * @param {Function} props.open Function to open the modal.
 * @param {Function} props.close Function to close the modal.
 * @param {boolean} [props.shouldCloseOnClickOutside=true] Whether the modal should close when clicking outside.
 * @param {boolean} [props.showChangesWarning=true] Whether to show the changes warning.
 * @param {JSX.Element} [props.SuffixHeroIcon=null] Optional icon component.
 * @param {JSX.Element} [props.titleHelpLink=null] A help link next to the modal title. Kept out of `title`, which also
 *                                          renders in the sidebar's open button, where a nested link would be invalid.
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
	titleHelpLink = null,
} ) => (
	<Fragment>
		{ isOpen &&
			<LocationProvider value="modal">
				<Modal
					title={ titleHelpLink ? <>{ title }{ titleHelpLink }</> : title }
					/*
					 * The modal is named by its heading, so with a help link in there the link's screen reader text
					 * would become part of the modal name. Setting contentLabel keeps the name to the title alone.
					 */
					contentLabel={ titleHelpLink ? title : null }
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

export default EditorModal;
