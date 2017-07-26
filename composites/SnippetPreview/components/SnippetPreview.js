import React from "react";
import styled from "styled-components";

export const SnippetPreviewDiv = styled.div`
	height: 700px;
	width: 100%;
	background-color: white;
`;

/**
 * Returns the SnippetPreview component.
 *
 * @returns {ReactElement} The SnippetPreview component.
 */
export default function SnippetPreview() {
	return <SnippetPreviewDiv></SnippetPreviewDiv>;
}
