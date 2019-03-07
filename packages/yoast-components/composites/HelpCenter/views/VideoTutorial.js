import React from "react";
import styled from "styled-components";
import PropTypes from "prop-types";

import YouTubeVideo from "../../basic/YouTubeVideo";
import colors from "../../../style-guide/colors.json";
import breakpoints from "../../../style-guide/responsive-breakpoints.json";
import { makeOutboundLink } from "../../../utils/makeOutboundLink";

// Used to align the video and the description next to each other.
const VIDEO_WIDTH = "560px";

const VideoTutorialContainer = styled.div`
	overflow: hidden;
`;

const VideoContainer = styled.div`
	${ props => props.hasParagraphs ? "float: left;" : "margin: 0 auto;" }
	width: ${ VIDEO_WIDTH };

	@media screen and ( max-width: ${ breakpoints.tablet } ) {
		float: none;
		max-width: 100%;
		margin: 0 auto;
	}
`;

VideoContainer.propTypes = {
	hasParagraphs: PropTypes.bool.isRequired,
};

const VideoDescriptions = styled.div`
	margin-left: ${ VIDEO_WIDTH };
	padding: 0 16px;
	max-width: ${ VIDEO_WIDTH };

	@media screen and ( max-width: ${ breakpoints.tablet } ) {
		margin: 0 auto;
		padding: 0;
	}
`;

const VideoDescription = styled.div`
	padding: 16px 0;

	:not( :last-child ) {
		border-bottom: 2px solid ${ colors.$color_grey };
		padding-bottom: 16px;
	}
`;

const VideoDescriptionTitle = styled.p`
	margin-top: 0;
	font-weight: 600;
`;

const VideoDescriptionLink = makeOutboundLink( styled.a`
	color: ${ colors.$color_pink_dark };
` );

/**
 * Creates a VideoDescription component, to be displayed next to the video.
 *
 * @param {Object} props The props to use for the component.
 *
 * @returns {ReactElement} The VideoDescription component.
 */
const VideoDescriptionItem = ( props ) => {
	return (
		<VideoDescription className={ props.className }>
			<VideoDescriptionTitle>
				{ props.title }
			</VideoDescriptionTitle>
			<p>
				{ props.description }
			</p>
			<VideoDescriptionLink href={ props.link }>
				{ props.linkText }
			</VideoDescriptionLink>
		</VideoDescription>
	);
};

VideoDescriptionItem.propTypes = {
	title: PropTypes.string.isRequired,
	description: PropTypes.string.isRequired,
	link: PropTypes.string.isRequired,
	linkText: PropTypes.string.isRequired,
	className: PropTypes.string,
};

VideoDescriptionItem.defaultProps = {
	className: "yoast-video-tutorial",
};

/**
 * Creates a VideoTutorial component that displays a YouTube video.
 *
 * The passed YouTube URLs must be of type "embed", e.g.:
 * https://www.youtube.com/embed/bIgcj_pPIbw
 *
 * @param {Object} props The props to use for the component.
 *
 * @returns {ReactElement} The VideoTutorial component.
 */
export default function VideoTutorial( props ) {
	const hasParagraphs = props.paragraphs.length > 0;

	return (
		<VideoTutorialContainer className={ `${ props.className }__container` }>
			<VideoContainer
				className={ `${ props.className }__video-container` }
				hasParagraphs={ hasParagraphs }
			>
				<YouTubeVideo
					src={ props.src }
					title={ props.title }
				/>
			</VideoContainer>
			{ hasParagraphs && <VideoDescriptions className={ `${ props.className }__descriptions` }>
				{ props.paragraphs.map( paragraph => {
					return (
						<VideoDescriptionItem
							className={ `${ props.className }__description` }
							key={ paragraph.link }
							{ ...paragraph }
						/>
					);
				} ) }
			</VideoDescriptions> }
		</VideoTutorialContainer>
	);
}

VideoTutorial.propTypes = {
	src: PropTypes.string.isRequired,
	title: PropTypes.string.isRequired,
	paragraphs: PropTypes.arrayOf(
		PropTypes.shape(
			VideoDescriptionItem.propTypes
		)
	),
	className: PropTypes.string,
};

VideoTutorial.defaultProps = {
	className: "yoast-video-tutorial",
	paragraphs: [],
};
