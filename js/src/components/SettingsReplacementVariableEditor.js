/* External dependencies */
import React from "react";
import PropTypes from "prop-types";
import { SettingsSnippetEditor } from "yoast-components";
import { __ } from "@wordpress/i18n";
import {
	replacementVariablesShape,
	recommendedReplacementVariablesShape,
} from "yoast-components/composites/Plugin/SnippetEditor/constants";

/* Internal dependencies */
import SnippetPreviewSection from "./SnippetPreviewSection";
import linkHiddenFields, { linkFieldsShape } from "./higherorder/linkHiddenField";

class SettingsReplacementVariableEditor extends React.Component {
	constructor( props ) {
		super( props );
	}

	render() {
		const {
			title,
			description,
			replacementVariables,
			recommendedReplacementVariables,
		} = this.props;

		return (
			<SnippetPreviewSection
				hasPaperStyle={ this.props.hasPaperStyle }
			>
				<SettingsSnippetEditor
					descriptionEditorFieldPlaceholder={ __( "Modify your meta description by editing it right here", "wordpress-seo" ) }
					onChange={ ( field, value ) => {
						switch( field ) {
							case "title":
								title.onChange( value );
								break;
							case "description":
								description.onChange( value );
								break;
						}
					} }
					replacementVariables={ replacementVariables }
					recommendedReplacementVariables={ recommendedReplacementVariables }
					data={ {
						title: title.value,
						description: description.value,
					} }
					hasPaperStyle={ this.props.hasPaperStyle }
				/>
			</SnippetPreviewSection>
		);
	}
}

SettingsReplacementVariableEditor.propTypes = {
	replacementVariables: replacementVariablesShape,
	recommendedReplacementVariables: recommendedReplacementVariablesShape,
	title: linkFieldsShape,
	description: linkFieldsShape,
	postType: PropTypes.string,
	hasPaperStyle: PropTypes.bool,
};

SettingsReplacementVariableEditor.defaultProps = {
	hasPaperStyle: true,
};

export default linkHiddenFields( props => {
	return [
		{
			name: "title",
			fieldId: props.titleTarget,
		},
		{
			name: "description",
			fieldId: props.descriptionTarget,
		},
	];
} )( SettingsReplacementVariableEditor );
