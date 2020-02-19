import React, { Fragment } from "react";
import ImageSelect from "./ImageSelect";
import PropTypes from "prop-types";
import { ReplacementVariableEditor, replacementVariablesShape } from "@yoast/search-metadata-previews";
import { __, sprintf } from "@wordpress/i18n";

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
			/>
			<ReplacementVariableEditor
				onChange={ props.onTitleChange }
				content={ props.title }
				replacementVariables={ props.replacementVariables }
				recommendedReplacementVariables={ props.recommendedReplacementVariables }
				type="title"
				label={ titleEditorTitle }
			/>
			<ReplacementVariableEditor
				onChange={ props.onDescriptionChange }
				content={ props.description }
				placeholder={ descEditorPlaceholder }
				replacementVariables={ props.replacementVariables }
				recommendedReplacementVariables={ props.recommendedReplacementVariables }
				type="description"
				label={ descEditorTitle }
			/>
		</Fragment>
	);
}
;

SocialMetadataPreviewForm.propTypes = {
	socialMediumName: PropTypes.oneOf( [ "Twitter", "Facebook" ] ).isRequired,
	replacementVariables: PropTypes.arrayOf( replacementVariablesShape ),
	recommendedReplacementVariables: PropTypes.arrayOf( PropTypes.string ),
	onSelectImageClick: PropTypes.func.isRequired,
	onRemoveImageClick: PropTypes.func.isRequired,
	title: PropTypes.string.isRequired,
	description: PropTypes.string.isRequired,
	onTitleChange: PropTypes.func.isRequired,
	onDescriptionChange: PropTypes.func.isRequired,
	imageWarnings: PropTypes.array,
	imageSelected: PropTypes.bool.isRequired,
};

SocialMetadataPreviewForm.defaultProps = {
	replacementVariables: [],
	recommendedReplacementVariables: [],
	imageWarnings: [],
};

export default SocialMetadataPreviewForm;
