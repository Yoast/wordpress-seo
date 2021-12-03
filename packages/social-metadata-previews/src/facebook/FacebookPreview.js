/* External dependencies */
import React, { Component } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

/* Internal dependencies */
import FacebookSiteUrlComponent from "./FacebookSiteUrl";
import FacebookImage from "./FacebookImage";
import FacebookTitle, { facebookTitleLineHeight } from "./FacebookTitle";
import FacebookDescription from "./FacebookDescription";

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
			return "527px";

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
	max-width: 527px;
`;

const FacebookTextWrapper = styled.div`
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
	flex-grow: 1;
	justify-content: ${ props => props.mode === "landscape" ? "flex-start" : "center" };
	font-size: 12px;
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
			maxLineCount: 0,
			descriptionLineCount: 0,
		};
		this.facebookTitleRef = React.createRef();

		this.onImageLoaded = this.onImageLoaded.bind( this );

		// Binding fields to onMouseHover to prevent arrow functions in JSX props.
		this.onImageEnter = this.props.onMouseHover.bind( this, "image" );
		this.onTitleEnter = this.props.onMouseHover.bind( this, "title" );
		this.onDescriptionEnter = this.props.onMouseHover.bind( this, "description" );
		this.onLeave = this.props.onMouseHover.bind( this, "" );

		// Binding fields to onSelect to prevent arrow functions in JSX props. Image field is handled in onImageClick function.
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
	 * Calculates the amount of lines the title spans.
	 *
	 * @returns {number} The amount of lines the title spans.
	 */
	getTitleLineCount() {
		const facebookTitleRefHeight = this.facebookTitleRef.current.offsetHeight;

		return ( facebookTitleRefHeight / facebookTitleLineHeight );
	}

	/**
	 * Sets the max line count if the image mode has been changed.
	 *
	 * @returns {void}
	 */
	maybeSetMaxLineCount() {
		const { imageMode, maxLineCount } = this.state;

		const currentMaxLineCount = imageMode === "landscape" ? 2 : 5;

		if ( currentMaxLineCount !== maxLineCount ) {
			this.setState( { maxLineCount: currentMaxLineCount } );
		}
	}

	/**
	 * Sets the max description line count if the max line count has been changed.
	 *
	 * @returns {void}
	 */
	maybeSetDescriptionLineCount() {
		const { descriptionLineCount, maxLineCount, imageMode } = this.state;
		const titleLineCount = this.getTitleLineCount();

		// Calculate new description line count.
		let maxDescriptionLineCount = maxLineCount - titleLineCount;
		// Exceptions for portait image mode.
		if ( imageMode === "portrait" ) {
			maxDescriptionLineCount = titleLineCount === 5 ? 0 : 4;
		}

		if ( maxDescriptionLineCount !== descriptionLineCount ) {
			this.setState( { descriptionLineCount: maxDescriptionLineCount } );
		}
	}

	/**
	 * Component updates.
	 *
	 * @returns {void}
	 */
	componentDidUpdate() {
		// Recalculate available lines for title and description.
		this.maybeSetMaxLineCount();
		this.maybeSetDescriptionLineCount();
	}

	/**
	 * Renders the FacebookPreview.
	 *
	 * @returns {ReactComponent} Either the PlaceholderImage component, the ErrorImage component or
	 * the TwitterImageContainer.
	 */
	render() {
		const { imageMode, maxLineCount, descriptionLineCount } = this.state;

		return (
			<FacebookPreviewWrapper
				id="facebookPreview"
				mode={ imageMode }
			>
				<FacebookImage
					src={ this.props.imageUrl || this.props.imageFallbackUrl }
					alt={ this.props.alt }
					onImageLoaded={ this.onImageLoaded }
					onImageClick={ this.props.onImageClick }
					onMouseEnter={ this.onImageEnter }
					onMouseLeave={ this.onLeave }
				/>
				<FacebookTextWrapper mode={ imageMode }>
					<FacebookSiteUrlComponent
						siteUrl={ this.props.siteUrl }
						mode={ imageMode }
					/>
					<FacebookTitle
						ref={ this.facebookTitleRef }
						onMouseEnter={ this.onTitleEnter }
						onMouseLeave={ this.onLeave }
						onClick={ this.onSelectTitle }
						lineCount={ maxLineCount }
					>
						{ this.props.title }
					</FacebookTitle>
					{ descriptionLineCount > 0 &&
						<FacebookDescription
							maxWidth={ determineTextContainerWidth( imageMode ) }
							onMouseEnter={ this.onDescriptionEnter }
							onMouseLeave={ this.onLeave }
							onClick={ this.onSelectDescription }
							lineCount={ descriptionLineCount }
						>
							{ this.props.description }
						</FacebookDescription>
					}
				</FacebookTextWrapper>
			</FacebookPreviewWrapper>
		);
	}
}

FacebookPreview.propTypes = {
	siteUrl: PropTypes.string.isRequired,
	title: PropTypes.string.isRequired,
	description: PropTypes.string,
	imageUrl: PropTypes.string,
	imageFallbackUrl: PropTypes.string,
	alt: PropTypes.string,
	onSelect: PropTypes.func,
	onImageClick: PropTypes.func,
	onMouseHover: PropTypes.func,
};

FacebookPreview.defaultProps = {
	description: "",
	alt: "",
	imageUrl: "",
	imageFallbackUrl: "",
	onSelect: () => {},
	onImageClick: () => {},
	onMouseHover: () => {},
};

export default FacebookPreview;
