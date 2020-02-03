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
	TWITTER_IMAGE_SIZES,
} from "../helpers/determineImageProperties";

const TwitterImageContainer = styled.div`
	position: relative;
	overflow: hidden;
	background-color: #e1e8ed;
	flex-shrink: 0;
	height: ${ props => props.isLarge ? TWITTER_IMAGE_SIZES.landscapeHeight : TWITTER_IMAGE_SIZES.squareHeight }px;
	width: ${ props => props.isLarge ? TWITTER_IMAGE_SIZES.landscapeWidth : TWITTER_IMAGE_SIZES.squareWidth }px;
	${ props => props.isLarge ? "border-bottom" : "border-right" }: 1px solid #E1E8ED;
`;

const StyledImage = styled.img`
	width: ${ props => props.imageProperties.width }px;
	height: ${ props => props.imageProperties.height }px;
	position: absolute;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
`;

const BaseImage = styled.div`
	display: flex;
	justify-content: center;
	align-items: center;
	box-sizing: border-box;
	width: ${ TWITTER_IMAGE_SIZES.landscapeWidth }px;
	height: ${ TWITTER_IMAGE_SIZES.landscapeHeight }px;
	max-width: 100%;
	margin: 0;
	padding: 1em;
	text-align: center;
	font-size: 1rem;
`;

const ErrorImage = styled( BaseImage )`
	color: ${ colors.$color_white };
	background-color: ${ colors.$color_red };
`;

const PlaceholderImage = styled( BaseImage )`
	border-top-left-radius: 14px;
	border-top-right-radius: 14px;
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
		return determineImageProperties( this.props.src, "Twitter" ).then( ( imageProperties ) => {
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
	 * Renders the TwitterImage.
	 *
	 * @returns {ReactComponent} Either the PlaceholderImage component, the ErrorImage component or
	 * the TwitterImageContainer.
	 */
	render() {
		const { imageProperties, status } = this.state;

		if ( status === "loading" || this.props.src === "" ) {
			return <PlaceholderImage>
				{ __( "Select image", "yoast-components" ) }
			</PlaceholderImage>;
		}

		if ( status === "errored" ) {
			return <ErrorImage>
				{ __( "The given image url cannot be loaded", "yoast-components" ) }
			</ErrorImage>;
		}

		return <TwitterImageContainer
			isLarge={ this.props.isLarge }
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
	isLarge: PropTypes.bool.isRequired,
	alt: PropTypes.string,
};

TwitterImage.defaultProps = {
	alt: "",
};
