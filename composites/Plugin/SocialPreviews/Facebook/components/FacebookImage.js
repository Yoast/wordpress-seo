import React, { Fragment } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import determineFacebookImageDimensions from "../helpers/determineFacebookImageDimensions";

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
	height: ${ props => props.mode === "landscape" ? "261px" : ( props.mode === "square" ? "158px" : "236px" ) };
	width: ${ props => props.mode === "landscape" ? "500px" : "158px" };
`;

const ErrorImage = styled.div`
	height: 261px;
	width: 500px;
	background-color: #fff;
`;

/**
 * Renders the FacebookImage component.
 *
 * @param {string} src The image source
 *
 * @returns {ReactComponent} The FacebookImage component.
 */

export default class FacebookImage extends React.Component {
	constructor( props ) {
		super( props )
		this.state= {
			imageProperties: {},
		}
	}

	componentDidMount() {
		determineFacebookImageDimensions( this.props.src ).then( ( imageProperties ) => {
			this.setState( { imageProperties: imageProperties } );
		} ).catch(
			this.setState( { imageProperties: null } )
		)
	}

	render() {
		console.log(this.state.imageProperties)

		return (
			<Fragment>
				{ this.state.imageProperties === null && <ErrorImage>Error loading image</ErrorImage> }
				{ this.state.imageProperties !== null && <FacebookImageContainer mode={ this.state.imageProperties.mode }>
					<StyledImage src={ this.props.src } mode={ this.state.imageProperties.mode } />
				</FacebookImageContainer> }
			</Fragment>
		);
	}
	// 	determineFacebookImageDimensions( props.src ).then( ( imageProperties ) => {
	// 	console.log("imageProperties", imageProperties);
	// 	return <FacebookImageContainer mode={ imageProperties.mode }>
	// 		<StyledImage mode={ imageProperties.mode } />
	// 	</FacebookImageContainer>;
	// } ).catch( () => { return <ErrorImage>Error loading image</ErrorImage> } );


}

FacebookImage.propTypes = {
	src: PropTypes.string.isRequired,
};

