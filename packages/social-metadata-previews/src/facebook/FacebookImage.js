/* External dependencies */
import React from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import { __ } from "@wordpress/i18n";

/* Yoast dependencies. */
import { colors } from "@yoast/style-guide";

/* Internal dependencies */
import {
	determineFacebookImageProperties,
	LANDSCAPE_HEIGHT,
	LANDSCAPE_WIDTH,
	PORTRAIT_HEIGHT,
	PORTRAIT_WIDTH,
	SQUARE_HEIGHT,
	SQUARE_WIDTH,
} from "../helpers/determineFacebookImageProperties";

const MIN_IMAGE_WIDTH = 158;
const MIN_IMAGE_HEIGHT = 158;

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

const ErrorImage = styled.p`
	display: flex;
	justify-content: center;
	align-items: center;
	box-sizing: border-box;
	width: 500px;
	height: 261px;
	max-width: 100%;
	margin: 0;
	padding: 1em;
	text-align: center;
	font-size: 1rem;
	color: ${ colors.$color_white };
	background-color: ${ colors.$color_red };
`;

const PlaceholderImage = styled.div`
	height: 261px;
	width: 500px;
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
	 * After the component did mount, determine the properties of the FacebookImage.
	 *
	 * @returns {Promise} Resolves when there are image properties.
	 */
	componentDidMount() {
		return determineFacebookImageProperties( this.props.src ).then( ( imageProperties ) => {
			this.setState( {
				imageProperties: imageProperties,
				status: "loaded",
			} );
		} ).catch( () => {
			this.setState( {
				imageProperties: null,
				status: "errored",
			} );
			return true;
		} );
	}

	/**
	 * Gets the dimensions for the facebook image container.
	 *
	 * @param {string} imageMode The facebook image mode: either landscape, square or portrait.
	 *
	 * @returns {Object} The width and height for the container.
	 */
	getContainerDimensions( imageMode ) {
		switch ( imageMode ) {
			case "square":
				return {
					height: SQUARE_HEIGHT + "px",
					width: SQUARE_WIDTH + "px",
				};
			case "portrait":
				return {
					height: PORTRAIT_HEIGHT + "px",
					width: PORTRAIT_WIDTH + "px",
				};
			case "landscape":
				return {
					height: LANDSCAPE_HEIGHT + "px",
					width: LANDSCAPE_WIDTH + "px",
				};
		}
	}

	/**
	 * Renders the FacebookImage.
	 *
	 * @returns {ReactComponent} Either the ErrorImage component or the FacebookImageContainer.
	 */
	render() {
		const imageProperties = this.state.imageProperties;
		const status = this.state.status;

		if ( status === "loading" ) {
			return <PlaceholderImage />;
		}

		if ( status === "errored" ) {
			return <ErrorImage>{ __( "The given image url cannot be loaded", "yoast-components" ) }</ErrorImage>;
		}

		if ( imageProperties.height < MIN_IMAGE_HEIGHT || imageProperties.width < MIN_IMAGE_WIDTH ) {
			return <ErrorImage>{ __( "The image you selected is too small for Facebook", "yoast-components" ) }</ErrorImage>;
		}

		const containerDimensions = this.getContainerDimensions( imageProperties.mode );
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
