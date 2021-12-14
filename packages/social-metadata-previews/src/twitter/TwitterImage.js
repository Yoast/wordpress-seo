/* External dependencies */
import React from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import { __ } from "@wordpress/i18n";
import { noop } from "lodash";

/* Internal dependencies */
import { SocialImage } from "../shared/SocialImage";
import {
	handleImage,
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
			max-width: ${ TWITTER_IMAGE_SIZES.landscapeWidth }px;
			${ border ? "border-bottom: 1px solid #E1E8ED;" : "" }
			border-radius: 14px 14px 0 0;
			`
		);
	}
	return (
		`
		width: ${ TWITTER_IMAGE_SIZES.squareWidth }px;
		${ border ? "border-right: 1px solid #E1E8ED;" : "" }
		border-radius: 14px 0 0 14px;
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
	${ props => props.isLarge && `height: ${ TWITTER_IMAGE_SIZES.landscapeHeight }px;` }
	border-top-left-radius: 14px;
	${ props => props.isLarge ? "border-top-right-radius" : "border-bottom-left-radius" }: 14px;
	border-style: dashed;
	border-width: 1px;
	// We're not using standard colors to increase contrast for accessibility.
	color: #006DAC;
	// We're not using standard colors to increase contrast for accessibility.
	background-color: #f1f1f1;
	text-decoration: underline;
	font-size: 14px;
	cursor: pointer;
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
			status: "loading",
		};

		this.socialMedium = "Twitter";
		this.handleTwitterImage = this.handleTwitterImage.bind( this );
		this.setState = this.setState.bind( this );
	}

	/**
	 * Handles setting the handled image properties on the state.
	 *
	 * @returns {void}
	 */
	async handleTwitterImage() {
		if ( this.props.src === null ) {
			return;
		}
		const newState = await handleImage( this.props.src, this.socialMedium, this.props.isLarge );
		this.setState( newState );
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
			this.handleTwitterImage();
		}
	}

	/**
	 * After the component has mounted, determine the properties of the TwitterImage.
	 *
	 * @returns {void}
	 */
	componentDidMount() {
		this.handleTwitterImage();
	}

	/**
	 * Renders the TwitterImage.
	 *
	 * @returns {ReactComponent} Either the PlaceholderImage component, the ErrorImage component or
	 * the TwitterImageContainer.
	 */
	render() {
		const { status, imageProperties } = this.state;

		if ( status === "loading" || this.props.src === "" || status === "errored" ) {
			return <PlaceholderImage
				isLarge={ this.props.isLarge }
				onClick={ this.props.onImageClick }
				onMouseEnter={ this.props.onMouseEnter }
				onMouseLeave={ this.props.onMouseLeave }
			>
				{ __( "Select image", "wordpress-seo" ) }
			</PlaceholderImage>;
		}

		return <TwitterImageContainer
			isLarge={ this.props.isLarge }
			onClick={ this.props.onImageClick }
			onMouseEnter={ this.props.onMouseEnter }
			onMouseLeave={ this.props.onMouseLeave }
		>
			<SocialImage
				imageProps={ {
					src: this.props.src,
					alt: this.props.alt,
					aspectRatio: TWITTER_IMAGE_SIZES.aspectRatio,
				} }
				width={ imageProperties.width }
				height={ imageProperties.height }
				imageMode={ imageProperties.mode }
			/>
		</TwitterImageContainer>;
	}
}

TwitterImage.propTypes = {
	isLarge: PropTypes.bool.isRequired,
	src: PropTypes.string,
	alt: PropTypes.string,
	onImageClick: PropTypes.func,
	onMouseEnter: PropTypes.func,
	onMouseLeave: PropTypes.func,
};

TwitterImage.defaultProps = {
	src: "",
	alt: "",
	onMouseEnter: noop,
	onImageClick: noop,
	onMouseLeave: noop,
};
