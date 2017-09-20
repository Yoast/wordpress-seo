import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import IFrame from "../../composites/basic/IFrame";

const StyledIFrame = styled( IFrame )``;

/**
 * Creates a YouTubeVideo component.
 *
 * @param {Object} props The props to use for the component.
 *
 * @returns {ReactElement} The YouTubeVideo component.
 *
 * @constructor
 */
export default function YouTubeVideo( props ) {
	return (
		<StyledIFrame
			width={ props.width }
			height={ props.height }
			src={ props.src }
			title={ props.title }
		    frameBorder={ props.frameBorder }
		    allowFullScreen={ props.allowFullScreen }
		/>
	);
}

YouTubeVideo.propTypes = {
	width: PropTypes.number,
	height: PropTypes.number,
	src: PropTypes.string.isRequired,
	title: PropTypes.string.isRequired,
	frameBorder: PropTypes.number,
	allowFullScreen: PropTypes.bool,
};

YouTubeVideo.defaultProps = {
	width: 560,
	height: 315,
	frameBorder: 0,
	allowFullScreen: true,
};
