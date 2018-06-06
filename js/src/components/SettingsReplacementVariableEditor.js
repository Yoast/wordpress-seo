/* External dependencies */
import React from "react";
import { SettingsSnippetEditor } from "yoast-components";

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
					baseUrl="http://local.wordpress.test"
					data={ {
						title: this.props.title.value,
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
