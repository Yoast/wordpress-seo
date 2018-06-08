/* External dependencies */
import React from "react";
import PropTypes from "prop-types";
import uniqueId from "lodash/uniqueId";
import { __ } from "@wordpress/i18n";
import styled from "styled-components";

/* Internal dependencies */
import ReplacementVariableEditor from "./ReplacementVariableEditor";
import { replacementVariablesShape } from "../constants";
import {
	TitleInputContainer,
	DescriptionInputContainer,
	SimulatedLabel,
} from "./Shared";

const FormSection = styled.div`
	margin: 10px 0;
`;

const StyledEditor = styled.div`
	padding: 0 20px;
`;

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
	 * @returns {void}
	 */
	constructor( props ) {
		super( props );

		this.elements = {
			title: null,
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
			descriptionEditorFieldPlaceholder,
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
					<TitleInputContainer
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
					</TitleInputContainer>
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
							placeholder={ descriptionEditorFieldPlaceholder }
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
		title: PropTypes.string,
		description: PropTypes.string,
	} ).isRequired,
	activeField: PropTypes.oneOf( [ "title", "description" ] ),
	hoveredField: PropTypes.oneOf( [ "title", "description" ] ),
	descriptionEditorFieldPlaceholder: PropTypes.string,
};

SettingsSnippetEditorFields.defaultProps = {
	replacementVariables: [],
	onFocus: () => {},
};

export default SettingsSnippetEditorFields;
