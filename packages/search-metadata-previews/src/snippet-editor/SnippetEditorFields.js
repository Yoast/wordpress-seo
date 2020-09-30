// External dependencies.
import React from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import uniqueId from "lodash/uniqueId";
import { __ } from "@wordpress/i18n";

// Yoast dependencies.
import { colors } from "@yoast/style-guide";
import {
	ReplacementVariableEditor,
	replacementVariablesShape,
	recommendedReplacementVariablesShape,
} from "@yoast/replacement-variable-editor";
import { ProgressBar } from "@yoast/components";
import { VariableEditorInputContainer, SimulatedLabel } from "@yoast/components";
import { withCaretStyles } from "@yoast/style-guide";

// Internal dependencies.
import {
	StyledEditor,
} from "./SettingsSnippetEditorFields";
import {
	lengthProgressShape,
} from "./constants";

const SlugInput = styled.input`
	border: none;
	width: 100%;
	height: inherit;
	line-height: inherit;
	font-family: inherit;
	font-size: inherit;
	color: inherit;

	&:focus {
		outline: 0;
	}
`;

const InputContainerWithCaretStyles = withCaretStyles( VariableEditorInputContainer );

/**
 * The snippet editor fields component.
 */
class SnippetEditorFields extends React.Component {
	/**
	 * Constructs the snippet editor fields.
	 *
	 * @param {Object}   props                                 The props for the editor
	 *                                                         fields.
	 * @param {Object[]} props.replacementVariables            The replacement variables
	 *                                                         for this editor.
	 * @param {Object[]} props.recommendedReplacementVariables The recommended replacement
	 *                                                         variables for this editor.
	 * @param {Object}   props.data                            The initial editor data.
	 * @param {string}   props.data.title                      The initial title.
	 * @param {string}   props.data.slug                       The initial slug.
	 * @param {string}   props.data.description                The initial description.
	 * @param {Function} props.onChange                        Called when the data
	 *                                                         changes.
	 * @param {Function} props.onFocus                         Called when a field is
	 *                                                         focused.
	 * @param {Object}   props.titleLengthProgress             The values for the title
	 *                                                         length assessment.
	 * @param {Object}   props.descriptionLengthProgress       The values for the
	 *                                                         description length
	 *                                                         assessment.
	 * @param {string}   props.activeField                     The field that is
	 *                                                         currently active.
	 * @param {string}   props.hoveredField                    The field that is
	 *                                                         currently hovered.
	 *
	 * @returns {void}
	 */
	constructor( props ) {
		super( props );

		this.elements = {
			title: null,
			slug: null,
			description: null,
		};

		this.uniqueId = uniqueId( "snippet-editor-field-" );

		this.setRef = this.setRef.bind( this );
		this.triggerReplacementVariableSuggestions = this.triggerReplacementVariableSuggestions.bind( this );
	}

	/**
	 * Sets the refs for the editor fields.
	 *
	 * @param {string} fieldName The field name for this ref.
	 * @param {Object} ref       The Draft.js react element.
	 *
	 * @returns {void}
	 */
	setRef( fieldName, ref ) {
		this.elements[ fieldName ] = ref;
	}

	/**
	 * Makes sure the focus is correct after updating the editor fields.
	 *
	 * For example, the component will update when clicking on the field labels.
	 * In this case, we need to focus again the field.
	 *
	 * @param {Object} prevProps The previous props.
	 * @returns {void}
	 */
	componentDidUpdate( prevProps ) {
		if ( prevProps.activeField !== this.props.activeField ) {
			this.focusOnActiveFieldChange();
		}
	}

