/* External dependencies */
import { Component } from "@wordpress/element";
import PropTypes from "prop-types";
import {
	ReplacementVariableEditor,
	replacementVariablesShape,
	recommendedReplacementVariablesShape,
} from "@yoast/replacement-variable-editor";
import styled from "styled-components";

/* Internal dependencies */
import linkHiddenFields, { linkFieldsShape } from "./higherorder/linkHiddenField";

const SnippetEditorWidthContainer = styled.div`
	display: flex;
	flex-wrap: wrap;
	align-items: center;
	justify-content: space-between;
	max-width: 640px;
`;

/**
 * Component class for the Settings replacement variable field.
 */
class SettingsReplacementVariableField extends Component {
	/**
	 * Constructor.
	 *
	 * @param {object} props The props.
	 */
	constructor( props ) {
		super( props );

		this.state = {
			isActive: false,
			isHovered: false,
		};

		this.focus  = this.focus.bind( this );
		this.setRef = this.setRef.bind( this );
	}

	/**
	 * Focus the input ref.
	 *
	 * @returns {void}
	 */
	focus() {
		this.inputRef.focus();
	}

	/**
	 * Sets the input ref.
	 *
	 * @param {Object} ref The input ref.
	 *
	 * @returns {void}
	 */
	setRef( ref ) {
		this.inputRef = ref;
	}

	/**
	 * Renders the field.
	 *
	 * @returns {wp.Element} The field.
	 */
	render() {
		const {
			label,
			replacementVariables,
			recommendedReplacementVariables,
			field,
			fieldId,
		} = this.props;

		return (
			<SnippetEditorWidthContainer>
				<ReplacementVariableEditor
					type="title"
					label={ label }
					fieldId={ fieldId + "-snippet-editor" }
					isActive={ this.state.isActive }
					isHowvered={ this.state.isHovered }
					content={ field.value }
					onChange={ field.onChange }
					onFocus={ this.focus }
					replacementVariables={ replacementVariables }
					recommendedReplacementVariables={ recommendedReplacementVariables }
					editorRef={ this.setRef }
				/>
			</SnippetEditorWidthContainer>
		);
	}
}

SettingsReplacementVariableField.propTypes = {
	replacementVariables: replacementVariablesShape,
	recommendedReplacementVariables: recommendedReplacementVariablesShape,
	label: PropTypes.string.isRequired,
	fieldId: PropTypes.string.isRequired,
	field: linkFieldsShape,
};

export default linkHiddenFields( props => {
	return [
		{
			name: "field",
			fieldId: props.fieldId,
		},
	];
} )( SettingsReplacementVariableField );
