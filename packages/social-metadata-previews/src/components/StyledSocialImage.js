import React from "react";
import PropTypes from "prop-types";

/**
 * Renders the StyledSocialImage.
 *
 * @param {Object} props The component's props.
 *
 * @returns {StyledSocialImage} The StyledSocialImage component.
 */
export const StyledSocialImage = ( props ) => {
	const { imageProps } = props;

	const imageStyle = {
		background: `url(${ imageProps.src }) center / cover no-repeat`,
		paddingBottom: `${ imageProps.aspectRatio }%`,
	};

	return <div
		style={ imageStyle }
		role="img"
		aria-label={ imageProps.alt }
	/>;
};

StyledSocialImage.propTypes = {
	imageProps: PropTypes.shape( {
		src: PropTypes.string.isRequired,
		alt: PropTypes.string.isRequired,
		aspectRatio: PropTypes.number.isRequired,
	} ).isRequired,
};
