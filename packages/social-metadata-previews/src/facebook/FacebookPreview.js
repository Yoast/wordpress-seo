/* External dependencies */
import React, { Component } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

/* Internal dependencies */
import FacebookSiteAndAuthorNames from "./FacebookSiteAndAuthorNames";
import FacebookImage from "./FacebookImage";
import FacebookTitle from "./FacebookTitle";
import FacebookDescription from "./FacebookDescription";

/**
 * Determines the height depending on the mode.
 *
 * @param {string} mode The mode. landscape, square, portrait.
 *
 * @returns {string} The height pixels.
 */
const determineTextContainerHeight = ( mode ) => {
	switch ( mode ) {
		case "landscape":
			return "57px";

		case "square":
			return "136px";

		case "portrait":
			return "215px";

		default:
			return "57px";
	}
};

/**
 * Determines the width depending on the mode.
 *
 * @param {string} mode The mode. landscape, square, portrait.
 *
 * @returns {string} The width pixels.
 */
const determineTextContainerWidth = ( mode ) => {
	switch ( mode ) {
		case "landscape":
			return "474px";

		case "square":
			return "318px";

		case "portrait":
			return "318px";

		default:
			return "474px";
	}
};

const FacebookPreviewWrapper = styled.div`
	display: flex;
	flex-wrap: wrap;
	flex-direction: ${ props => props.mode === "landscape" ? "column" : "row" };
	background-color: #f2f3f5;
	max-width: none;
	border: none;
	box-shadow: none;
	border: 1px solid #dddfe2;
	border-radius: 0;
	zoom: 1;
	overflow: hidden;
	position: relative;
	z-index: 0;
	width: 500px;
`;

const OuterTextWrapper = styled.div`
	background-color: #f2f3f5;
	margin: 0;
	padding: 10px 12px;
	position: relative;
	border-bottom: ${ props => props.mode === "landscape" ? "" : "1px solid #dddfe2" };
	border-top: ${ props => props.mode === "landscape" ? "" : "1px solid #dddfe2" };
	border: ${ props => props.mode === "landscape" ? "1px solid #dddfe2" : "" };
	width: ${ props => determineTextContainerWidth( props.mode ) };
	height: ${ props => determineTextContainerHeight( props.mode ) };
	display: flex;
	flex-direction: column;
	justify-content: center;
`;

const InnerTextWrapper = styled.div`
	display: flex;
	flex-direction: column;
	justify-content: center;
	height: 136px;
	font-size: 12px;
	margin: 0;
	max-height: 190px;
`;

const TitleAndDescriptionWrapper = styled.div`
	max-height: 46px;
	overflow: hidden;
`;

/**
 * Renders FacebookPreview component.
 *
 * @param {object} props The props.
 *
 * @returns {React.Element} The rendered element.
 */
class FacebookPreview extends Component {
	/**
	 * The constructor.
	 *
	 * @param {Object} props The component's props.
	 */
	constructor( props ) {
		super( props );
		this.state = {
			imageMode: null,
		};
		this.onImageLoaded = this.onImageLoaded.bind( this );
	}

	/**
	 * Retrieves the imageMode from the Facebook image container.
	 *
	 * @param {string} mode The Facebook image mode: landscape, portrait or square.
	 *
	 * @returns {void} Void.
	 */
	onImageLoaded( mode ) {
		this.setState( { imageMode: mode } );
	}

	/**
	 * Renders the FacebookPreview.
	 *
	 * @returns {ReactComponent} Either the PlaceholderImage component, the ErrorImage component or
	 * the TwitterImageContainer.
	 */
	render() {
		const { imageMode } = this.state;
		return (
			<FacebookPreviewWrapper mode={ imageMode }>
				<FacebookImage
					src={ this.props.image }
					alt={ this.props.alt }
					onImageLoaded={ this.onImageLoaded }
				/>
				<OuterTextWrapper mode={ imageMode }>
					<InnerTextWrapper>
						<FacebookSiteAndAuthorNames
							siteName={ this.props.siteName }
							authorName={ this.props.authorName }
							mode={ imageMode }
						/>
						<TitleAndDescriptionWrapper>
							<FacebookTitle title={ this.props.title } />
							<FacebookDescription>
								{ this.props.description }
							</FacebookDescription>
						</TitleAndDescriptionWrapper>
					</InnerTextWrapper>
				</OuterTextWrapper>
			</FacebookPreviewWrapper>
		);
	}
}

FacebookPreview.propTypes = {
	siteName: PropTypes.string.isRequired,
	title: PropTypes.string.isRequired,
	authorName: PropTypes.string,
	description: PropTypes.string,
	image: PropTypes.string,
	alt: PropTypes.string,
};

FacebookPreview.defaultProps = {
	authorName: "",
	description: "",
	alt: "",
	image: "",
};

export default FacebookPreview;
