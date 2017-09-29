import React from "react";
import styled from "styled-components";

import HelpCenter from "../composites/Plugin/HelpCenter/HelpCenter";

export const HelpCenterContainer = styled.div`
	box-sizing: border-box;
	padding: 16px;
	min-height: 700px;
	width: 100%;
	background-color: white;
`;

/**
 * Returns the HelpCenterWrapper component.
 *
 * @returns {ReactElement} The HelpCenterWrapper component.
 */
export default function HelpCenterWrapper( props ) {
	return (
		<HelpCenterContainer>
			<HelpCenter />
		</HelpCenterContainer>
	);
}
