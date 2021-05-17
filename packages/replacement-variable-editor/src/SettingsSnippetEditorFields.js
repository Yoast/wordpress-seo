// External dependencies.
import React from "react";
import PropTypes from "prop-types";
import { __ } from "@wordpress/i18n";
import styled from "styled-components";

import ReplacementVariableEditor from "./ReplacementVariableEditor";
import {
	replacementVariablesShape,
	recommendedReplacementVariablesShape,
} from "./constants";

export const StyledEditor = styled.section`
	padding: ${ ( props ) => props.padding ? props.padding : "0 20px" };
`;

/**
 * The snippet editor settings fields.
 */
class SettingsSnippetEditorFields extends React.Component {
	/**
	 * Constructs the snippet editor fields.
	 *
	 * @param {Object}   props                             The props for the editor
	 *                                                     fields.
	 * @param {Object}   props.replacementVariables        The replacement variables
	 *                                                     for this editor.
	 * @param {Object}   props.data                        The initial editor data.
	 * @param {string}   props.data.title                  The initial title.
	 * @param {string}   props.data.description            The initial description.
	 * @param {Function} props.onChange                    Called when the data
	 *                                                     changes.
	 * @param {Function} props.onFocus                     Called when a field is
	 *                                                     focused.
	 * @param {string}   props.activeField                 The field that is
	 *                                                     currently active.
	 * @param {string}   props.hoveredField                The field that is
	 *                                                     currently hovered.
	 * @param {bool}     props.hasNewBadge                 Optional. Whether or not it has a 'New' badge.
	 *
	 * @returns {void}
	 */
	constructor( props ) {
		super( props );

		this.elements = {
			title: null,
			description: null,
		};

		this.setRef = this.setRef.bind( this );
		this.triggerReplacementVariableSuggestions = this.triggerReplacementVariableSuggestions.bind( this );
	}

	/**
	 * Sets ref for field editor.
	 *
	 * @param {string} field The field for this ref.
	 * @param {Object} ref The Draft.js react element.
	 *
	 * @returns {void}
	 */
	setRef( field, ref ) {
		this.elements[ field ] = ref;
	}

	/**
	 * Makes sure the focus is correct after updating the editor fields.
	 *
	 * @param {Object} prevProps The previously received props.
	 *
	 * @returns {void}
	 */
	componentDidUpdate( prevProps ) {
		this.focusOnActiveFieldChange( prevProps.activeField );
	}

	/**
	 * Focuses the currently active field if it wasn't previously active.
	 *
	 * @param {string} prevActiveField The previously active field.
	 *
	 * @returns {void}
	 */
	focusOnActiveFieldChange( prevActiveField ) {
		const { activeField } = this.props;

		if ( activeField && activeField !== prevActiveField ) {
			const activeElement = this.elements[ activeField ];
			activeElement.focus();
		}
	}

	/**
	 * Inserts a % into a ReplacementVariableEditor to trigger the replacement variable suggestions.
	 *
	 * @param {string} fieldName The field name to get the ref for.
	 *
	 * @returns {void}
	 */
	triggerReplacementVariableSuggestions( fieldName ) {
		const element = this.elements[ fieldName ];

		element.triggerReplacementVariableSuggestions();
	}

	/**
	 * Renders the snippet editor.
	 *
	 * @returns {ReactElement} The snippet editor element.
	 */
	render() {
		const {
			descriptionEditorFieldPlaceholder,
			activeField,
			hoveredField,
			replacementVariables,
			recommendedReplacementVariables,
			onFocus,
			onBlur,
			onChange,
			data: {
				title,
				description,
			},
			containerPadding,
			fieldIds,
			labels,
			hasNewBadge,
		} = this.props;

		return (
			<StyledEditor
				padding={ containerPadding }
			>
				<ReplacementVariableEditor
					type="title"
					label={ labels.title || __( "SEO title", "yoast-components" ) }
					onFocus={ () => onFocus( "title" ) }
					onBlur={ onBlur }
					isActive={ activeField === "title" }
					isHovered={ hoveredField === "title" }
					editorRef={ ref => this.setRef( "title", ref ) }
					replacementVariables={ replacementVariables }
					recommendedReplacementVariables={ recommendedReplacementVariables }
					content={ title }
					onChange={ content => onChange( "title", content ) }
					fieldId={ fieldIds.title }
					hasNewBadge={ hasNewBadge }
				/>
				<ReplacementVariableEditor
					type="description"
					placeholder={ descriptionEditorFieldPlaceholder }
					label={ labels.description ||  __( "Meta description", "yoast-components" ) }
					onFocus={ () => onFocus( "description" ) }
					onBlur={ onBlur }
					isActive={ activeField === "description" }
					isHovered={ hoveredField === "description" }
					editorRef={ ref => this.setRef( "description", ref ) }
					replacementVariables={ replacementVariables }
					recommendedReplacementVariables={ recommendedReplacementVariables }
					content={ description }
					onChange={ content => onChange( "description", content ) }
					fieldId={ fieldIds.description }
					hasNewBadge={ hasNewBadge }
				/>
			</StyledEditor>
		);
	}
}

SettingsSnippetEditorFields.propTypes = {
	replacementVariables: replacementVariablesShape,
	recommendedReplacementVariables: recommendedReplacementVariablesShape,
	onChange: PropTypes.func.isRequired,
	onFocus: PropTypes.func,
	onBlur: PropTypes.func,
	data: PropTypes.shape( {
		title: PropTypes.string,
		description: PropTypes.string,
	} ).isRequired,
	activeField: PropTypes.oneOf( [ "title", "description" ] ),
	hoveredField: PropTypes.oneOf( [ "title", "description" ] ),
	descriptionEditorFieldPlaceholder: PropTypes.string,
	containerPadding: PropTypes.string,
	fieldIds: PropTypes.shape( {
		title: PropTypes.string.isRequired,
		description: PropTypes.string.isRequired,
	} ).isRequired,
	labels: PropTypes.shape( {
		title: PropTypes.string,
		description: PropTypes.string,
	} ),
	hasNewBadge: PropTypes.bool,
};

SettingsSnippetEditorFields.defaultProps = {
	replacementVariables: [],
	onFocus: () => {},
	onBlur: () => {},
	containerPadding: "0 20px",
	descriptionEditorFieldPlaceholder: null,
	labels: {},
	hasNewBadge: false,
};

export default SettingsSnippetEditorFields;
