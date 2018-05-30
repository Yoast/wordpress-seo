/* External dependencies */
import React from "react";
import PropTypes from "prop-types";
import uniqueId from "lodash/uniqueId";
import { __ } from "@wordpress/i18n";

/* Internal dependencies */
import ReplacementVariableEditor from "./ReplacementVariableEditor";
import { replacementVariablesShape } from "../constants";
import {
	InputContainer,
	DescriptionInputContainer,
	FormSection,
	SimulatedLabel,
	StyledEditor,
} from "./Shared";

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
	 *
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
	 * Makes sure the focus is correct after mounting the editor fields.
	 *
	 * @returns {void}
	 */
	componentDidMount() {
		this.focusOnActiveFieldChange( null );
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
	 * Renders the snippet editor.
	 *
	 * @returns {ReactElement} The snippet editor element.
	 */
	render() {
		const {
			activeField,
			hoveredField,
			replacementVariables,
			onFocus,
			onChange,
			data: {
				title,
				description,
			},
		} = this.props;

		const titleLabelId = `${ this.uniqueId }-title`;
		const descriptionLabelId = `${ this.uniqueId }-description`;

		return (
			<StyledEditor>
				<FormSection>
					<SimulatedLabel
						id={ titleLabelId }
						onClick={ () => onFocus( "title" ) } >
						{ __( "SEO title", "yoast-components" ) }
					</SimulatedLabel>
					<InputContainer
						onClick={ () => this.elements.title.focus() }
						isActive={ activeField === "title" }
						isHovered={ hoveredField === "title" }>
						<ReplacementVariableEditor
							content={ title }
							onChange={ content => onChange( "title", content ) }
							onFocus={ () => onFocus( "title" ) }
							replacementVariables={ replacementVariables }
							ref={ ( ref ) => this.setRef( "title", ref ) }
							ariaLabelledBy={ titleLabelId }
						/>
					</InputContainer>
				</FormSection>
				<FormSection>
					<SimulatedLabel
						id={ descriptionLabelId }
						onClick={ () => onFocus( "description" ) } >
						{ __( "Meta description", "yoast-components" ) }
					</SimulatedLabel>
					<DescriptionInputContainer
						onClick={ () => this.elements.description.focus() }
						isActive={ activeField === "description" }
						isHovered={ hoveredField === "description" }>
						<ReplacementVariableEditor
							content={ description }
							onChange={ content => onChange( "description", content ) }
							onFocus={ () => onFocus( "description" ) }
							replacementVariables={ replacementVariables }
							ref={ ( ref ) => this.setRef( "description", ref ) }
							ariaLabelledBy={ descriptionLabelId }
						/>
					</DescriptionInputContainer>
				</FormSection>
			</StyledEditor>
		);
	}
}

SettingsSnippetEditorFields.propTypes = {
	replacementVariables: replacementVariablesShape,
	onChange: PropTypes.func.isRequired,
	onFocus: PropTypes.func,
	data: PropTypes.shape( {
		title: PropTypes.string.isRequired,
		description: PropTypes.string,
	} ).isRequired,
	activeField: PropTypes.oneOf( [ "title", "description" ] ),
	hoveredField: PropTypes.oneOf( [ "title", "description" ] ),
};

SettingsSnippetEditorFields.defaultProps = {
	replacementVariables: [],
	onFocus: () => {},
};

export default SettingsSnippetEditorFields;
