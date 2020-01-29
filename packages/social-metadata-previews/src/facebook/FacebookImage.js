/* External dependencies */
import React from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import { __ } from "@wordpress/i18n";

/* Yoast dependencies */
import { colors } from "@yoast/style-guide";

/* Internal dependencies */
import { FACEBOOK_IMAGE_SIZES } from "../helpers/determineImageProperties";

const MIN_IMAGE_WIDTH = FACEBOOK_IMAGE_SIZES.squareWidth;
const MIN_IMAGE_HEIGHT = FACEBOOK_IMAGE_SIZES.squareHeight;

const FacebookImageContainer = styled.div`
	position: relative;
	height: ${ props => props.dimensions.height };
	width: ${ props => props.dimensions.width };
	overflow: hidden;
	background-color: ${ colors.$color_white };
`;

const StyledImage = styled.img`
	width: ${ props => props.imageProperties.width }px;
	height: ${ props => props.imageProperties.height }px;
	position: absolute;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
`;

const ErrorImage = styled.div`
	display: flex;
	justify-content: center;
	align-items: center;
	box-sizing: border-box;
	width: ${ FACEBOOK_IMAGE_SIZES.landscapeWidth }px;
	height: ${ FACEBOOK_IMAGE_SIZES.landscapeHeight }px;
	max-width: 100%;
	margin: 0;
	padding: 1em;
	text-align: center;
	font-size: 1rem;
	color: ${ colors.$color_white };
	background-color: ${ colors.$color_red };
`;

const PlaceholderImage = styled.div`
	width: ${ FACEBOOK_IMAGE_SIZES.landscapeWidth }px;
	height: ${ FACEBOOK_IMAGE_SIZES.landscapeHeight }px;
	background-color: ${ colors.$color_grey };
	border-style: dashed;
	border-width: 2px;
	// We're not using standard colors to increase contrast for accessibility.
	color: #073cba;
	// We're not using standard colors to increase contrast for accessibility.
	background-color: #f1f1f1;
	display: flex;
	justify-content: center;
	align-items: center;
`;

/**
 * Renders the FacebookImage component.
 *
 * @param {string} src The image source.
 *
 * @returns {ReactComponent} The FacebookImage component.
 */
const FacebookImage = (props) => {

	/**
	 * Retrieves the dimensions for the Facebook image container.
	 *
	 * @param {string} imageMode The Facebook image mode: landscape, portrait or square.
	 *
	 * @returns {Object} The width and height for the container.
	 */
	const retrieveContainerDimensions = ( imageMode ) => {
		switch ( imageMode ) {
			case "square":
				return {
					height: FACEBOOK_IMAGE_SIZES.squareHeight + "px",
					width: FACEBOOK_IMAGE_SIZES.squareWidth + "px",
				};
			case "portrait":
				return {
					height: FACEBOOK_IMAGE_SIZES.portraitHeight + "px",
					width: FACEBOOK_IMAGE_SIZES.portraitWidth + "px",
				};
			case "landscape":
				return {
					height: FACEBOOK_IMAGE_SIZES.landscapeHeight + "px",
					width: FACEBOOK_IMAGE_SIZES.landscapeWidth + "px",
				};
		}
	}

	const { imageProperties, status, src, alt } = props;

	if ( status === "loading" || src === "" ) {
		return <PlaceholderImage>
			{ __( "Select image", "yoast-components" ) }
		</PlaceholderImage>;
	}

	if ( status === "errored" ) {
		return <ErrorImage>
			{ __( "The given image url cannot be loaded", "yoast-components" ) }
		</ErrorImage>;
	}

	if ( imageProperties.height < MIN_IMAGE_HEIGHT || imageProperties.width < MIN_IMAGE_WIDTH ) {
		return <ErrorImage>
			{ __( "The image you selected is too small for Facebook", "yoast-components" ) }
		</ErrorImage>;
	}

	const containerDimensions = retrieveContainerDimensions( imageProperties.mode );
	return <FacebookImageContainer
		dimensions={ containerDimensions }
	>
		<StyledImage
			src={ src }
			alt={ alt }
			imageProperties={ imageProperties }
		/>
	</FacebookImageContainer>;
	
}

FacebookImage.propTypes = {
	src: PropTypes.string,
	alt: PropTypes.string,
	mode: PropTypes.string,
};

FacebookImage.defaultProps = {
	alt: "",
	src: "",
};

export default FacebookImage