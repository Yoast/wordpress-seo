import { Button } from "@yoast/components/src/button/Button";
import styled from "styled-components";

const ButtonContainer = styled.div`
	padding: 16px;
	display: flex;
	flex-direction: column;
	border-bottom: 1px solid rgba( 0,0,0,0.2 );
`;

/**
 * JS
 *
 * @returns {*} R
 */
const EditIconButton = () => (
	<Button
		variant="edit"
		onClick={ () => alert('hey') }
		style={ { width: "100%" } }
	>
		Open post settings
	</Button>
);

/**
 * Returns a button in a div that can be used to open the modal.
 *
 * Warning: contains styling that is specific for the Sidebar.
 *
 * @returns {*} A button wrapped in a div.
 */
const OpenModalButton = () => (
	<ButtonContainer
		className="yoast"
	>
		<EditIconButton />
	</ButtonContainer>
);

export default OpenModalButton;
