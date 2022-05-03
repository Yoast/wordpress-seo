/* External dependencies */
import styled from "styled-components";
import { TWITTER_IMAGE_SIZES } from "../helpers/determineImageProperties";

/**
 * Renders a TwitterDescription component.
 * NOTE: the "-webkit-line-clamp: 3" limits the number of lines to 3.
 *
 * @param {object} props The props.
 *
 * @returns {React.Component} The rendered element.
 */
const TwitterDescription = styled.p`
	max-height: 55px;
	overflow: hidden;
	text-overflow: ellipsis;
	margin: 0;
	color: rgb(83, 100, 113);
	display: -webkit-box;
	cursor: pointer;
	-webkit-line-clamp: 2;
	-webkit-box-orient: vertical;

	@media all and ( max-width: ${ TWITTER_IMAGE_SIZES.landscapeWidth }px ) {
		display: none;
	}
`;

export default TwitterDescription;
