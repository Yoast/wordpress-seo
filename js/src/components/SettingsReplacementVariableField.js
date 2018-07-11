/* External dpendencies */
import React from "react";
import PropTypes from "prop-types";
import {
	replacementVariablesShape,
	recommendedReplacementVariablesShape,
} from "yoast-components/composites/Plugin/SnippetEditor";
import ReplaceVarEditor from "yoast-components/composites/Plugin/SnippetEditor/components/ReplacementVariableEditor";
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

class SettingsReplacementVariableField extends React.Component {
	constructor( props ) {
		super( props );

		this.state = {
			isActive: false,
			isHovered: false,
		};

		this.focus = this.focus.bind( this );
	}

	focus() {
		this.inputRef.focus();
	}

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
				<ReplaceVarEditor
					label={ label }
					fieldId={ fieldId + "-snippet-editor" }
					isActive={ this.state.isActive }
					isHowvered={ this.state.isHovered }
					content={ field.value }
					onChange={ field.onChange }
					onFocus={ this.focus }
					replacementVariables={ replacementVariables }
					recommendedReplacementVariables={ recommendedReplacementVariables }
					editorRef={ ref => {
						this.inputRef = ref;
					} }
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
