/* External dependencies */
import styled from "styled-components";

/**
 * Determines the number of lines depending on the imageMode.
 *
 * @param {String} mode The imageMode.
 *
 * @returns {Number} Number of lines the description shows.
 */
const determineClamp = ( mode ) => {
	switch ( mode ) {
		case "landscape":
			return 1;
		case "square":
			return 3;
		case "portrait":
			return 5;
		default:
			return 1;
	}
};

// Used to make sure the element also has a height when empty by setting min-height equal to line-height.
const height = "16px";

/**
 * Renders a FacebookDescription component.
 *
 * @param {props} props props.
 *
 * @returns {React.Component} The rendered element.
 */
const FacebookDescription = styled.p`
	line-height: ${ height };
	min-height : ${ height };
	color: #606770;
	font-size: 12px;
	padding: 0;
	text-overflow: ellipsis;
	margin: 3px 0 0 0;
	display: -webkit-box;
	cursor: pointer;
	-webkit-line-clamp: ${ props => determineClamp( props.mode ) };
	-webkit-box-orient: vertical;
	overflow: hidden;

	@media all and ( max-width: ${ props => props.maxWidth } ) {
		display: none;
	}
`;

export default FacebookDescription;
