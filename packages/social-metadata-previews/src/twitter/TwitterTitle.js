/* External dependencies */
import styled from "styled-components";

// Used to make sure the element also has a height when empty by setting min-height equal to line-height.
const height = "18px";

const TwitterTitle = styled.p`
	line-height: ${ height };
	min-height : ${ height };
	font-size: 15px;
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
	margin-top: 0;
	margin-bottom: 2px;
	color: rgb(20, 23, 26);
	cursor: pointer;
`;

export default TwitterTitle;
