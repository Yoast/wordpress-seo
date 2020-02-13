import React, { Fragment } from "react";
import ImageSelect from "./ImageSelect";
import PropTypes from "prop-types";
import { __, sprintf } from "@wordpress/i18n";
import { ReplacementVariableEditor, replacementVariablesShape } from "@yoast/search-metadata-previews";

/**
 * A form with an image selection button, a title input field and a description field.
 *
 * @param {object} props The props for this component.
 *
 * @returns {React.Component} Returns a Fragment that contains all input fields.
 */
const SocialMetadataPreviewForm = ( props ) =>
	<Fragment>
		<ImageSelect
			title={ __( sprintf( "%s image", props.socialMediumName ), "yoast-components" ) }
			onClick={ props.selectFileClick }
			warnings={ props.imageWarnings }
		/>
		<ReplacementVariableEditor
			onChange={ props.onTitleChange }
			content={ props.title }
			replacementVariables={ props.replacementVariables }
			recommendedReplacementVariables={ props.recommendedReplacementVariables }
			type="title"
			label={ __( sprintf( "%s title", props.socialMediumName ), "yoast-components" ) }
		/>
		<ReplacementVariableEditor
			onChange={ props.onDescriptionChange }
			content={ props.description }
			placeholder={ __( sprintf( "Modify your %s description by editing it right here...", props.socialMediumName ), "yoast-components" ) }
			replacementVariables={ props.replacementVariables }
			recommendedReplacementVariables={ props.recommendedReplacementVariables }
			type="description"
			label={ __( sprintf( "%s description", props.socialMediumName ), "yoast-components" ) }
		/>
	</Fragment>
;

SocialMetadataPreviewForm.propTypes = {
	socialMediumName: PropTypes.oneOf( [ "Twitter", "Facebook" ] ).isRequired,
	replacementVariables: PropTypes.arrayOf( replacementVariablesShape ),
	recommendedReplacementVariables: PropTypes.arrayOf( PropTypes.string ),
	selectFileClick: PropTypes.func.isRequired,
	title: PropTypes.string.isRequired,
	description: PropTypes.string.isRequired,
	onTitleChange: PropTypes.func.isRequired,
	onDescriptionChange: PropTypes.func.isRequired,
	imageWarnings: PropTypes.array,
};

SocialMetadataPreviewForm.defaultProps = {
	replacementVariables: [],
	recommendedReplacementVariables: [],
	imageWarnings: [],
};

export default SocialMetadataPreviewForm;