	/**
	 * Focuses the currently active field if it wasn't previously active.
	 *
	 * @returns {void}
	 */
	focusOnActiveFieldChange() {
		const { activeField } = this.props;
		const activeElement = activeField ? this.elements[ activeField ] : null;
		/*
		 * The editor might not render if any previous error occurs, so better
		 * to check for the existence of the DOM node before trying to use it.
		 */
		if ( activeElement ) {
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
			activeField,
			hoveredField,
			replacementVariables,
			recommendedReplacementVariables,
			titleLengthProgress,
			descriptionLengthProgress,
			onFocus,
			onBlur,
			onChange,
			descriptionEditorFieldPlaceholder,
			data: {
				title,
				slug,
				description,
			},
			containerPadding,
			titleInputId,
			slugInputId,
			descriptionInputId,
		} = this.props;

		const slugLabelId = `${ this.uniqueId }-slug`;

		return (
			<StyledEditor
				padding={ containerPadding }
			>
				<ReplacementVariableEditor
					withCaret={ true }
					label={ __( "SEO title", "yoast-components" ) }
					onFocus={ () => onFocus( "title" ) }
					onBlur={ () => onBlur() }
					isActive={ activeField === "title" }
					isHovered={ hoveredField === "title" }
					editorRef={ ref => this.setRef( "title", ref ) }
					replacementVariables={ replacementVariables }
					recommendedReplacementVariables={ recommendedReplacementVariables }
					content={ title }
					onChange={ content => onChange( "title", content ) }
					fieldId={ titleInputId }
					type="title"
				/>
				<ProgressBar
					max={ titleLengthProgress.max }
					value={ titleLengthProgress.actual }
					progressColor={ this.getProgressColor( titleLengthProgress.score ) }
				/>
				<SimulatedLabel
					id={ slugLabelId }
					onClick={ () => onFocus( "slug" ) }
				>
					{ __( "Slug", "yoast-components" ) }
				</SimulatedLabel>
				<InputContainerWithCaretStyles
					onClick={ () => this.elements.slug.focus() }
					isActive={ activeField === "slug" }
					isHovered={ hoveredField === "slug" }
				>
					<SlugInput
						value={ slug }
						onChange={ event => onChange( "slug", event.target.value ) }
						onFocus={ () => onFocus( "slug" ) }
						onBlur={ () => onBlur() }
						ref={ ref => this.setRef( "slug", ref ) }
						aria-labelledby={ this.uniqueId + "-slug" }
						id={ slugInputId }
					/>
				</InputContainerWithCaretStyles>
				<ReplacementVariableEditor
					withCaret={ true }
					type="description"
					placeholder={ descriptionEditorFieldPlaceholder }
					label={ __( "Meta description", "yoast-components" ) }
					onFocus={ () => onFocus( "description" ) }
					onBlur={ () => onBlur() }
					isActive={ activeField === "description" }
					isHovered={ hoveredField === "description" }
					editorRef={ ref => this.setRef( "description", ref ) }
					replacementVariables={ replacementVariables }
					recommendedReplacementVariables={ recommendedReplacementVariables }
					content={ description }
					onChange={ content => onChange( "description", content ) }
					fieldId={ descriptionInputId }
				/>
				<ProgressBar
					max={ descriptionLengthProgress.max }
					value={ descriptionLengthProgress.actual }
					progressColor={ this.getProgressColor( descriptionLengthProgress.score ) }
				/>
			</StyledEditor>
		);
	}

	/**
	 * Returns the progress color for a given score.
	 *
	 * @param {number} score The score to determine a color for.
	 *
	 * @returns {string} A hex color.
	 */
	getProgressColor( score ) {
		if ( score >= 7 ) {
			return colors.$color_good;
		}

		if ( score >= 5 ) {
			return colors.$color_ok;
		}

		return colors.$color_bad;
	}
}

SnippetEditorFields.propTypes = {
	replacementVariables: replacementVariablesShape,
	recommendedReplacementVariables: recommendedReplacementVariablesShape,
	onChange: PropTypes.func.isRequired,
	onFocus: PropTypes.func,
	onBlur: PropTypes.func,
	data: PropTypes.shape( {
		title: PropTypes.string.isRequired,
		slug: PropTypes.string.isRequired,
		description: PropTypes.string.isRequired,
	} ).isRequired,
	activeField: PropTypes.oneOf( [ "title", "slug", "description" ] ),
	hoveredField: PropTypes.oneOf( [ "title", "slug", "description" ] ),
	titleLengthProgress: lengthProgressShape,
	descriptionLengthProgress: lengthProgressShape,
	descriptionEditorFieldPlaceholder: PropTypes.string,
	containerPadding: PropTypes.string,
	titleInputId: PropTypes.string,
	slugInputId: PropTypes.string,
	descriptionInputId: PropTypes.string,
};

SnippetEditorFields.defaultProps = {
	replacementVariables: [],
	onFocus: () => {},
	onBlur: () => {},
	titleLengthProgress: {
		max: 600,
		actual: 0,
		score: 0,
	},
	descriptionLengthProgress: {
		max: 156,
		actual: 0,
		score: 0,
	},
	containerPadding: "0 20px",
	titleInputId: "yoast-google-preview-title",
	slugInputId: "yoast-google-preview-slug",
	descriptionInputId: "yoast-google-preview-description",
};

export default SnippetEditorFields;
