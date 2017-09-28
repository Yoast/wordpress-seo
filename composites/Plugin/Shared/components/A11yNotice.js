import styled from "styled-components";

/**
 * A span tag invisible to the user, but not to screen readers.
 *
 * If you need a different element then a span, you can use styled-component's .withComponent function.
 */
export const A11yNotice = styled.span`
	border: 0;
	clip: rect(1px, 1px, 1px, 1px);
	clip-path: inset(50%);
	height: 1px;
	margin: -1px;
	overflow: hidden;
	padding: 0;
	position: absolute !important;
	width: 1px;
	word-wrap: normal !important;
	// Safari+VoiceOver bug see PR 308 and My Yoast issues 445, 712 and PR 715.
	transform: translateY(1em);
`;
