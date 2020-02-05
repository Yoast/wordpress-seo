import React, { Fragment } from "react";
import ImageSelect from "./ImageUpload";
import PropTypes from "prop-types";
import { ReplacementVariableEditor, replacementVariablesShape } from "@yoast/search-metadata-previews";

const SocialMetadataPreviewForm = ( props ) => {
	return (
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
				buttonName="Insert variable"
				showPlusButton={ false }
			/>
			<ReplacementVariableEditor
				onChange={ props.onDescriptionChange }
				content={ props.description }
				placeholder={ `Modify your ${ props.socialMediumName } description by editing it right here...` }
				replacementVariables={ props.replacementVariables }
				recommendedReplacementVariables={ props.recommendedReplacementVariables }
				type="description"
				label={ `${ props.socialMediumName } description` }
				buttonName="Insert variable"
				showPlusButton={ false }
			/>
		</Fragment>
	);
};

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
