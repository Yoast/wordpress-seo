import React from "react";
import styled from "styled-components";
import PropTypes from "prop-types";

import YouTubeVideo from "../../basic/YouTubeVideo";
import colors from "../../../style-guide/colors.json";
import breakpoints from "../../../style-guide/responsive-breakpoints.json";

const VideoTutorialContainer = styled.div`
	padding: 1em;
`;

const VideoContainer = styled.div`
	float: left;
	width: 560px;

	@media screen and (max-width: ${ breakpoints.mobile } ) {
		float: none;
		width: 100%;
	}
`;

const VideoDescriptions = styled.div`
	margin-left: 560px;
	padding: 0 16px;

	@media screen and (max-width: ${ breakpoints.mobile } ) {
		margin-left: initial;
		padding: 0;
	}
`;

const VideoDescription = styled.div`
	padding: 16px 0;
	box-sizing: border-box;

	:not( :last-child ) {
		border-bottom: 2px solid ${ colors.$color_grey };
		padding-bottom: 16px;
	}
`;

const VideoDescriptionTitle = styled.p`
	margin-top: 0;
	font-weight: 600;
`;

const VideoDescriptionText = styled.p`
`;

const VideoDescriptionLink = styled.a`
	font-weight: 100;
	color: ${ colors.$color_pink_dark };
`;

const VideoDescriptionItem = ( props ) => {
	return (
		<VideoDescription>
			<VideoDescriptionTitle>
				{ props.title }
			</VideoDescriptionTitle>
			<VideoDescriptionText>
				{ props.description }
			</VideoDescriptionText>
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
};

/**
 * Creates a VideoTutorial component that displays a YouTube video.
 *
 * @param {Object} props The props to use for the component.
 *
 * @returns {ReactElement} The VideoTutorial component.
 */
export default function VideoTutorial( props ) {
	return (
		<VideoTutorialContainer>
			<VideoContainer>
				<YouTubeVideo src={ props.src } title={ props.title } />
			</VideoContainer>
			<VideoDescriptions>
				{ props.items.map( item => {
					return (
						<VideoDescriptionItem key={ item.link } { ...item }/>
					);
				} ) }
			</VideoDescriptions>
		</VideoTutorialContainer>
	);
}

VideoTutorial.propTypes = {
	src: PropTypes.string.isRequired,
	title: PropTypes.string.isRequired,
	items: PropTypes.arrayOf(
		PropTypes.shape(
			VideoDescriptionItem.propTypes
		)
	).isRequired,
};
