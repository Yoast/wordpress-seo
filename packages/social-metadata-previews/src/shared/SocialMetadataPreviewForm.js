import React, { Fragment } from "react";
import ImageSelect from "./ImageUpload";
import PropTypes from "prop-types";
import { ReplacementVariableEditor, replacementVariablesShape } from "@yoast/search-metadata-previews";

const SocialMetadataPreviewForm = ( props ) => {
	return (
		<Fragment>
			<ImageSelect
				title={ `${ props.socialMediumName } image` }
				onClick={ () => alert( "YOU CLICKED THE SELECT IMAGE BUTTON!" ) }
			/>
			<ReplacementVariableEditor
				onChange={ () => {}}
				content="%%title%% %%page%% %%sep%% %%sitename%%"
				replacementVariables={ props.replacementVariables }
				recommendedReplacementVariables={ props.recommendedReplacementVariables }
				type="title"
				label={ `${ props.socialMediumName } title` }
			/>
			<ReplacementVariableEditor
				onChange={ () => {}}
				content={""}
				replacementVariables={ props.replacementVariables }
				recommendedReplacementVariables={ props.recommendedReplacementVariables }
				type="description"
				label={ `${ props.socialMediumName } description` }
			/>
		</Fragment>
	);
};

SocialMetadataPreviewForm.propTypes = {
	socialMediumName: PropTypes.oneOf( [ "Twitter", "Facebook" ] ).isRequired,
	replacementVariables: PropTypes.arrayOf( replacementVariablesShape ),
	recommendedReplacementVariables: PropTypes.arrayOf( PropTypes.string )
};

SocialMetadataPreviewForm.defaultProps = {
	replacementVariables: [],
	recommendedReplacementVariables: [],
};

export default SocialMetadataPreviewForm;
