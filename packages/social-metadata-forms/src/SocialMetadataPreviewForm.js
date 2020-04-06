import React, { Fragment } from "react";
import ImageSelect from "./ImageSelect";
import PropTypes from "prop-types";
import { ReplacementVariableEditor, replacementVariablesShape } from "@yoast/replacement-variable-editor";
import { __, sprintf } from "@wordpress/i18n";
import styled from "styled-components";
import { getDirectionalStyle } from "@yoast/helpers";
import { angleLeft, angleRight, colors } from "@yoast/style-guide";

/**
 * Adds caret styles to a component.
 *
 * @param {ReactComponent} WithoutCaret The component without caret styles.
 *
 * @returns {ReactComponent} The component with caret styles.
 */
function addCaretStyle( WithoutCaret ) {
	const WithCaret = styled( WithoutCaret )`
		&::before {
			display: ${ props => ( props.isActive || props.isHovered ) ? "block" : "none" };
			position: absolute;
			top: 0;
			${ getDirectionalStyle( "left", "right" ) === "left" ? "left: -22px" : "right: 5px" };
			width: 22px;
			height: 22px;
			background-image: url( ${ getDirectionalStyle( angleRight( colors.$color_black ), angleLeft( colors.$color_black ) ) } );
			background-size: 24px;
			background-repeat: no-repeat;
			background-position: center;
			content: "";
		}
	`;

	return WithCaret;
}


const TitleWithCaret = addCaretStyle( ReplacementVariableEditor );
const DescriptionWithCaret = addCaretStyle( ReplacementVariableEditor );
const ImageSelectWithCaret = addCaretStyle( ImageSelect );

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
			<div>
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
			</div>
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
	isPremium: PropTypes.bool.isRequired,
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
};

export default SocialMetadataPreviewForm;
