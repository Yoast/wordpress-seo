import React from "react";
import styled from "styled-components";
import { StyledSection, StyledSectionBase, StyledHeading, SettingsSnippetEditor } from "yoast-components";

const Section = styled( StyledSection )`
	margin-bottom: 2em;
	max-width: 640px;
	
	&${ StyledSectionBase } {
		padding: 0 0 16px;

		& ${ StyledHeading } {
			padding-left: 20px;
			font-size: 14.4px;
		}
	}
`;

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
			<Section
				headingLevel={ 3 }
				headingText="Snippet preview"
				headingIcon="eye"
				headingIconColor="#555" >
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
			</Section>
		);
	}
}

export default SettingsReplacementVariableEditor;
