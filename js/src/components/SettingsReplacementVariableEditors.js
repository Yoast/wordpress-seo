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

	/**
	 * Renders all replacement variable editor components.
	 *
	 * Renders a settings replacement variable editor in every given element in
	 * the editorElements props. It requires every element to have a data-react-
	 * replacevar-title-field-id, data-react-replacevar-metadesc-field-id
	 * attribute and data-react-replacevar-page-type to function properly.
	 * These attributes should point to existing (hidden) inputs in the DOM.
	 *
	 * @returns {Array<ReactElement>} An array of portals to instances of the
	 *                                settings replacement variable editor.
	 */
	renderEditors() {
		return map( this.props.editorElements, ( targetElement ) => {
			const {
				reactReplacevarTitleFieldId,
				reactReplacevarMetadescFieldId,
				reactReplacevarPageType,
				reactReplacevarPaperStyle,
			} = targetElement.dataset;
			return ReactDOM.createPortal(
				<SettingsReplacementVariableEditor
					replacementVariables={ this.props.replacementVariables }
					recommendedReplacementVariables={ this.props.recommendedReplacementVariables[ reactReplacevarPageType ] }
					titleTarget={ reactReplacevarTitleFieldId }
					descriptionTarget={ reactReplacevarMetadescFieldId }
					hasPaperStyle={ reactReplacevarPaperStyle === "1" }
				/>,
				targetElement
			);
		} );
	}

	/**
	 * Renders all replacement variable field components.
	 *
	 * Renders a settings replacement variable field in every given element in
	 * the singleFieldElements props. It requires every element to have a data-
	 * react-replacevar-field-id attribute and data-react-replacevar-page-type
	 * to function properly. This attribute should point to and existing
	 * (hidden) input in the DOM.
	 *
	 * @returns {Array<ReactElement>} An array of portals to instances of the
	 *                                settings replacement variable field.
	 */
	renderSingleFields() {
		return map( this.props.singleFieldElements, ( targetElement ) => {
			const {
				reactReplacevarFieldId,
				reactReplacevarFieldLabel,
				reactReplacevarPageType,
			} = targetElement.dataset;
			return ReactDOM.createPortal(
				<SettingsTitleReplacementVariableEditor
					label={ reactReplacevarFieldLabel }
					replacementVariables={ this.props.replacementVariables }
					recommendedReplacementVariables={ this.props.recommendedReplacementVariables[ reactReplacevarPageType ] }
					fieldId={ reactReplacevarFieldId } />,
				targetElement
			);
		} );
	}

	/**
	 * Renders the SettingsReplacementVariableEditors element.
	 *
	 * @returns {ReactElement} A fragment containing all editor instances.
	 */
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
	recommendedReplacementVariables: PropTypes.object,
	editorElements: PropTypes.object,
	singleFieldElements: PropTypes.object,
};

SettingsReplacementVariableEditors.defaultProps = {
	replacementVariables: [],
	recommendedReplacementVariables: {},
	editorElements: [],
	singleFieldElements: [],
};

export default connect( state => ( {
	replacementVariables: state.snippetEditor.replacementVariables,
	recommendedReplacementVariables: state.snippetEditor.recommendedReplacementVariables,
} ), {
	updateReplacementVariable,
} )( SettingsReplacementVariableEditors );
