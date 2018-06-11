/* External dependencies */
import React from "react";
import PropTypes from "prop-types";
import ReactDOM from "react-dom";
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
	}

	renderEditors() {
		return map( this.props.editorElements, ( targetElement ) => {
			const {
				reactReplacevarTitleFieldId,
				reactReplacevarMetadescFieldId,
			} = targetElement.dataset;
			return ReactDOM.createPortal(
				<SettingsReplacementVariableEditor
					replacementVariables={ this.props.replacementVariables }
					titleTarget={ reactReplacevarTitleFieldId }
					descriptionTarget={ reactReplacevarMetadescFieldId } />,
				targetElement
			);
		} );
	}

	renderSingleFields() {
		return map( this.props.singleFieldElements, ( targetElement ) => {
			const {
				reactReplacevarFieldId,
				reactReplacevarFieldLabel,
			} = targetElement.dataset;
			return ReactDOM.createPortal(
				<SettingsTitleReplacementVariableEditor
					label={ reactReplacevarFieldLabel }
					replacementVariables={ this.props.replacementVariables }
					fieldId={ reactReplacevarFieldId } />,
				targetElement
			);
		} );
	}

	render() {
		return (
			<React.Fragment>
				{ this.renderEditors() }
				{ this.renderSingleFields() }
			</React.Fragment>
		);
	}
}

SettingsReplacementVariableEditors.propTypes = {
	replacementVariables: replacementVariablesShape,
	editorElements: PropTypes.object,
	singleFieldElements: PropTypes.object,
};

SettingsReplacementVariableEditors.defaultProps = {
	replacementVariables: [],
	editorElements: [],
	singleFieldElements: [],
};

export default connect( state => ( {
	replacementVariables: state.snippetEditor.replacementVariables,
} ), {
	updateReplacementVariable,
} )( SettingsReplacementVariableEditors );
