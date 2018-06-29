import React from "react";
import styled from "styled-components";

export const ButtonsContainer = styled.div`
	max-width: 800px;
    margin: 0 auto;
	padding: 24px;
    box-sizing: border-box;
	background-color: white;
`;

/**
 * Returns the ContentAnalysis component.
 *
 * @returns {ReactElement} The ContentAnalysis component.
 */
export default function DashboardWidget() {
	return (
		<ButtonsContainer>
			Hello
		</ButtonsContainer>
	);
}
