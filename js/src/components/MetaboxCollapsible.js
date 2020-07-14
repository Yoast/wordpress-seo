import SidebarCollapsible from "./SidebarCollapsible";
import styled from "styled-components";

const MetaboxCollapsible = styled( SidebarCollapsible )`
	h2 > button {
		padding-left: 24px;
		padding-top: 16px;
	}

	div[class^="collapsible_content"] {
		padding: 24px 0;
		margin: 0 24px;
		border-top: 1px solid rgba(0,0,0,0.2);
	}
`;

export default MetaboxCollapsible;
