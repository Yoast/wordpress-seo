import PropTypes from "prop-types";
import React from "react";
import styled from "styled-components";

// Adding && for specificity, competing styles coming from block editor.
const StyledImage = styled.img`
	&& {
		max-width: ${ props => props.width }px;
		height: ${ props => props.height }px;
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		max-width: none;
	}
`;

const StyledLandscapeImage = styled.img`
	&& {
		height: 100%;
		position: absolute;
		width: 100%;
		object-fit: cover;
	}
`;

const WrapperDiv = styled.div`
	padding-bottom: ${ props => props.aspectRatio }%;
`;

/**
 * Renders the SocialImage.
 *
 * @param {{src: string, alt: string, aspectRatio: number}} imageProps The image properties.
 * @param {number} width The width of the image.
 * @param {number} height The height of the image.
 * @param {string} [imageMode="landscape"] The mode of the image (landscape or portrait).
 *
 * @returns {JSX.Element} The SocialImage component.
 */
export const SocialImage = ( { imageProps, width, height, imageMode = "landscape" } ) => {
	if ( imageMode === "landscape" ) {
		return (
			<WrapperDiv aspectRatio={ imageProps.aspectRatio }>
				<StyledLandscapeImage src={ imageProps.src } alt={ imageProps.alt } />
			</WrapperDiv>
		);
	}

	return <StyledImage
		src={ imageProps.src }
		alt={ imageProps.alt }
		width={ width }
		height={ height }
		imageProperties={ imageProps }
	/>;
};

SocialImage.propTypes = {
	imageProps: PropTypes.shape( {
		src: PropTypes.string.isRequired,
		alt: PropTypes.string.isRequired,
		aspectRatio: PropTypes.number.isRequired,
	} ).isRequired,
	width: PropTypes.number.isRequired,
	height: PropTypes.number.isRequired,
	imageMode: PropTypes.string,
};
