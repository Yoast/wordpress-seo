import { Button } from "@yoast/components/src/button/Button";
import styled from "styled-components";
import { __, sprintf } from "@wordpress/i18n";
import { setPostSettingsModalIsOpen } from "../redux/actions";

/**
 * Container for the button.
 *
 * Sets the flex-direction to column to make the button full-width.
 */
const ButtonContainer = styled.div`
	padding: 16px;
	display: flex;
	flex-direction: column;
	border-bottom: 1px solid rgba( 0,0,0,0.2 );
`;

/**
 * Function to open the PostSettingsModal.
 *
 * @returns {object} Object for opening the PostSettingsModal.
 */
const openPostSettingsModal = () => setPostSettingsModalIsOpen( true );

/**
 * Returns a button with an edit icon that opens the modal when clicked.
 *
 * @returns {*} A button with an edit icon that opens the modal when clicked.
 */
const EditIconButton = () => (
	<Button
		variant="edit"
		onClick={ openPostSettingsModal }
	>
		{
			/* Translators: %s translates to the Post Label in singular form */
			sprintf( __( "Open %s settings", "wordpress-seo" ), window.wpseoAdminL10n.postTypeNameSingular.toLowerCase() )
		}
	</Button>
);

/**
 * Returns a button in a div that can be used to open the modal.
 *
 * Warning: contains styling that is specific for the Sidebar.
 *
 * @returns {*} A button wrapped in a div.
 */
const OpenPostSettingsModal = () => (
	<ButtonContainer
		className="yoast"
	>
		<EditIconButton />
	</ButtonContainer>
);

export default OpenPostSettingsModal;
