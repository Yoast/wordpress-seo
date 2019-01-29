import styled from "styled-components";
import PropTypes from "prop-types";

const StyledImage = styled.img`
	height: ${ props => props.type === "square" ? "auto" : "100%" };
	min-height: initial;
	width: 100%;
	position: relative;
`;

const FacebookImageContainer = styled.div`
	line-height: 0;
	position: relative;
	z-index: 1;
	overflow: hidden;
	display: block;
	height: '{the height of the given image}px'
	width: 500px;
`;

/**
 * Renders the FacebookImage component.
 *
 * @param {string} src The image source
 * @param {string} type The type of Facebook image. Either portrait, landscape or square.
 *
 * @returns {ReactComponent} The FacebookImage component.
 */
export default function FacebookImage( src, type ) {
	return <FacebookImageContainer type={ type }>
		<StyledImage src={ src } type={ type } />
	</FacebookImageContainer>
}

FacebookImage.propTypes = {
	src: PropTypes.string.isRequired,
	type: PropTypes.string.isRequired,
};

