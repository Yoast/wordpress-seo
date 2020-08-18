import { Button } from "@yoast/components/src/button/Button";
import { __, sprintf } from "@wordpress/i18n";
import { useState, useCallback } from "@wordpress/element";
import Modal from "./Modal";
import Collapsible from "../SidebarCollapsible";
import SnippetEditor from "../../containers/SnippetEditor";
import FacebookContainer from "../../containers/FacebookEditor";
import TwitterContainer from "../../containers/TwitterEditor";
import SchemaTabContainer from "../../containers/SchemaTab";
import AdvancedSettings from "../AdvancedSettings";
import PropTypes from "prop-types";

/**
 * Returns the ModalContent.
 *
 * We need this in a function since the scripData is not available earlier.
 *
 * @param {object} settings An object with settings from the store.
 *
 * @returns {array} An array of objects that can be used to render the PostSettingsModal.
 */
const modalContent = ( settings ) => [
	{
		title: __( "Google preview", "wordpress-seo" ),
		content: <SnippetEditor hasPaperStyle={ false } />,
		shouldRender: true,
	},
	{
		title: __( "Facebook preview", "wordpress-seo" ),
		content: <FacebookContainer />,
		shouldRender: window.wpseoScriptData.metabox.showSocial.facebook,
	},
	{
		title: __( "Twitter preview", "wordpress-seo" ),
		content: <TwitterContainer />,
		shouldRender: window.wpseoScriptData.metabox.showSocial.twitter,
	},
	{
		title: __( "Schema", "wordpress-seo" ),
		content: <SchemaTabContainer />,
		shouldRender: settings.displaySchemaSettings,
	},
	{
		title: __( "Advanced", "wordpress-seo" ),
		content: <AdvancedSettings />,
		shouldRender: settings.displayAdvancedTab,
	},
];

/**
 * Renders the Modal content.
 *
 * @param {object} props Children of the PostSettingsModal.
 *
 * @returns {*} Functional component that renders the content of the modal.
 */
const DrawerContainer = ( { children } ) => {
	return (
		<div className="yoast-content-container">
			{
				children.map( ( child, index ) => {
					const isOpen = index === 0;

					return (
						 child.shouldRender && (
							<Collapsible
								key={ index }
								initialIsOpen={ isOpen }
								title={ child.title }
								headingProps={ {
									level: 2,
									fontSize: "1rem",
									fontWeight: "normal",
									color: "#A4286A",
								} }
							>
								{ <div className="yoast-collapsible-content">{ child.content }</div> }
							</Collapsible>
						 )
					);
				} )
			}
		</div>
	);
};

DrawerContainer.propTypes = {
	children: PropTypes.arrayOf( PropTypes.object ).isRequired,
};

/**
 * Return the singular post type name of the current post.
 *
 * Only differentiates between posts and pages since all CPT should display post as well.
 *
 * @returns {string} Either page for pages or post for all other types.
 */
const getPostTypeName = () => {
	const postTypeName = window.wpseoAdminL10n.postTypeNameSingular.toLowerCase();
	if ( postTypeName === "page" ) {
		return postTypeName;
	}

	return "post";
};

/**
 * Returns a button in a div that can be used to open the modal.
 *
 * Warning: contains styling that is specific for the Sidebar.
 *
 * @returns {*} A button wrapped in a div.
 */
const PostSettingsModal = ( { settings } ) => {
	const [ isOpen, changeIsOpen ] = useState( false );

	const closeModal = useCallback( () => changeIsOpen( false ), [] );
	const openModal = useCallback( () => changeIsOpen( true ), [] );

	const postTypeName = getPostTypeName();

	return (
		<div
			className="yoast yoast-post-settings-modal__button-container"
		>
			{ isOpen && (
				<Modal
					title="Yoast SEO post settings"
					onRequestClose={ closeModal }
					additionalClassName="yoast-collapsible-modal yoast-post-settings-modal"
				>
					<DrawerContainer>
						{ modalContent( settings ) }
					</DrawerContainer>
					<div className="yoast-notice-container">
						<hr />
						<div className="yoast-button-container">
							<p>
								{
									/* Translators: %s translates to the Post Label in singular form */
									sprintf( __( "Make sure to save your %s for changes to take effect", "wordpress-seo" ), postTypeName )
								}
							</p>
							<Button
								className="yoast-button yoast-button--primary yoast-button--post-settings-modal"
								onClick={ closeModal }
							>
								{
									/* Translators: %s translates to the Post Label in singular form */
									sprintf( __( "Return to your %s", "wordpress-seo" ), postTypeName )
								}
							</Button>
						</div>
					</div>
				</Modal>
			) }
			<Button
				variant="edit"
				onClick={ openModal }
			>
				{
					/* Translators: %s translates to the Post Label in singular form */
					sprintf( __( "Open %s settings", "wordpress-seo" ), postTypeName )
				}
			</Button>
		</div>
	);
};

PostSettingsModal.propTypes = {
	settings: PropTypes.object.isRequired,
};

export default PostSettingsModal;
