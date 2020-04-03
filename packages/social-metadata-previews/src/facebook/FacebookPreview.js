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
const determineWrapperHeight = ( mode ) => {
	switch ( mode ) {
		case "landscape":
			return "352px";

		case "square":
			return "158px";

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
			return "527x";

		case "square":
			return "369px";

		case "portrait":
			return "369px";

		default:
			return "476px";
	}
};

const FacebookPreviewWrapper = styled.div`
	box-sizing: border-box;
	display: flex;
	flex-direction: ${ props => props.mode === "landscape" ? "column" : "row" };
	background-color: #f2f3f5;
	overflow: hidden;
	width: 527px;
	height: ${ props => determineWrapperHeight( props.mode ) };
`;

const OuterTextWrapper = styled.div`
	box-sizing: border-box;
	background-color: #f2f3f5;
	margin: 0;
	padding: 10px 12px;
	position: relative;
	border-bottom: ${ props => props.mode === "landscape" ? "" : "1px solid #dddfe2" };
	border-top: ${ props => props.mode === "landscape" ? "" : "1px solid #dddfe2" };
	border-right: ${ props => props.mode === "landscape" ? "" : "1px solid #dddfe2" };
	border: ${ props => props.mode === "landscape" ? "1px solid #dddfe2" : "" };
	display: flex;
	flex-direction: column;
	justify-content: ${ props => props.mode === "landscape" ? "flex-start" : "center" };
	width: ${ props => determineTextContainerWidth( props.mode ) };
	${ props => props.mode === "landscape"  ? "height: 78px;" : "" }
	font-size: 12px;
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

		// Binding fields to onMouseHover to prevent arrow functions in JSX props.
		this.onTitleEnter = this.props.onMouseHover.bind( this, "title" );
		this.onDescriptionEnter = this.props.onMouseHover.bind( this, "description" );
		this.onLeave = this.props.onMouseHover.bind( this, "" );

		// Binding fields to onSelect to prevent arrow functions in JSX props.
		this.onSelectTitle = this.props.onSelect.bind( this, "title" );
		this.onSelectDescription = this.props.onSelect.bind( this, "description" );
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
					onSelectImage={ this.onSelectImage }
				/>
				<OuterTextWrapper mode={ imageMode }>
					<FacebookSiteAndAuthorNames
						siteName={ this.props.siteName }
						authorName={ this.props.authorName }
						mode={ imageMode }
					/>
					<FacebookTitle
						onMouseEnter={ this.onTitleEnter }
						onMouseLeave={ this.onLeave }
						onClick={ this.onSelectTitle }
					>
						{ this.props.title }
					</FacebookTitle>
					<FacebookDescription
						onMouseEnter={ this.onDescriptionEnter }
						onMouseLeave={ this.onLeave }
						onClick={ this.onSelectDescription }
						mode={ imageMode }
					>
						{ this.props.description }
					</FacebookDescription>
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
	onSelect: PropTypes.func,
	onMouseHover: PropTypes.func,
};

FacebookPreview.defaultProps = {
	authorName: "",
	description: "",
	alt: "",
	image: "",
	onSelect: () => {},
	onMouseHover: () => {},
};

export default FacebookPreview;
