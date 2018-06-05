/* External dependencies */
import React from "react";
import { SettingsSnippetEditor } from "yoast-components";

/* Internal dependencies */
import SnippetPreviewSection from "./SnippetPreviewSection";

class SettingsReplacementVariableEditor extends React.Component {
	constructor( props ) {
		super( props );

		this.setElement( "title", props.titleTarget );
		this.setElement( "description", props.descriptionTarget );
	}

	setElement( targetName, targetId ) {
		if( ! this.elements ) {
			this.elements = {};
		}
		if( ! this.state ) {
			this.state = {};
		}

		const element = document.getElementById( targetId );

		this.elements[ targetName ] = document.getElementById( targetId );

		if( element ) {
			this.elements[ targetName ] = element;
			this.state = {
				...this.state,
				[ targetName ]: element.value,
			};
		}
	}

	onChange( field, value ) {
		this.setState( {
			[ field ]: value,
		}, () => {
			// Necessary because there is no field for "mode"
			if ( this.elements[ field ] ) {
				this.elements[ field ].value = value;
			}
		} );
	}

	render() {
		return (
			<SnippetPreviewSection>
				<SettingsSnippetEditor
					onChange={ this.onChange.bind( this ) }
					replacementVariables={ this.props.replacementVariables }
					baseUrl="http://local.wordpress.test"
					data={ {
						title: this.state.title,
						slug: "",
						description: this.state.description,
					} }
					mode={ this.state.mode } />
			</SnippetPreviewSection>
		);
	}
}

export default SettingsReplacementVariableEditor;
