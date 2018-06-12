/* External dpendencies */
import React from "react";
import PropTypes from "prop-types";
import {
	replacementVariablesShape,
} from "yoast-components/composites/Plugin/SnippetEditor";
import ReplaceVarEditor from "yoast-components/composites/Plugin/SnippetEditor/components/ReplacementVariableEditor";
import styled from "styled-components";

/* Internal dependencies */
import linkHiddenFields, { linkFieldsShape } from "./higherorder/linkHiddenField";

const SnippetEditorWidthContainer = styled.div`
	max-width: 640px;
`;

class SettingsTitleReplacementVariableEditor extends React.Component {
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
			field,
		} = this.props;

		return (
			<SnippetEditorWidthContainer>
				<ReplaceVarEditor
					label={ label }
					isActive={ this.state.isActive }
					isHovered={ this.state.isHovered }
					content={ field.value }
					onChange={ field.onChange }
					onFocus={ this.focus }
					replacementVariables={ replacementVariables }
					editorRef={ ref => {
						this.inputRef = ref;
					} }
					/>
			</SnippetEditorWidthContainer>
		);
	}
}

SettingsTitleReplacementVariableEditor.propTypes = {
	replacementVariables: replacementVariablesShape,
	label: PropTypes.string.isRequired,
	field: linkFieldsShape,
};

export default linkHiddenFields( props => {
	return [
		{
			name: "field",
			fieldId: props.fieldId,
		},
	];
} )( SettingsTitleReplacementVariableEditor );
