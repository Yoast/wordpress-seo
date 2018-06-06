/* External dependencies */
import React from "react";
import ReactDOM from "react-dom";
import forEach from "lodash/forEach";
import debounce from "lodash/debounce";
import map from "lodash/map";
import { connect } from "react-redux";

/* Internal dependencies */
import SettingsReplacementVariableEditor from "./SettingsReplacementVariableEditor";
import SettingsTitleReplacementVariableEditor from "./SettingsTitleReplacementVariableEditor";
import { updateReplacementVariable } from "../redux/actions/snippetEditor";

class SettingsReplacementVariableEditors extends React.Component {
	constructor( props ) {
		super( props );

		this.registerToSeparatorChanges();
		this.replaceSeparator = debounce( this.props.updateReplacementVariable, 500 ).bind( this, "sep" );
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
			if ( ! reactReplacevarMetadesc ) {
				// TODO
				return null;
			}
			return ReactDOM.createPortal(
				<SettingsReplacementVariableEditor
					replacementVariables={ this.props.replacementVariables }
					titleTarget={ reactReplacevarTitle }
					descriptionTarget={ reactReplacevarMetadesc } />,
				targetElement
			);
		} );
	}
}

export default connect( state => ( {
	replacementVariables: state.snippetEditor.replacementVariables,
} ), {
	updateReplacementVariable,
} )( SettingsReplacementVariableEditors );
