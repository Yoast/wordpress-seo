/* External dependencies */
import React from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import { __ } from "@wordpress/i18n";

/* Internal dependencies */
import {
	determineTwitterImageProperties,
	LANDSCAPE_HEIGHT,
	LANDSCAPE_WIDTH,
	SQUARE_HEIGHT,
	SQUARE_WIDTH,
} from "../helpers/determineTwitterImageProperties";
import { colors } from "@yoast/style-guide";

const TwitterImageContainer = styled.div`
	position: relative;
	height: ${ props => props.dimensions.height };
	width: ${ props => props.dimensions.width };
	overflow: hidden;
	background-color: #e1e8ed;
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
	width: ${ LANDSCAPE_WIDTH + "px" };
	height: ${ LANDSCAPE_HEIGHT + "px" };
	max-width: 100%;
	margin: 0;
	padding: 1em;
	text-align: center;
	font-size: 1rem;
	color: ${ colors.$color_white };
	background-color: ${ colors.$color_red };
`;

const PlaceholderImage = styled.div`
	display: flex;
	justify-content: center;
	align-items: center;
	box-sizing: border-box;
	width: ${ LANDSCAPE_WIDTH + "px" };
	height: ${ LANDSCAPE_HEIGHT + "px" };
	max-width: 100%;
	margin: 0;
	padding: 1em;
	text-align: center;
	font-size: 1rem;
	border-top-left-radius: .85714em;
	border-top-right-radius: .85714em;
	border-style: dashed;
	border-width: 2px;
	// We're not using standard colors to increase contrast for accessibility.
	color: #073cba; 
	// We're not using standard colors to increase contrast for accessibility.
	background-color: #f1f1f1;
`;

/**
 * Renders the TwitterImage component.
 *
 * @param {string} src The image source.
 *
 * @returns {ReactComponent} The TwitterImage component.
 */
export default class TwitterImage extends React.Component {
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
	 * After the component has mounted, determine the properties of the TwitterImage.
	 *
	 * @returns {Promise} Resolves when there are image properties.
	 */
	componentDidMount() {
		return determineTwitterImageProperties( this.props.src ).then( ( imageProperties ) => {
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
	 * Gets the dimensions for the Twitter image container.
	 *
	 * @param {string} imageMode The Twitter image mode: landscape or square.
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
			case "landscape":
				return {
					height: LANDSCAPE_HEIGHT + "px",
					width: LANDSCAPE_WIDTH + "px",
				};
		}
	}

	/**
	 * Renders the TwitterImage.
	 *
	 * @returns {ReactComponent} Either the ErrorImage component or the TwitterImageContainer.
	 */
	render() {
		const imageProperties = this.state.imageProperties;
		const status = this.state.status;

		if ( status === "loading" || this.props.src === "" ) {
			return <PlaceholderImage>{ __( "Select image", "yoast-components" ) }</PlaceholderImage>;
		}

		if ( status === "errored" ) {
			return <ErrorImage>{ __( "The given image url cannot be loaded", "yoast-components" ) }</ErrorImage>;
		}

		const containerDimensions = this.getContainerDimensions( imageProperties.mode );
		return <TwitterImageContainer
			dimensions={ containerDimensions }
		>
			<StyledImage
				src={ this.props.src }
				alt={ this.props.alt }
				imageProperties={ imageProperties }
			/>
		</TwitterImageContainer>;
	}
}

TwitterImage.propTypes = {
	src: PropTypes.string.isRequired,
	alt: PropTypes.string,
};

TwitterImage.defaultProps = {
	alt: "",
};
