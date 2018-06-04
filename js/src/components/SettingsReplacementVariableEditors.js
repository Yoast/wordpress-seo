import React from "react";
import ReactDOM from "react-dom";
import forEach from "lodash/forEach";
import debounce from "lodash/debounce";
import map from "lodash/map";

import SettingsReplacementVariableEditor from "./SettingsReplacementVariableEditor";

class SettingsReplacementVariableEditors extends React.Component {
	constructor( props ) {
		super( props );

		this.state = {
			replacementVariables: window.wpseoReplaceVarsL10n,
		};

		this.registerToSeparatorChanges();
		this.replaceSeparator = debounce( this.replaceSeparator, 500 ).bind( this );
	}

	replaceSeparator( newSeparator ) {
		const { replacementVariables } = this.state;

		const index = this.state.replacementVariables.findIndex( replacementVariable => {
			return replacementVariable.name === "sep";
		} );

		if( index === -1 ) {
			return;
		}

		const name = replacementVariables[ index ].name;

		const newestArray = [ ...replacementVariables ];
		newestArray[ index ] = {
			name,
			value: newSeparator,
		};

		this.setState( {
			replacementVariables: newestArray,
		} );
	}

	registerToSeparatorChanges() {
		this.labels = {};
		forEach( SettingsReplacementVariableEditors.getSeparatorRadioButtons(), radioButton => {
			// Get label and save the innerText (separator) in an object using the id as an ID.
			const radioButtonId = radioButton.id;
			const label = document.querySelector( `label[for=${ radioButtonId }]` );
			if( label && label.innerText !== "" ) {
				this.labels[ radioButtonId ] = label.innerText;
			}

			radioButton.addEventListener( "change", event => {
				const newSeparator = this.labels[ event.target.id ];
				if( newSeparator ) {
					this.replaceSeparator( newSeparator );
				}
			} );
		} );
	}

	static getSeparatorRadioButtons() {
		try {
			const fieldSet = document.getElementById( "separator" );
			return fieldSet.querySelectorAll( "input[type=radio]" );
		} catch( err ) {
			console.error( err );
			return null;
		}
	}

	render() {
		return map( this.props.elements, ( targetElement ) => {
			const {
				reactReplacevarTitle,
				reactReplacevarMetadesc,
			} = targetElement.dataset;
			return ReactDOM.createPortal(
				<SettingsReplacementVariableEditor
					replacementVariables={ this.state.replacementVariables }
					titleTarget={ reactReplacevarTitle }
					descriptionTarget={ reactReplacevarMetadesc } />,
				targetElement
			);
		} );
	}
}

export default SettingsReplacementVariableEditors;
