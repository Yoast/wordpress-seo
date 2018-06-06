import React from "react";
import {
	ReplaceVarEditor,
	TitleInputContainer,
	SimulatedLabel,
} from "yoast-components/composites/Plugin/SnippetEditor";
import uniqueId from "lodash/uniqueId";

import linkHiddenFields from "./higherorder/linkHiddenField";

class SettingsTitleReplacementVariableEditor extends React.Component {
	constructor( props ) {
		super( props );

		this.labelId = `${ uniqueId( "snippet-editor-field-" ) }-title`;

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

		console.log( this.props );

		return (
			<div style={ { maxWidth: 640 } }>
				<SimulatedLabel
					id={ this.labelId }
					onClick={ this.focus } >
					{ label }
				</SimulatedLabel>
				<TitleInputContainer
					onClick={ this.focus }
					isActive={ this.state.isActive }
					isHovered={ this.state.isHovered }>
					<ReplaceVarEditor
						content={ field.value }
						onChange={ field.onChange }
						onFocus={ this.focus }
						replacementVariables={ replacementVariables }
						ref={ ref => {
							this.inputRef = ref;
						} }
						ariaLabelledBy={ this.labelId }
						/>
				</TitleInputContainer>
			</div>
		);
	}
}

export default linkHiddenFields( props => {
	return [
		{
			name: "field",
			fieldId: props.target,
		},
	];
} )( SettingsTitleReplacementVariableEditor );
