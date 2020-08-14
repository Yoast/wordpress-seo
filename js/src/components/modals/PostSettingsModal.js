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
	border-bottom: 1px solid rgba( 0,0,0,0.2 );
	width: 100%;
`;

const ContentContainer = styled.div`
	padding: 16px;
	border-top: 1px solid var(--yoast-color-border);
`;

const ModalContent = [
	{ title: "Google preview", content: <SnippetEditor hasPaperStyle={ false } /> },
	{ title: "Facebook preview", content: <FacebookContainer /> },
	{ title: "Twitter preview", content: <TwitterContainer /> },
	{ title: "Schema", content: <SchemaTabContainer /> },
	{ title: "Advanced", content: <AdvancedSettings /> },
];

const ButtonContainer = styled.div`
	display: flex;
	flex-direction: row;
	justify-content: flex-end;
	padding: 24px 24px 24px;
	margin: 0;

	p {
		padding-right: 24px;
	}

	@media screen and (max-width: 600px){
		padding: 16px 16px 16px;
		justify-content: space-between;

		p {
			padding-right: 0;
		}
	}
`;

const NoticeContainer = styled.div`
	z-index: 1;
	position: sticky;
	bottom: 0;
	left: 0;
	width: 100%;
	margin-top: auto;
	background: white;
`;

const ContentContainerDiv = styled.div`
	overflow-y: scroll;
`;

/**
 * Renders the Modal content.
 *
 * @param {object} props Functional component props.
 *
 * @returns {*} Functional component that renders the content of the modal.
 */
const DrawerContainer = ( { children } ) => {
	return (
		<ContentContainerDiv>
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
		</ContentContainerDiv>
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
					additionalClassName="yoast-post-settings-modal"
				>
					<DrawerContainer>
						{ ModalContent }
					</DrawerContainer>
					<NoticeContainer>
						<hr />
						<ButtonContainer>
							<p>Make sure to save your post for changes to take effect</p>
							<Button
								className="yoast-button yoast-button--primary yoast-button--post-settings-modal"
								onClick={ closeModal }
							>
								Return to your post
							</Button>
						</ButtonContainer>
					</NoticeContainer>
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
