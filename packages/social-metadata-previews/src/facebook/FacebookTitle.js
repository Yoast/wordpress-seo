/* External dependencies */
import styled from "styled-components";

// Used to make sure the element also has a height when empty by setting min-height equal to line-height.
const height = "20px";

const FacebookTitle = styled.span`
	line-height: ${ height };
	min-height : ${ height };
	color: #1d2129;
	font-weight: 600;
	overflow: hidden;
	font-size: 16px;
	margin: 0;
	letter-spacing: normal;
	white-space: normal;
	flex-shrink: 0;
	cursor: pointer;
	display: -webkit-box;
	-webkit-line-clamp: 2;
	-webkit-box-orient: vertical;
	overflow: hidden;
`;

export default FacebookTitle;
