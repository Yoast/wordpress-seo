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
 * Returns the ContentAnalysis component.
 *
 * @returns {ReactElement} The ContentAnalysis component.
 */
export default function HelpCenterWrapper() {
	return (
		<HelpCenterContainer>
			<HelpCenter />
		</HelpCenterContainer>
	);
}
