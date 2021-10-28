import React from "react";
import PropTypes from "prop-types";

/**
 * Renders the SocialImage.
 *
 * @param {Object} props The component's props.
 *
 * @returns {SocialImage} The SocialImage component.
 */
export const SocialImage = ( props ) => {
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

SocialImage.propTypes = {
	imageProps: PropTypes.shape( {
		src: PropTypes.string.isRequired,
		alt: PropTypes.string.isRequired,
		aspectRatio: PropTypes.number.isRequired,
	} ).isRequired,
};
