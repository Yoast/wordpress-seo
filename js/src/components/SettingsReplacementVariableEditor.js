/* External dependencies */
import React from "react";
import { SettingsSnippetEditor } from "yoast-components";
import { __ } from "@wordpress/i18n";

/* Internal dependencies */
import SnippetPreviewSection from "./SnippetPreviewSection";
import linkHiddenFields from "./higherorder/linkHiddenField";

class SettingsReplacementVariableEditor extends React.Component {
	constructor( props ) {
		super( props );

		this.state = {
			mode: "mobile",
		};
	}

	render() {
		return (
			<SnippetPreviewSection>
				<SettingsSnippetEditor
					descriptionPlaceholder={ __( "Your meta description", "wordpress-seo" ) }
					descriptionEditorFieldPlaceholder={ __( "Modify your meta description by editing it right here", "wordpress-seo" ) }
					onChange={ ( field, value ) => {
						switch( field ) {
							case "title":
								this.props.title.onChange( value ); break;
							case "description":
								this.props.description.onChange( value ); break;
							case "mode":
								this.setState( { mode: value } ); break;
						}
					} }
					replacementVariables={ this.props.replacementVariables }
					baseUrl="http://example.com/"
					data={ {
						title: this.props.title.value,
						slug: "category/example",
						description: this.props.description.value,
					} }
					mode={ this.state.mode } />
			</SnippetPreviewSection>
		);
	}
}

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
