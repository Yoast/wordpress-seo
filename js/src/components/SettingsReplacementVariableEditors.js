/* External dependencies */
import React from "react";
import PropTypes from "prop-types";
import ReactDOM from "react-dom";
import forEach from "lodash/forEach";
import debounce from "lodash/debounce";
import map from "lodash/map";
import { connect } from "react-redux";
import { replacementVariablesShape } from "yoast-components/composites/Plugin/SnippetEditor/constants";

/* Internal dependencies */
import SettingsReplacementVariableEditor from "./SettingsReplacementVariableEditor";
import SettingsTitleReplacementVariableEditor from "./SettingsTitleReplacementVariableEditor";
import { updateReplacementVariable } from "../redux/actions/snippetEditor";

/**
 * Renders a Portal for each element passed to it as a prop.
 *
 * Also listens for changes in the separator radio buttons and
 * updates the store with the new separator on change.
 */
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
				return ReactDOM.createPortal(
					<SettingsTitleReplacementVariableEditor
						label="SEO title template"
						replacementVariables={ this.props.replacementVariables }
						target={ reactReplacevarTitle } />,
					targetElement
				);
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

SettingsReplacementVariableEditors.propTypes = {
	replacementVariables: replacementVariablesShape,
	elements: PropTypes.object,
};

export default connect( state => ( {
	replacementVariables: state.snippetEditor.replacementVariables,
} ), {
	updateReplacementVariable,
} )( SettingsReplacementVariableEditors );
