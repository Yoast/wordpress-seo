import React, { Fragment } from "react";
import ImageSelect from "./ImageSelect";
import PropTypes from "prop-types";
import { ReplacementVariableEditor, replacementVariablesShape } from "@yoast/replacement-variable-editor";
import { __, sprintf } from "@wordpress/i18n";
import styled from "styled-components";
import { getDirectionalStyle } from "@yoast/helpers";
import { angleLeft, angleRight, colors } from "@yoast/style-guide";

/**
 * Sets the color based on whether the caret is active or not (usually hovered).
 * Display css prop sets the visibility, so this only needs to switch color.
 *
 * @param {*} active Whether to show the active color or the hover color.
 *
 * @returns {string} The color of the caret. Black if active, grey otherwise.
 */
const getCaretColor = ( active ) => {
	return active ? colors.$color_black : colors.$palette_grey;
};

const CaretContainer = styled.div`position: relative`;

const Caret = styled.div`
	position: absolute;
	display: ${ props => ( props.isActive || props.isHovered ) ? "block" : "none" };

	::before {
		position: absolute;
		top: 8px;
		${ getDirectionalStyle( "left", "right" ) }: -22px;
		width: 22px;
		height: 22px;
		background-image: url(
		${ props => getDirectionalStyle(
		angleRight( getCaretColor( props.isActive ) ),
		angleLeft( getCaretColor( props.isActive ) ) ) }
		);
		color: ${ props => getCaretColor( props.isActive ) };
		background-size: 24px;
		background-repeat: no-repeat;
		background-position: center;
		content: "";
	}
`;

Caret.propTypes = {
	isActive: PropTypes.bool,
	isHovered: PropTypes.bool,
};

Caret.propTypes = {
	isActive: false,
	isHovered: false,
};

/**
 * Adds Caret to a component.
 * @param {React.Element} Component The component to add a Caret to.
 *
 * @returns {React.Element} A component with added Caret.
 */
const withCaretStyle = ( Component ) => {
	return function ComponentWithCaret( props ) {
		return (
			<CaretContainer>
				{ /* eslint-disable-next-line react/prop-types */ }
				<Caret isActive={ props.isActive } isHovered={ props.isHovered } />
				<Component { ...props } />
			</CaretContainer>
		);
	};
};

const TitleWithCaret = withCaretStyle( ReplacementVariableEditor );
const DescriptionWithCaret = withCaretStyle( ReplacementVariableEditor );
const ImageSelectWithCaret = withCaretStyle( ImageSelect );

/**
 * A form with an image selection button, a title input field and a description field.
 *
 * @param {object} props The props for this component.
 *
 * @returns {React.Component} Returns a Fragment that contains all input fields.
 */
const SocialMetadataPreviewForm = ( props ) => {
	/* Translators: %s expands to the social medium name, i.e. Faceboook. */
	const imageSelectTitle = sprintf( __( "%s image", "yoast-components" ), props.socialMediumName );
	/* Translators: %s expands to the social medium name, i.e. Faceboook. */
	const titleEditorTitle = sprintf( __( "%s title", "yoast-components" ), props.socialMediumName );
	/* Translators: %s expands to the social medium name, i.e. Faceboook. */
	const descEditorTitle = sprintf( __( "%s desciption", "yoast-components" ), props.socialMediumName );
	/* Translators: %s expands to the social medium name, i.e. Faceboook. */
	const descEditorPlaceholder  = sprintf(
		/* Translators: %s expands to the social medium name, i.e. Faceboook. */
		__( "Modify your %s description by editing it right here...", "yoast-components" ),
		props.socialMediumName
	);

	/**
	 * @returns {void}
	 */
	function focusTitle() {
		props.onSelect( "title" );
	}

	/**
	 * @returns {void}
	 */
	function focusDescription() {
		props.onSelect( "description" );
	}

	return (
		<Fragment>
			<ImageSelectWithCaret
				title={ imageSelectTitle }
				onClick={ props.onSelectImageClick }
				onRemoveImageClick={ props.onRemoveImageClick }
				warnings={ props.imageWarnings }
				imageSelected={ props.imageSelected }
				isActive={ props.activeField === "image" }
				isHovered={ props.hoveredField === "image" }
				imageUrl={ props.imageUrl }
				isPremium={ props.isPremium }
			/>
			<TitleWithCaret
				onChange={ props.onTitleChange }
				content={ props.title }
				replacementVariables={ props.replacementVariables }
				recommendedReplacementVariables={ props.recommendedReplacementVariables }
				type="title"
				label={ titleEditorTitle }
				isActive={ props.activeField === "title" }
				isHovered={ props.hoveredField === "title" }
				onFocus={ focusTitle }
			/>
			<DescriptionWithCaret
				onChange={ props.onDescriptionChange }
				content={ props.description }
				placeholder={ descEditorPlaceholder }
				replacementVariables={ props.replacementVariables }
				recommendedReplacementVariables={ props.recommendedReplacementVariables }
				type="description"
				label={ descEditorTitle }
				isActive={ props.activeField === "description" }
				isHovered={ props.hoveredField === "description" }
				onFocus={ focusDescription }
			/>
		</Fragment>
	);
}
;

SocialMetadataPreviewForm.propTypes = {
	socialMediumName: PropTypes.oneOf( [ "Twitter", "Facebook" ] ).isRequired,
	onSelectImageClick: PropTypes.func.isRequired,
	onRemoveImageClick: PropTypes.func.isRequired,
	title: PropTypes.string.isRequired,
	description: PropTypes.string.isRequired,
	onTitleChange: PropTypes.func.isRequired,
	onDescriptionChange: PropTypes.func.isRequired,
	imageSelected: PropTypes.bool.isRequired,
	hoveredField: PropTypes.string,
	activeField: PropTypes.string,
	onSelect: PropTypes.func,
	isPremium: PropTypes.bool,
	replacementVariables: PropTypes.arrayOf( replacementVariablesShape ),
	recommendedReplacementVariables: PropTypes.arrayOf( PropTypes.string ),
	imageWarnings: PropTypes.array,
	imageUrl: PropTypes.string,
};

SocialMetadataPreviewForm.defaultProps = {
	replacementVariables: [],
	recommendedReplacementVariables: [],
	imageWarnings: [],
	hoveredField: "",
	activeField: "",
	onSelect: () => {},
	imageUrl: "",
	isPremium: false,
};

export default SocialMetadataPreviewForm;
