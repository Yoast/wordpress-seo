/* External dependencies */
import React from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import { __ } from "@wordpress/i18n";

/* Internal dependencies */
import {
	determineImageProperties,
	TWITTER_IMAGE_SIZES,
} from "../helpers/determineImageProperties";

/**
 * Will set height, width, and border properties on the image container as required by the summary/summary_large_image cards.
 *
 * @param {boolean} isLarge Whether this is the summary_large_image or regular summary card.
 * @param {boolean} border  Whether this image should have appropriate border styles, or no border;
 *
 * @returns {string} A string containing relevant css settings.
 */
const injectCardDependentStyles = ( isLarge, border = true ) => {
	if ( isLarge ) {
		return (
			`
			height: ${ TWITTER_IMAGE_SIZES.landscapeHeight }px;
			width: ${ TWITTER_IMAGE_SIZES.landscapeWidth }px;
			${ border ? "border-bottom: 1px solid #E1E8ED;" : "" }
			`
		);
	}
	return (
		`
		width: ${ TWITTER_IMAGE_SIZES.squareWidth }px;
		${ border ? "border-right: 1px solid #E1E8ED;" : "" }
		`
	);
};

const TwitterImageContainer = styled.div`
	position: relative;
	box-sizing: content-box;
	overflow: hidden;
	background-color: #e1e8ed;
	flex-shrink: 0;
	${ props => injectCardDependentStyles( props.isLarge ) }
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
	max-width: 100%;
	margin: 0;
	padding: 1em;
	text-align: center;
	font-size: 1rem;
	${ props => injectCardDependentStyles( props.isLarge, false ) }
`;

const PlaceholderImage = styled( BaseImage )`
	border-top-left-radius: 14px;
	${ props => props.isLarge ? "border-top-right-radius" : "border-bottom-left-radius" }: 14px;
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
		this.handleImage = this.handleImage.bind( this );
		this.socialMedium = "Twitter";
	}

	/**
	 * Handles the determining of image properties.
	 *
	 * @param {string}       src          The image url.
	 * @param {socialMedium} socialMedium The social medium, Twitter or Facebook.
	 *
	 * @returns {void}
	 */
	handleImage( src ) {
		determineImageProperties( src, this.socialMedium ).then( ( imageProperties ) => {
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
	 * React Lifecycle method that is called after the component updates.
	 *
	 * @param {Object} prevProps The props.
	 *
	 * @returns {Object} The new props.
	 */
	componentDidUpdate( prevProps ) {
		if ( prevProps.src !== this.props.src ) {
			this.handleImage( this.props.src );
		}
	}

	/**
	 * After the component has mounted, determine the properties of the TwitterImage.
	 *
	 * @returns {Promise} Resolves when there are image properties.
	 */
	componentDidMount() {
		this.handleImage( this.props.src );
	}

	/**
	 * Renders the TwitterImage.
	 *
	 * @returns {ReactComponent} Either the PlaceholderImage component, the ErrorImage component or
	 * the TwitterImageContainer.
	 */
	render() {
		const { imageProperties, status } = this.state;

		if ( status === "loading" || this.props.src === "" || status === "errored" ) {
			return <PlaceholderImage isLarge={ this.props.isLarge }>
				{ __( "Select image", "yoast-components" ) }
			</PlaceholderImage>;
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
