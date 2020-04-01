/* External dependencies */
import React, { Component } from "react";
import PropTypes from "prop-types";

/* Internal dependencies */
import { SocialMetadataPreviewForm } from "@yoast/social-metadata-forms";
import FacebookPreview from "../facebook/FacebookPreview";
import { recommendedReplacementVariablesShape, replacementVariablesShape } from "@yoast/replacement-variable-editor";

class SocialPreviewEditor extends Component {
	constructor() {
		super();

		this.state = {
			activeField: "",
			hoveredField: "",
		};
	}

	render() {
		const {
			onDescriptionChange,
			onTitleChange,
			onSelectImageClick,
			onRemoveImageClick,
			imageWarnings,
			siteName,
			description,
			image,
			alt,
			title,
			replacementVariables,
			recommendedReplacementVariables,
		} = this.props;

		return (
			<React.Fragment>
				<FacebookPreview
					onMouseHover={ console.log }
					siteName={ siteName }
					title={ title }
					description={ description }
					image={ image }
					alt={ alt }
				/>
				<SocialMetadataPreviewForm
					onDescriptionChange={ onDescriptionChange }
					socialMediumName="Facebook"
					title={ title }
					onRemoveImageClick={ onRemoveImageClick }
					imageSelected={ !! image }
					onTitleChange={ onTitleChange }
					onSelectImageClick={ onSelectImageClick }
					description={ description }
					imageWarnings={ imageWarnings }
					replacementVariables={ replacementVariables }
					recommendedReplacementVariables={ recommendedReplacementVariables }
				/>
			</React.Fragment>
		);
	}
}

SocialPreviewEditor.propTypes = {
	title: PropTypes.string.isRequired,
	onTitleChange: PropTypes.func.isRequired,
	description: PropTypes.string.isRequired,
	onDescriptionChange: PropTypes.func.isRequired,
	image: PropTypes.string.isRequired,
	alt: PropTypes.string.isRequired,
	onSelectImageClick: PropTypes.func.isRequired,
	onRemoveImageClick: PropTypes.func.isRequired,
	imageWarnings: PropTypes.array,
	siteName: PropTypes.string.isRequired,
	replacementVariables: PropTypes.arrayOf( replacementVariablesShape ),
	recommendedReplacementVariables: PropTypes.arrayOf( recommendedReplacementVariablesShape ),
};

SocialPreviewEditor.defaultProps = {
	imageWarnings: [],
	recommendedReplacementVariables: [],
	replacementVariables: [],
};

export default SocialPreviewEditor;
