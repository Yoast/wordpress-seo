import React from "react";
import styled from "styled-components";

import { HelpCenter } from "../composites/Plugin/HelpCenter/HelpCenter";

export const HelpCenterContainer = styled.div`
	padding: 16px;
	background-color: #f1f1f1;
`;

/**
 * Returns the HelpCenterWrapper component.
 *
 * @param {Object} props The props to use for the component.
 *
 * @returns {ReactElement} The HelpCenterWrapper component.
 */
export default function HelpCenterWrapper( props ) {
	return (
		<HelpCenterContainer>
			<HelpCenter items={ props.items }/>
		</HelpCenterContainer>
	);
}
