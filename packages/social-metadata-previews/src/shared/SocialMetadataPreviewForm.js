import React, { Fragment } from "react";
import ImageSelect from "./ImageSelect";
import PropTypes from "prop-types";
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
			title={ `${ props.socialMediumName } image` }
			onClick={ props.selectFileClick }
			warnings={ props.imageWarnings }
		/>
		<ReplacementVariableEditor
			onChange={ props.onTitleChange }
			content={ props.title }
			replacementVariables={ props.replacementVariables }
			recommendedReplacementVariables={ props.recommendedReplacementVariables }
			type="title"
			label={ `${ props.socialMediumName } title` }
		/>
		<ReplacementVariableEditor
			onChange={ props.onDescriptionChange }
			content={ props.description }
			placeholder={ `Modify your ${ props.socialMediumName } description by editing it right here...` }
			replacementVariables={ props.replacementVariables }
			recommendedReplacementVariables={ props.recommendedReplacementVariables }
			type="description"
			label={ `${ props.socialMediumName } description` }
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
