import { Button } from "@yoast/components/src/button/Button";
import styled from "styled-components";
import { __, sprintf } from "@wordpress/i18n";
import { useState, useCallback } from "@wordpress/element";
import Modal from "./Modal";

/**
 * Container for the button.
 *
 * Sets the flex-direction to column to make the button full-width.
 */
const Container = styled.div`
	padding: 16px;
	display: flex;
	flex-direction: column;
	border-bottom: 1px solid rgba( 0,0,0,0.2 );
`;

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
		<Container
			className="yoast"
		>
			{ isOpen && (
				<Modal
					title="Yoast SEO post settings"
					onRequestClose={ closeModal }
					additionalClassName="yoast-post-settings-modal"
				>
					Here comes the content.
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
		</Container>
	);
};

export default PostSettingsModal;
