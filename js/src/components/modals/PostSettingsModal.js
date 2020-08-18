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

/**
 * Container for the button.
 *
 * Sets the flex-direction to column to make the button full-width.
 */
const ButtonAndModalContainer = styled.div`
	padding: 16px;
	display: flex;
	flex-direction: column;
	border-bottom: var(--yoast-border-default);
	width: 100%;
`;

const ContentContainer = styled.div`
	padding: 16px;
	border-top: var(--yoast-border-default);
`;

const ModalContent = [
	{ title: "Google preview", content: <SnippetEditor hasPaperStyle={ false } /> },
	{ title: "Facebook preview", content: <FacebookContainer /> },
	{ title: "Twitter preview", content: <TwitterContainer /> },
	{ title: "Schema", content: <SchemaTabContainer /> },
	{ title: "Advanced", content: <AdvancedSettings /> },
];

/**
 * Renders the Modal content.
 *
 * @param {object} props Functional component props.
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
							{ <ContentContainer>{ child.content }</ContentContainer> }
						</Collapsible>
					);
				} )
			}
		</div>
	);
};

/**
 * Returns a button in a div that can be used to open the modal.
 *
 * Warning: contains styling that is specific for the Sidebar.
 *
 * @returns {*} A button wrapped in a div.
 */
const PostSettingsModal = () => {
	const [ isOpen, changeIsOpen ] = useState( false );

	const closeModal = useCallback( () => changeIsOpen( false ), [] );
	const openModal = useCallback( () => changeIsOpen( true ), [] );

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
						{ ModalContent }
					</DrawerContainer>
					<div className="yoast-notice-container">
						<hr />
						<div className="yoast-button-container">
							<p>Make sure to save your post for changes to take effect</p>
							<Button
								className="yoast-button yoast-button--primary yoast-button--post-settings-modal"
								onClick={ closeModal }
							>
								Return to your post
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
					sprintf( __( "Open %s settings", "wordpress-seo" ), window.wpseoAdminL10n.postTypeNameSingular.toLowerCase() )
				}
			</Button>
		</div>
	);
};

export default PostSettingsModal;
