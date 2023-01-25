/* External dependencies */
import styled from "styled-components";

// Used to make sure the element also has a height when empty by setting min-height equal to line-height.
const descriptionLineHeight = 16;

/**
 * Renders a FacebookDescription component.
 *
 * @param {props} props props.
 *
 * @returns {React.Component} The rendered element.
 */
const FacebookDescription = styled.p`
	line-height: ${ descriptionLineHeight }px;
	min-height : ${ descriptionLineHeight }px;
	color: #606770;
	font-size: 14px;
	padding: 0;
	text-overflow: ellipsis;
	margin: 3px 0 0 0;
	display: -webkit-box;
	cursor: pointer;
	-webkit-line-clamp: ${ props => ( props.lineCount ) };
	-webkit-box-orient: vertical;
	overflow: hidden;

	@media all and ( max-width: ${ props => props.maxWidth } ) {
		display: none;
	}
`;

export default FacebookDescription;
