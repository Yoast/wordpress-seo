/* External dependencies */
import styled from "styled-components";

/**
 * Renders a FacebookDescription component.
 *
 * @returns {React.Component} The rendered element.
 */
const FacebookDescription = styled.p`
	color: #606770;
	font-size: 14px;
	line-height: 20px;
	word-break: break-word;
	max-height: 80px;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
	margin-top: 3px;
	width: 100%;
`;

export default FacebookDescription;
