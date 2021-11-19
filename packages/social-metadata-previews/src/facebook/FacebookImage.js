/* External dependencies */
import React, { Component } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import { __ } from "@wordpress/i18n";
import { noop } from "lodash";

/* Yoast dependencies */
import { colors } from "@yoast/style-guide";

/* Internal dependencies */
import { SocialImage } from "../shared/SocialImage";
import {
	handleImage,
	FACEBOOK_IMAGE_SIZES,
} from "../helpers/determineImageProperties";

const FacebookImageContainer = styled.div`
	position: relative;
	${ props => props.mode === "landscape"
		? `max-width: ${props.dimensions.width}`
		: `min-width: ${props.dimensions.width}; height: ${props.dimensions.height}` };
	overflow: hidden;
	background-color: ${ colors.$color_white };
`;

const PlaceholderImage = styled.div`
	box-sizing: border-box;
	max-width: ${ FACEBOOK_IMAGE_SIZES.landscapeWidth }px;
	height: ${ FACEBOOK_IMAGE_SIZES.landscapeHeight }px;
	background-color: ${ colors.$color_grey };
	border-style: dashed;
	border-width: 1px;
	// We're not using standard colors to increase contrast for accessibility.
	color: #006DAC;
	// We're not using standard colors to increase contrast for accessibility.
	background-color: #f1f1f1;
	display: flex;
	justify-content: center;
	align-items: center;
	text-decoration: underline;
	font-size: 14px;
	cursor: pointer;
`;

/**
 * Renders the FacebookImage component.
 *
 * @param {string} src The image source.
 *
 * @returns {ReactComponent} The FacebookImage component.
 */
class FacebookImage extends Component {
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
		this.socialMedium = "Facebook";
		this.handleFacebookImage = this.handleFacebookImage.bind( this );
		this.setState = this.setState.bind( this );
	}

	/**
	 * Handles setting the handled image properties on the state.
	 *
	 * @returns {void}
	 */
	async handleFacebookImage() {
		try {
			const newState = await handleImage( this.props.src, this.socialMedium );
			this.setState( newState );
			this.props.onImageLoaded( newState.imageProperties.mode || "landscape" );
		} catch ( error ) {
			this.setState( error );
			this.props.onImageLoaded( "landscape" );
		}
	}

	/**
	 * React Lifecycle method that is called after the component updates.
	 *
	 * @param {Object} prevProps The props.
	 *
	 * @returns {Object} The new props.
	 */
	componentDidUpdate( prevProps ) {
		// Only perform calculations on the image if the src has actually changed.
		if ( prevProps.src !== this.props.src ) {
			this.handleFacebookImage();
		}
	}

	/**
	 * Determine the image properties and set them in state.
	 *
	 * @param {string} src The image source URL.
	 *
	 * @returns {void}
	 */
	componentDidMount() {
		this.handleFacebookImage();
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

		if ( status === "loading" || this.props.src === "" || status === "errored" ) {
			return (
				<PlaceholderImage
					onClick={ this.props.onImageClick }
					onMouseEnter={ this.props.onMouseEnter }
					onMouseLeave={ this.props.onMouseLeave }
				>
					{ __( "Select image", "yoast-components" ) }
				</PlaceholderImage>
			);
		}

		const containerDimensions = this.retrieveContainerDimensions( imageProperties.mode );
		return <FacebookImageContainer
			mode={ imageProperties.mode }
			dimensions={ containerDimensions }
			onMouseEnter={ this.props.onMouseEnter }
			onMouseLeave={ this.props.onMouseLeave }
			onClick={ this.props.onImageClick }
		>
			<SocialImage
				imageProps={ {
					src: this.props.src,
					alt: this.props.alt,
					aspectRatio: FACEBOOK_IMAGE_SIZES.aspectRatio,
				} }
				width={ imageProperties.width }
				height={ imageProperties.height }
				imageMode={ imageProperties.mode }
			/>
		</FacebookImageContainer>;
	}
}

FacebookImage.propTypes = {
	src: PropTypes.string,
	alt: PropTypes.string,
	onImageLoaded: PropTypes.func,
	onImageClick: PropTypes.func,
	onMouseEnter: PropTypes.func,
	onMouseLeave: PropTypes.func,
};

FacebookImage.defaultProps = {
	src: "",
	alt: "",
	onImageLoaded: noop,
	onImageClick: noop,
	onMouseEnter: noop,
	onMouseLeave: noop,
};

export default FacebookImage;
