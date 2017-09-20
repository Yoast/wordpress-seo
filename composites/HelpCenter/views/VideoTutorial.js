import React from "react";
import styled from "styled-components";
import YouTubeVideo from "../../basic/YouTubeVideo";
import PropTypes from "prop-types";

const Section = styled.section`
	display: flex;
	padding: 1em;
`;

const VideoTutorialPlaceholder = styled( Section )`
	flex-wrap: wrap;
`;

const VideoTextPanel = styled( Section )`
	min-width: 220px;
	max-width: 550px;
	flex: 50% 0;
`;

const StyledYouTubeVideo = styled( YouTubeVideo )`
	flex: 50% 0;
`;

/**
 * Creates a VideoTutorial component that displays a YouTube video.
 *
 * @param {Object} props The props to use for the component.
 * @returns {ReactElement} The rendered VideoTutorial component.
 *
 * @constructor
 */
export default function VideoTutorial( props ) {
	return (
		<VideoTutorialPlaceholder>
			<StyledYouTubeVideo	src={ props.src } title={ props.title } />
			<VideoTextPanel>
				{ props.description }
			</VideoTextPanel>
		</VideoTutorialPlaceholder>
	);
}

VideoTutorial.propTypes = {
	src: PropTypes.string.isRequired,
	title: PropTypes.string.isRequired,
	description: PropTypes.string.isRequired,
};
