import styled from "styled-components";
import { Collapsible } from "@yoast/components";

const StyledModalCollapsible = styled( Collapsible )`
	h2 > button {
		padding-left: 0;
		padding-top: 16px;

		&:hover {
			background-color: #f0f0f0;
		}
	}

	div[class^="collapsible_content"] {
		padding: 24px 0;
		margin: 0 24px;
		border-top: 1px solid rgba(0,0,0,0.2);
	}

`;

/**
 * The ModalCollapsible.
 *
 * @param {Object} props The props
 *
 * @returns {JSX.Element} A ModalCollapsible component.
 */
const ModalCollapsible = ( props ) => {
	return <StyledModalCollapsible hasPadding={ false } hasSeparator={ true } { ...props } />;
};

export default ModalCollapsible;
