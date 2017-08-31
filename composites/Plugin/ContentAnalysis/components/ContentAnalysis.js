import React from "react";
import styled from "styled-components";
import { BaseButton, Button, InlineFlexButton, IconButton } from "../../Shared/components/Button";
import { YoastButton, YoastButtonLink } from "../../Shared/components/YoastButton";
import { edit } from "../../../../style-guide/svg";

export const ContentAnalysisContainer = styled.div`
	min-height: 700px;
	padding: 40px;
	background-color: white;

	button {
		margin-right: 10px;
	}
`;

/**
 * Returns the ContentAnalysis component.
 *
 * @returns {ReactElement} The ContentAnalysis component.
 */
export default function ContentAnalysis() {
	return <ContentAnalysisContainer>
		<BaseButton>Base Button</BaseButton>
		<Button>Button</Button>
		<IconButton icon={ edit } iconColor="#c00" aria-label="IconButton with icon only" />
		<IconButton icon={ edit } iconColor="#c00">Icon Button</IconButton>
		<YoastButton>Yoast Button</YoastButton>
		<YoastButton backgroundColor="lightblue" textColor="#333">Yoast Button</YoastButton>
		<YoastButton backgroundColor="lightblue" textColor="#333" withTextShadow={ false }>Yoast Button</YoastButton>
	</ContentAnalysisContainer>;
}
