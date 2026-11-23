import React from "react";
import styled from "styled-components";

import IFrame from "./IFrame";

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
 * @param {number} [props.width=560] The width of the iframe.
 * @param {number} [props.height=315] The height of the iframe.
 * @param {string} props.src The source URL of the video.
 * @param {string} props.title The title of the iframe.
 * @param {number} [props.frameBorder=0] The frame border of the iframe.
 * @param {boolean} [props.allowFullScreen=true] Whether the video can be played in full screen.
 *
 * @returns {ReactElement} The YouTubeVideo component.
 */
export default function YouTubeVideo( { width = 560, height = 315, frameBorder = 0, allowFullScreen = true, ...props } ) {
	return (
		<YoutubeVideoContainer>
			<IFrame
				width={ width }
				height={ height }
				frameBorder={ frameBorder }
				allowFullScreen={ allowFullScreen }
				{ ...props }
			/>
		</YoutubeVideoContainer>
	);
}
