import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

import IFrame from "../../composites/basic/IFrame";

/* Responsive videos. */
/* Other common aspect ratios: 75% = 4:3, 66.66% = 3:2, 62.5% = 8:5 */
const YoutubeVideoContainer = styled.div`
	position: relative;
	padding-bottom: 56.25%; /* 16:9 */
	height: 0;
	overflow: hidden;

	iframe {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
	}
`;

/**
 * Creates a YouTubeVideo component.
 *
 * @param {Object} props The props to use for the component.
 *
 * @returns {ReactElement} The YouTubeVideo component.
 */
export default function YouTubeVideo( props ) {
	return (
		<YoutubeVideoContainer>
			<IFrame
				{ ...props }
			/>
		</YoutubeVideoContainer>
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
