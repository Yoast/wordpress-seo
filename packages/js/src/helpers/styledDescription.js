import styled from "styled-components";
import { colors } from "@yoast/style-guide";

const StyledDescription = styled.legend`
	margin: 16px 0;
	padding: 0;
	color: ${ colors.$color_headings };
	font-size: 12px;
	font-weight: 300;
`;

// Without top margin.
const StyledDescriptionTop = styled.legend`
	margin: 0 0 16px;
	padding: 0;
	color: ${ colors.$color_headings };
	font-size: 12px;
	font-weight: 300;
`;

export {
	StyledDescriptionTop,
	StyledDescription,
};
