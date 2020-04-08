/* External dependencies */
import React, { Component } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

/* Internal dependencies */
import TwitterSiteName from "./TwitterSiteName";
import TwitterImage from "../twitter/TwitterImage";
import TwitterTextWrapper from "./TwitterTextWrapper";
import { default as NoCaretTitle } from "./TwitterTitle";
import { default as NoCaretDescription } from "./TwitterDescription";
import { withCaretStyle } from "../../../social-metadata-forms/src/SocialMetadataPreviewForm.js";

const TwitterTitle = withCaretStyle( NoCaretTitle, true );
const TwitterDescription = withCaretStyle( NoCaretDescription, true );

const TwitterPreviewWrapper = styled.div`
	font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Ubuntu, "Helvetica Neue", sans-serif;
	font-size: 15px;
	font-weight: 400;
	line-height: 20px;
	width: 507px;
	border: 1px solid #E1E8ED;
	box-sizing: border-box;
	border-radius: 14px;
	color: #292F33;
	background: #FFFFFF;
	text-overflow: ellipsis;
	display: flex;
	
	&:hover {
		background: #f5f8fa;
		border: 1px solid rgba(136,153,166,.5);
	}
`;

/**
 * The wrapper for the summary_large_image twitter card.
 */
const LargeTwitterPreviewWrapper = styled( TwitterPreviewWrapper )`
	flex-direction: column;
	max-height: 370px;
`;

/**
 * The wrapper for the summary twitter card.
 */
const SmallTwitterPreviewWrapper = styled( TwitterPreviewWrapper )`
	flex-direction: row;
	height: 125px;
`;

/**
 * Renders TwitterPreview component.
 *
 * @param {object} props The props.
 *
 * @returns {React.Element} The rendered element.
 */
class TwitterPreview extends Component {
	/**
	 * The constructor.
	 *
	 * @param {Object} props The props.
	 *
	 * @returns {void}
	 */
	constructor( props ) {
		super( props );

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
	 * The render function.
	 *
	 * @returns {*} The rendered component.
	 */
	render() {
		const {
			isLarge,
			image,
			alt,
			title,
			description,
			siteName,
			activeField,
			hoveredField,
		} = this.props;

		const Wrapper = isLarge ? LargeTwitterPreviewWrapper : SmallTwitterPreviewWrapper;

		return (
			<Wrapper>
				<TwitterImage
					src={ image }
					alt={ alt }
					isLarge={ isLarge }
					onImageClick={ this.props.onImageClick }
					onMouseEnter={ this.onImageEnter }
					onMouseLeave={ this.onLeave }
					isActive={ activeField === "image" }
					isHovered={ hoveredField === "image" }
				/>
				<TwitterTextWrapper>
					<TwitterTitle
						onMouseEnter={ this.onTitleEnter }
						onMouseLeave={ this.onLeave }
						onClick={ this.onSelectTitle }
						isActive={ activeField === "title" }
						isHovered={ hoveredField === "title" }
					>
						{ title }
					</TwitterTitle>
					<TwitterDescription
						onMouseEnter={ this.onDescriptionEnter }
						onMouseLeave={ this.onLeave }
						onClick={ this.onSelectDescription }
						isActive={ activeField === "description" }
						isHovered={ hoveredField === "description" }
					>
						{ description }
					</TwitterDescription>
					<TwitterSiteName
						siteName={ siteName }
					/>
				</TwitterTextWrapper>
			</Wrapper>
		);
	}
}

TwitterPreview.propTypes = {
	siteName: PropTypes.string.isRequired,
	title: PropTypes.string.isRequired,
	description: PropTypes.string,
	isLarge: PropTypes.bool,
	image: PropTypes.string,
	alt: PropTypes.string,
	onSelect: PropTypes.func,
	onImageClick: PropTypes.func,
	onMouseHover: PropTypes.func,
	activeField: PropTypes.string,
	hoveredField: PropTypes.string,
};

TwitterPreview.defaultProps = {
	description: "",
	alt: "",
	image: "",
	activeField: "",
	hoveredField: "",
	onSelect: () => {},
	onImageClick: () => {},
	onMouseHover: () => {},
	isLarge: true,
};

export default TwitterPreview;
