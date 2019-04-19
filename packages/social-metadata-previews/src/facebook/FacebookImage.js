/* External dependencies */
import React from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import { __ } from "@wordpress/i18n";

/* Yoast dependencies */
import { colors } from "@yoast/style-guide";

/* Internal dependencies */
import {
	determineImageProperties,
	FACEBOOK_IMAGE_SIZES,
} from "../helpers/determineImageProperties";

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
`;

/**
 * Renders the FacebookImage component.
 *
 * @param {string} src The image source.
 *
 * @returns {ReactComponent} The FacebookImage component.
 */
export default class FacebookImage extends React.Component {
	/**
	 * The constructor.
	 *
	 * @param {Object} props The component's props.
	 */
	constructor( props ) {
		super( props );
		this.state = {
			imageProperties: null,
			status: "loading",
		};
	}

	/**
	 * After the component has mounted, determine the properties of the FacebookImage.
	 *
	 * @returns {Promise} Resolves when there are image properties.
	 */
	componentDidMount() {
		return determineImageProperties( this.props.src, "Facebook" ).then( ( imageProperties ) => {
			this.setState( {
				imageProperties: imageProperties,
				status: "loaded",
			} );
		} ).catch( () => {
			this.setState( {
				imageProperties: null,
				status: "errored",
			} );
		} );
	}

	/**
	 * Retrieves the dimensions for the Facebook image container.
	 *
	 * @param {string} imageMode The Facebook image mode: landscape, portrait or square.
	 *
	 * @returns {Object} The width and height for the container.
	 */
	retrieveContainerDimensions( imageMode ) {
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

	/**
	 * Renders the FacebookImage.
	 *
	 * @returns {ReactComponent} Either the ErrorImage component or the FacebookImageContainer.
	 */
	render() {
		const { imageProperties, status } = this.state;

		if ( status === "loading" ) {
			return <PlaceholderImage />;
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

		const containerDimensions = this.retrieveContainerDimensions( imageProperties.mode );
		return <FacebookImageContainer
			dimensions={ containerDimensions }
		>
			<StyledImage
				src={ this.props.src }
				alt={ this.props.alt }
				imageProperties={ imageProperties }
			/>
		</FacebookImageContainer>;
	}
}

FacebookImage.propTypes = {
	src: PropTypes.string.isRequired,
	alt: PropTypes.string,
};

FacebookImage.defaultProps = {
	alt: "",
};
