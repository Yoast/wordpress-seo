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
 * @param {string} color The color to render the caret in.
 * @param {string} mode The mode the snippet preview is in.
 *
 * @returns {ReactComponent} The component with caret styles.
 */
function addCaretStyle( WithoutCaret ) {
	return styled( WithoutCaret )`
		&::before {
			display: block;
			position: relative;
			top: 0;
			${ getDirectionalStyle( "left", "right" ) }: ${ () => "-22px" };
			width: 22px;
			height: 22px;
			background-image: url( ${ getDirectionalStyle( angleRight( colors.$color_black ), angleLeft( colors.$color_snippet_hover ) ) } );
			background-size: 24px;
			background-repeat: no-repeat;
			background-position: center;
			content: "";
		}
	`;
}

const CaretContainer = addCaretStyle( styled.div`` );

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

	return (
		<Fragment>
			<ImageSelect
				title={ imageSelectTitle }
				onClick={ props.onSelectImageClick }
				onRemoveImageClick={ props.onRemoveImageClick }
				warnings={ props.imageWarnings }
				imageSelected={ props.imageSelected }
				imageUrl={ props.imageUrl }
				isPremium={ props.isPremium }
			/>
			<CaretContainer>
				<ReplacementVariableEditor
					onChange={ props.onTitleChange }
					content={ props.title }
					replacementVariables={ props.replacementVariables }
					recommendedReplacementVariables={ props.recommendedReplacementVariables }
					type="title"
					label={ titleEditorTitle }
				/>
			</CaretContainer>
			<CaretContainer>
				<ReplacementVariableEditor
					onChange={ props.onDescriptionChange }
					content={ props.description }
					placeholder={ descEditorPlaceholder }
					replacementVariables={ props.replacementVariables }
					recommendedReplacementVariables={ props.recommendedReplacementVariables }
					type="description"
					label={ descEditorTitle }
				/>
			</CaretContainer>
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
	imageUrl: "",
};

export default SocialMetadataPreviewForm;
