import React from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import determineFacebookImageProperties from "../helpers/determineFacebookImageProperties";
import colors from "../../../../../style-guide/colors.json";

const StyledImage = styled.img`
	min-height: initial;
	height: ${ props => props.mode === "landscape" ? "auto" : "100%" };
	width: ${ props => props.mode === "portrait" ? "auto" : "100%" };
	position: relative;
`;

const FacebookImageContainer = styled.div`
	line-height: 0;
	position: relative;
	z-index: 1;
	overflow: hidden;
	display: block;
	background-color: #fff;
	height: ${ props => props.dimensions.height };
	width: ${ props => props.dimensions.width };
	display: flex;
	justify-content: center;
`;

const ErrorImage = styled.div`
	height: 261px;
	width: 500px;
	text-align: center;
	box-sizing: border-box;
	padding-top: 7em;
	font-size: 1rem;
	color: ${colors.$color_white};
	background-color: ${colors.$color_red};
`;

const PlaceholderImage = styled.div`
	height: 261px;
	width: 500px;
	background-color: ${colors.$color_grey};
`;

/**
 * Renders the FacebookImage component.
 *
 * @param {string} src The image source
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
	 * @returns {void}
	 */
	componentDidMount() {
		determineFacebookImageProperties( this.props.src ).then( ( imageProperties ) => {
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
		}
		);
	}

	/**
	 * Gets the dimensions for the Facebook image container.
	 *
	 * @param {string} imageMode The facebook image mode: either landscape, square or portrait.
	 *
	 * @returns {Object} The width and height for the container.
	 */
	getContainerDimensions( imageMode ) {
		switch ( imageMode ) {
			case "landscape":
				return {
					height: "261px",
					width: "500px",
				};
			case "square":
				return {
					height: "158px",
					width: "158px",
				};
			case "portrait":
			default:
				return {
					height: "236px",
					width: "158px",
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
			return <ErrorImage>The given image url cannot be loaded</ErrorImage>;
		}
		if ( imageProperties.height < 158 || imageProperties.width < 158 ) {
			return <ErrorImage>The image you selected is too small for Facebook</ErrorImage>;
		}

		const containerDimensions = this.getContainerDimensions( imageProperties.mode );
		return <FacebookImageContainer mode={ imageProperties.mode } dimensions={ containerDimensions }>
			<StyledImage src={ this.props.src } mode={ imageProperties.mode } />
		</FacebookImageContainer>;
	}
}

FacebookImage.propTypes = {
	src: PropTypes.string.isRequired,
};

